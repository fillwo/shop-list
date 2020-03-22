import Vue from 'vue'
import Vuex from 'vuex'
import queue from '../queue'
import {
  UPDATE_ITEM_DONE,
  DELETE_ITEM,
  ADD_ITEM,
  SET_ALL,
  SET_ONLINE,
  INCREMENT_QUEUE,
  CLEAR_QUEUE,
  SET_QUEUE,
  SET_LOGGEDIN,
}
from './mutation-types'
import {
  GET_ALL_DATA,
  POST_UPDATE_DONE,
  POST_ADD_ITEM,
  POST_DELETE_ITEM,
  POST_LOGIN,
}
from './action-types'
import api from '../api'

const getIndex = (arr, filFunc) => {
  var idx
  arr.forEach((d,i) => {
    if (filFunc(d)) {
      idx = i
    }
  })
  return idx
}

Vue.use(Vuex)

const state = {
  shopList: [],
  online: false,
  loggedIn: false,
  socketId: null,
  queued: 0
}

const mutations = {
  [UPDATE_ITEM_DONE] (state, { id, done }) {
    const idx = getIndex(state.shopList, d => d.id === id)
    if (typeof idx != 'undefined') {
      state.shopList[idx].done =  done
    }
  },

  [DELETE_ITEM] (state, {  id }) {
    const idx = getIndex(state.shopList, d => d.id === id)
    if (typeof idx != 'undefined') {
      state.shopList.splice(idx, 1)
    }
  },

  [ADD_ITEM] (state, {  id, content, done }) {
    state.shopList.push({id, content, done})
  },

  [SET_ALL] (state, { newState }) {
    state.shopList = newState
  },

  [SET_ONLINE] (state, { online, socketId }) {
    state.online = online
    state.socketId = socketId
  },

  [INCREMENT_QUEUE] (state) {
    state.queued += 1
  },

  [CLEAR_QUEUE] (state) {
    state.queued = 0
  },

  [SET_QUEUE] (state, { queued }) {
    state.queued = queued
  },

  [SET_LOGGEDIN] (state, { loggedIn }) {
    state.loggedIn = loggedIn
  }
}

const actions = {
  [GET_ALL_DATA] ({ commit }) {
    return api.getShopList()
      .then(res => {
        commit({
          type: SET_ALL,
          newState: res.data
        })
        queue.makeSnapShot(state.shopList)
      })
  },
  [POST_ADD_ITEM] ({ state, commit }, { itemName }) {
    return api.addItem(itemName, state.socketId)
      .then(res => {
        commit({
          type: ADD_ITEM,
          ...res.data
        })
        queue.makeSnapShot(state.shopList)
      })
      .catch(err => {
        // without status must be network error
        if (!err.response) {
          console.error('could not add item, push to queue', err.message)
          queue.pushItem({type: POST_ADD_ITEM, itemName})
          commit({
            type: ADD_ITEM,
            id: Math.max(Math.max(...state.shopList.map(d => d.id)), 0) + 1,
            content: itemName,
            done: false
          })
          queue.makeSnapShot(state.shopList)
          commit(INCREMENT_QUEUE)
        }
        throw err
      })
  },
  [POST_DELETE_ITEM] ({ state, commit }, { id }) {
    return api.deleteItem(id, state.socketId)
      .then(() => {
        commit({
          type: DELETE_ITEM,
          id: id
        })
        queue.makeSnapShot(state.shopList)
      })
      .catch(err => {
        // without status must be network error
        if (!err.response) {
          console.error('could not delete item, push to queue', err)
          queue.pushItem({type: POST_DELETE_ITEM, id})
          commit(INCREMENT_QUEUE)
          commit({
            type: DELETE_ITEM,
            id: id
          })
          queue.makeSnapShot(state.shopList)
        }
        throw err
      })
  },
  [POST_UPDATE_DONE] ({ state, commit }, { id, done }) {
    return api.updateDone(id, done, state.socketId)
      .then(res => {
        console.log('debug', res.data)
        commit({
          type: UPDATE_ITEM_DONE,
          ...res.data
        })
        queue.makeSnapShot(state.shopList)
      })
      .catch(err => {
        // without status must be network error
        if (!err.response) {
          console.error('could not update done, push to queue', err)
          queue.pushItem({type: POST_UPDATE_DONE, id, done})
          commit(INCREMENT_QUEUE)
          commit({
            type: UPDATE_ITEM_DONE,
            id,
            done
          })
          queue.makeSnapShot(state.shopList)
          throw err
        }

        console.log('deusadgas', err.response, err.response.status)
        if (err.response.status === 404) {
          console.log('not found')
        } else {
          throw err
        }
      })
  },
  [POST_LOGIN] ({ commit }, { name, pwd }) {
    return api.login(name, pwd)
      .then(res => {
        window.localStorage.setItem('token', res.data.token)
        commit({
          type: SET_LOGGEDIN,
          loggedIn: true
        })
      })

  }
}


export default new Vuex.Store({
  state,
  mutations,
  actions
})
