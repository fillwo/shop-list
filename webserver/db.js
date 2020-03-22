const fs = require('fs')

const getIndex = (arr, filFunc) => {
    var idx
    arr.forEach((d,i) => {
      if (filFunc(d)) {
        idx = i
      }
    })
    return idx
}

class shopListDB {
    constructor() {
        if (process.env.NODE_ENV === 'production') {
            this.data = []
            this.id = 1
        } else {
            this.data = JSON.parse(fs.readFileSync('./test_data.json'))
            this.id = Math.max(Math.max(...this.data.map(d => d.id)), 1) + 1
        }
    }

    addItem({ itemName }) {
        let newItem = {id: this.id, content: itemName, done: false}
        this.data.push(newItem)
        this.id += 1
        return newItem
    }

    deleteItem({ id }) {
        this.data = this.data.filter(d => d.id !== id)
    }

    updateDone({ id, done }) {
        const idx = getIndex(this.data, d => d.id === id)
        this.data[idx].done = done
        return this.data[idx]
    }
}

class userDB {
    constructor() {
        this.data = JSON.parse(fs.readFileSync('./user_data.json'))
    }

    verifyUser({ name, pwd }) {
        const user = this.data.filter(d => d.name === name)
        if (user.length < 1) {
            return false
        }
        if (user[0].pwd === pwd) {
            return user[0]
        } else {
            return false
        }
    }
}

module.exports = { shopListDB, userDB }