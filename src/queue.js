const listKey = 'shoppingBuffer'
const snapShotKey = 'shopList'

export default {
    pushItem(item) {
        if (window.localStorage.getItem(listKey) === null) {
            window.localStorage.setItem(listKey, JSON.stringify([item]))
        } else {
            let list = new Set(JSON.parse(window.localStorage.getItem(listKey)))
            list.add(item)
            window.localStorage.setItem(listKey, JSON.stringify([...list]))
        }
    },
    getAll() {
        return JSON.parse(window.localStorage.getItem(listKey))
    },
    clearAll() {
        window.localStorage.removeItem(listKey)
    },
    isEmpty() {
        return window.localStorage.getItem(listKey) === null
    },
    getLen() {
        var obj = JSON.parse(window.localStorage.getItem(listKey))
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    },
    makeSnapShot(l) {
        window.localStorage.setItem(snapShotKey, JSON.stringify(l))
    },
    getSnapShot() {
        return JSON.parse(window.localStorage.getItem(snapShotKey)) || []
    }
}