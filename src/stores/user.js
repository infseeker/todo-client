import { defineStore } from 'pinia'

export const userStore = defineStore({
  id: 'user',
  state:() => ({
    isAuth: false,
    isAdmin: false,
    isLoaded: false,
  
    login: function (data) {
      this.isAuth = data.login || false;
      this.isAdmin = data.admin || false;
      this.isDeleted = data.deleted || false;
    },
  
    logout: function () {
      this.isAuth = false;
      this.isAdmin = false;
    },
  }),
  getters: {

  },
  actions: {
    
  }
})