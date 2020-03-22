const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs')

const db = require('./db')

const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http);

var shopList = new db.shopListDB()
var userList = new db.userDB()

const privateKey = fs.readFileSync('./id_rsa', 'utf-8')
const publicKey = fs.readFileSync('./id_rsa.pub', 'utf-8')

// enable json parsing
app.use(bodyParser.json());

// enable CORS (only for development)
if (process.env.NODE_ENV === 'development') {
    app.use( (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "http://localhost:8080");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
    })
    console.log('CORS enabled!')
}

// websocket API
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

const broadcast = (sIo, exclude, payload) => {
    const allClients = Object.keys(sIo.sockets.clients().sockets)
    allClients.filter(cl => cl !== exclude).forEach(c => {
        console.log('broadcast to', c)
        sIo.to(c).emit('refresh_data', payload)
    }) 
}

// jwt verification
const verifyJwt = (req, res, next) => {
    const headers = req.headers
    if (typeof headers.authorization === 'undefined') {
        res.sendStatus(403)
    } else {
        const token = headers.authorization.split(' ')[1]
        jwt.verify(token, publicKey, { algorithms: ['RS256'] }, function(err, decoded) {
            if (err) {
                console.log('error verify token', err)
                res.sendStatus(403)
            } else {
                req.decoded_token = decoded
                next()
            }
        })
    }
}

// REST API
app.post('/shopListLogin', function(req, res) {
    console.log('post /shopListLogin', req.body)
    const success = userList.verifyUser(req.body)
    if (success) {
        console.log('debug', {name: success.name})
        // const oneDay = Math.floor(Date.now() / 1000) + (60 * 60 * 24)
        jwt.sign({name: success.name}, privateKey, { algorithm: 'RS256' }, function(err, token) {
            if (err) {
                res.sendStatus(500)
            } else {
                res.json({token})
            }
          })
    } else {
        res.sendStatus(403)
    }
});

app.get('/shopList', verifyJwt, function (req, res) {
    console.log('get /shopList')
    res.json(shopList.data);
});

app.get('/checkToken', verifyJwt, function (req, res) {
    console.log('get /checkToken')
    res.sendStatus(200);
});

app.post('/addItem', verifyJwt, function (req, res) {
    console.log('got post request', req.body)
    let newItem = shopList.addItem(req.body)
    broadcast(io, req.body.socketId)
    res.json(newItem);
});

app.post('/deleteItem', verifyJwt, function (req, res) {
    console.log('got post request', req.body)
    shopList.deleteItem(req.body)
    broadcast(io, req.body.socketId)
    res.send('POST request deleteItem');
});

app.post('/updateDone', verifyJwt, function (req, res) {
    console.log('got post request', req.body)
    try {
        var updItem = shopList.updateDone(req.body)
    } catch(err) {
        console.log('caught update error')
        res.sendStatus(404)
    }
    broadcast(io, req.body.socketId)
    res.json(updItem);
});

// static files in production
if (process.env.NODE_ENV === 'production') {
    app.use('/tobuy', express.static('dist'))
}


http.listen(5000)

console.log('app listening on port 5000')