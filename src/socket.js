import io from 'socket.io-client'
import { SET_ONLINE } from './store/mutation-types'
import { GET_ALL_DATA } from './store/action-types'
import store from './store'

const socket = io(process.env.VUE_APP_API_ENDPOINT)

socket.on('connect', () => {
    store.commit({
        type: SET_ONLINE,
        online: true,
        socketId: socket.id
    })
    console.log('connected to socket!!', socket.id)
})

socket.on('disconnect', (reason) => {
    store.commit({
        type: SET_ONLINE,
        online: false,
        socketId: null
    })
    console.log('disconnected from socket!!', reason)
})

socket.on('refresh_data', () => {
    console.log('refresh because of socket push')
    store.dispatch(GET_ALL_DATA)
})