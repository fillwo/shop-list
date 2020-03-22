<template>
  <v-container>

    <v-card>
      <v-list>
        <v-subheader> To Buy </v-subheader>
        <v-progress-linear v-if="shopList.length > 1" :value="percentageOpen" color="accent"></v-progress-linear>
        <v-list-item class="shop-list-item" v-for="item in filterData(shopList, filter)" :key=item.id>
          <v-list-item-action>
            <v-checkbox
              :input-value="item.done"
              @change="(e) => checkedChanged(e, item.id)">
              <!-- color="secondary"> -->
            </v-checkbox>
          </v-list-item-action>
          <v-list-item-content> 
            <v-list-item-title> {{  item.content }} </v-list-item-title>
          </v-list-item-content>
          <!-- <v-list-item-avatar color="secondary"> P </v-list-item-avatar> -->
        <v-list-item-icon>
          <v-icon @click="deleteRow(item)">mdi-delete</v-icon>
        </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>

</template>

<script>
import {
  POST_DELETE_ITEM,
  POST_UPDATE_DONE
} from '../store/action-types'

export default {
  name: 'ShoppingList',

  props: ['filter'],

  data: () => ({
  }),

  methods: {
    checkedChanged(e, id) {
      console.log('input changed', e, id)
      this.$store.dispatch({
        type: POST_UPDATE_DONE,
        id: id,
        done: e
      })
    },
    deleteRow(row) {
      console.log('delete row', row)
      this.$store.dispatch({
        type: POST_DELETE_ITEM,
        id: row.id
      })
    },
    filterData(data, filter) {
      if (filter === 0) {
        return data
      } else if (filter === 1) {
        return data.filter(d => !d.done)
      } else if (filter === 2) {
        return data.filter(d => d.done)
      } else {
        return
      }
    },
    deleteDone() {
      this.filterData(this.shopList, 2).forEach(item => this.deleteRow(item))
    },
    scrollToLastItem() {
      this.$vuetify.goTo(document.querySelector('.v-list .shop-list-item:last-child'), {offset: 500})
    }
  },

  computed: {
    shopList() {
      return this.$store.state.shopList
    },
    percentageOpen() {
      return ( this.shopList.filter(d => d.done).length / ( this.shopList.length || 1 ) ) * 100
    }
  }
};
</script>
