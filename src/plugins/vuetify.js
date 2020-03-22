import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
      options: {
        customProperties: true,
      },
    themes: {
      light: {
        primary: '#607D8B', //#1c495f
        accent: '#00BCD4', //#4CAF50
        secondary: '#4CAF50',
        success: '#4CAF50',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252'
      },
      dark: {
        primary: '#00838F', //#1c495f
        accent: '#00BCD4', //#4CAF50
        secondary: '#4CAF50',
        success: '#4CAF50',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252'
      },
    },
  },
});
