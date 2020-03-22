<template>
  <v-row justify="center">
      <v-dialog v-model="value" persistent max-width="600px">
      <v-card>
          <v-card-title>
          <span class="headline">Add to List</span>
          </v-card-title>
          <v-card-text>
          <v-container>
              <v-row>
              <v-col cols="12">
                  <v-text-field v-model="dialogInput" label="Item" required></v-text-field>
              </v-col>
              </v-row>
          </v-container>
          </v-card-text>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined color="primary" @click="$emit('input', false)">Close</v-btn>
          <v-btn color="accent" @click="addItem">Save</v-btn>
          </v-card-actions>
      </v-card>
      </v-dialog>
  </v-row>
</template>

<script>
import { POST_ADD_ITEM } from './../store/action-types'

export default {
  name: 'AddModal',

  props: ['value'],

  data: () => ({
    dialogInput: ''
  }),

  methods: {
    addItem() {
      this.$store.dispatch({
        type: POST_ADD_ITEM,
        itemName: this.dialogInput
      }).finally(() => {
        this.$emit('itemAdded')
      })
      this.$emit('input', false)
      this.dialogInput = ''
    },
  },

};
</script>
