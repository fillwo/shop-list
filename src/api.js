import axios from 'axios'

const endPointUrl = process.env.VUE_APP_API_ENDPOINT
const addBearerHeader = () => {
    const token = window.localStorage.getItem('token') || ''
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    return config 
}

export default {
    login(name, pwd) {
        return axios.post(`${endPointUrl}/shopListLogin`, { name, pwd })
    },
    checkToken() {
        return axios.get(`${endPointUrl}/checkToken`, addBearerHeader())
    },
    getShopList() {
        return axios.get(`${endPointUrl}/shopList`, addBearerHeader())
    },
    addItem(itemName, socketId) {
        return axios.post(`${endPointUrl}/addItem`, { itemName, socketId }, addBearerHeader())
    },
    deleteItem(id, socketId) {
        return axios.post(`${endPointUrl}/deleteItem`, { id, socketId }, addBearerHeader())
    },
    updateDone(id, done, socketId) {
        return axios.post(`${endPointUrl}/updateDone`, { id, done, socketId }, addBearerHeader())
    }
}