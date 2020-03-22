<template>
  <v-app>

    <v-app-bar
      app
      color="primary"
      dark
      :extended="loggedIn || isChecking"
    >
      <img
        class="elevation-3 ma-2"
        style="border-radius: 50%;"
        height="40px" width="40px"
        :src="require('./assets/android-chrome-512x512.png')"
      >

      <div class="d-flex align-center title">
        shop-list
      </div>

      <v-spacer></v-spacer>

      <span style="margin-right: 10px;"> {{ queued > 0 ? `queued: ${queued}` : '' }} </span>
      <span :class="[!online ? 'error--text' : '', !online ? 'font-weight-bold' : '']">
        {{ online ? 'online' : 'offline' }}
      </span>
      <v-icon :color="online ? 'secondary' : 'error'">mdi-swap-vertical</v-icon>

      <template v-if="loggedIn" v-slot:extension>
        <v-btn @click="deleteDone" text color="white">
          delete done<v-icon>mdi-delete</v-icon>
        </v-btn>

        <v-btn @click="logout" text color="white">
          logout <v-icon>mdi-logout</v-icon>
        </v-btn>

        <v-btn absolute bottom right class="mx-2" fab dark color="accent" @click="dialogOpen = true">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <v-content>
      <div v-if="loggedIn">
        <ShoppingList ref="shoplist" :filter="selectedTab"/>
        <AddModal v-model="dialogOpen" @itemAdded="$refs.shoplist.scrollToLastItem()"/>
      </div>
      <div v-else>
        <div v-if="isChecking">
          <v-container>
            <v-card>
              <v-skeleton-loader
                type="card-heading, list-item, list-item, list-item,
                list-item, list-item, list-item, list-item, list-item, list-item,
                list-item, list-item, list-item">
              </v-skeleton-loader>
            </v-card>
          </v-container>
        </div>
        <Login v-else/>
      </div>
    </v-content>

    <v-bottom-navigation
      app
      v-if="loggedIn"
      v-model="selectedTab"
      color="primary"
      grow
    >
      <v-btn>
        <span>All</span>
        <v-icon>mdi-view-list</v-icon>
      </v-btn>

      <v-btn>
        <span>Open</span>
        <v-badge right color="warning">
          <span v-if="numOpen > 0" slot="badge"> {{ numOpen }} </span>
          <v-icon>mdi-cart-arrow-down</v-icon>
        </v-badge>
      </v-btn>

      <v-btn>
        <span>Done</span>
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </v-bottom-navigation>

  </v-app>
</template>

<script>
import './socket'
import queue from './queue'
import api from './api'
import ShoppingList from './components/ShoppingList'
import Login from './components/Login'
import AddModal from './components/AddModal'
import {
  SET_ALL,
  SET_QUEUE,
  CLEAR_QUEUE,
  SET_LOGGEDIN
} from './store/mutation-types'
import {
  GET_ALL_DATA
} from './store/action-types';

export default {
  name: 'App',

  components: {
    ShoppingList,
    Login,
    AddModal
  },

  data: () => ({
    selectedTab: 0,
    dialogOpen: false,
    isChecking: false
  }),

  mounted() {
    // check if token exists & is valid
    // then login
    const token = window.localStorage.getItem('token')
    if (token) {
      this.isChecking = true
      api.checkToken()
        .then(() => {
          this.$store.commit({
            type: SET_LOGGEDIN,
            loggedIn: true
          })
        })
        .catch(err => {
          // login in offline case
          // without status must be network error
          if (!err.response) {
            console.log('detected offline case')
            this.$store.commit({
              type: SET_LOGGEDIN,
              loggedIn: true
            })
          }
        })
        .finally(() => this.isChecking = false)
    }

    // set length of queue
    this.$store.commit({
      type: SET_QUEUE,
      queued: queue.getLen()
    })

    // apply shoplist from queue if offline
    if (!this.online) {
      this.$store.commit({
        type: SET_ALL,
        newState: queue.getSnapShot()
      })
    }
  },

  methods: {
    logout() {
      window.localStorage.setItem('token', '')
      this.$store.commit({
        type: SET_LOGGEDIN,
        loggedIn: false
      })
    },
    deleteDone() {
      this.$refs.shoplist.deleteDone()
    }
  },

  computed: {
    online() {
      return this.$store.state.online
    },
    numOpen() {
      return this.$store.state.shopList.filter(d => !d.done).length
    },
    queued() {
      return this.$store.state.queued
    },
    loggedIn() {
      return this.$store.state.loggedIn
    },
    onlineAndLoggedIn() {
      return this.online && this.loggedIn
    }
  },

  watch: {
    onlineAndLoggedIn(newV) {
      if (newV) {
        // fetch data from api
        this.$store.dispatch(GET_ALL_DATA)
          .catch(() => {
            this.$store.commit({
              type: SET_ALL,
              newState: queue.getSnapShot()
            })
          })

        // check if changes from queue must be applied
        if (queue.getLen() > 0) {
          let res = []
          queue.getAll().forEach(q => {
            res.push(this.$store.dispatch(q))
          })

          Promise.all(res)
            .then(() => {
              queue.clearAll()
              this.$store.commit(CLEAR_QUEUE)
            })
            .catch(err => console.warn('could not apply updates from queue', err))
        }

      }

    }
  }
};
</script>
