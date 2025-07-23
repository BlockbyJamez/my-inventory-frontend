import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    isViewer: (state) => state.user?.role === 'viewer',
  },
  actions: {
    login(userData) {
      this.user = {
        username: userData.username,
        role: userData.role,
        email: userData.email,
      };
      localStorage.setItem("username", userData.username);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("email", userData.email);
    },
    logout() {
      this.user = null;
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
    },
  },
})
