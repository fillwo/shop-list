<template>
  <v-container>
    <v-row no-gutters class="mt-12" justify="center">
      <v-col cols="12" sm="6">
        <v-card>
          <v-container>
            <v-card-title>Login</v-card-title>
            <v-card-subtitle
              :class="[loginError ? 'error--text' : '' ]"
            >{{loginError ? 'Provided Login Data is not correct!' : 'Please enter your credentials'}}</v-card-subtitle>
            <v-spacer></v-spacer>
            <v-card-text>
              <v-text-field
                v-model="nameInput"
                label="Name"
                :disabled="!online"
                outlined
                dense>
              </v-text-field>
              <v-text-field
                v-model="pwdInput"
                label="Password"
                :type="hidePwd ? 'password' : 'text'"
                :append-icon="hidePwd ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="hidePwd = !hidePwd"
                :disabled="!online"
                outlined
                dense
              ></v-text-field>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="accent" :loading="loading" text @click="login">submit</v-btn>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { POST_LOGIN } from "../store/action-types";

export default {
  name: "Login",

  // props: ["filter"],

  data: () => ({
    nameInput: '',
    pwdInput: '',
    loginError: false,
    hidePwd: true,
    loading: false
  }),

  methods: {
    login() {
      if (this.nameInput === '' || this.pwdInput === '') {
        this.loginError = true
      } else {
        this.loading = true
        this.$store.dispatch({
          type: POST_LOGIN,
          name: this.nameInput,
          pwd: this.pwdInput
        })
        .then(() => {
          this.loading = false
          this.loginError = false
        })
        .catch(() => {
          this.loading = false
          this.loginError = true
        })
      }
    }
  },

  computed: {
    online() {
      return this.$store.state.online
    },
  }
};
</script>
