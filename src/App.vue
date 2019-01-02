<template>
<div id="app">
  <!-- <div class="page-container"> -->
  <!-- <md-app md-mode="fixed"> -->
  <!-- <md-app-toolbar class="md-primary" v-if="['/login'].indexOf($route.path) === -1">
        <md-button class="md-icon-button" @click="menu.visible = !menu.visible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">{{ $route.name }}</span>
      </md-app-toolbar> -->

  <!-- <md-app-drawer :md-active.sync="menu.visible">
        <md-toolbar class="md-transparent drawer__toolbar" md-elevation="0">
          <md-avatar class="md-avatar-icon md-large md-accent drawer__toolbar-avatar">
            <md-ripple>{{ createRipple(user.name) }}</md-ripple>
          </md-avatar>
          <div class="drawer__toolbar-text">
            <div class="md-title" style="color: #FFF">{{ user.name }}</div>
            <div class="drawer__toolbar-subtitle">{{ (!user.owner) ? 'Administrator' : 'Owner' }}</div>
          </div>
        </md-toolbar>

        <md-list>
          <router-link to="/">
            <md-list-item class="drawer__item" @click="closeDrawer()">
              <md-icon class="drawer__icon">home</md-icon>
              <span class="md-list-item-text drawer__link">Dashboard</span>
            </md-list-item>
          </router-link>
          <router-link to="/chats">
            <md-list-item class="drawer__item" @click="closeDrawer()">
              <md-icon class="drawer__icon">announcement</md-icon>
              <span class="md-list-item-text drawer__link">Chat requests</span>
            </md-list-item>
          </router-link>
          <router-link to="/messages">
            <md-list-item class="drawer__item" @click="closeDrawer()">
              <md-icon class="drawer__icon">chat</md-icon>
              <span class="md-list-item-text drawer__link">Messages</span>
            </md-list-item>
          </router-link>
          <router-link to="/keywords">
            <md-list-item class="drawer__item" @click="closeDrawer()">
              <md-icon class="drawer__icon">font_download</md-icon>
              <span class="md-list-item-text drawer__link">Custom keywords</span>
            </md-list-item>
          </router-link>
          <router-link to="/postbacks">
            <md-list-item class="drawer__item" @click="closeDrawer()">
              <md-icon class="drawer__icon">input</md-icon>
              <span class="md-list-item-text drawer__link">Custom postbacks</span>
            </md-list-item>
          </router-link>
          <router-link to="/unknown_phrases">
            <md-list-item class="drawer__item" @click="closeDrawer()">
              <md-icon class="drawer__icon">error</md-icon>
              <span class="md-list-item-text drawer__link">Unknown phrases</span>
            </md-list-item>
          </router-link>
          <router-link to="/emissions">
            <md-list-item class="drawer__item" @click="closeDrawer()">
              <md-icon class="drawer__icon">settings_input_antenna</md-icon>
              <span class="md-list-item-text drawer__link">Emissions</span>
            </md-list-item>
          </router-link>
          <router-link to="/admins">
            <md-list-item class="drawer__item" @click="closeDrawer()">
              <md-icon class="drawer__icon">person_outline</md-icon>
              <span class="md-list-item-text drawer__link">Administrators</span>
            </md-list-item>
          </router-link>
          <custom-links></custom-links>
          <router-link to="/logout">
            <md-list-item class="drawer__item" @click="closeDrawer()">
              <md-icon class="drawer__icon">exit_to_app</md-icon>
              <span class="md-list-item-text drawer__link">Log out</span>
            </md-list-item>
          </router-link>
        </md-list>
      </md-app-drawer> -->

  <!-- <md-app-content>
        <router-view @logged="userLogIn()" @loggedOut="userLogOut()" />
      </md-app-content>
    </md-app> -->
  <!-- </div> -->
  <navbar v-if="['/login'].indexOf($route.path) === -1" ref="navbar"></navbar>
  <router-view @logged="userLogIn()" @loggedOut="userLogOut()" />
</div>
</template>

<script>
export default {
  name: 'App',
  data: () => {
    return {
      menu: {
        visible: false
      },
      user: JSON.parse(localStorage.getItem('user')) || {}
    }
  },

  methods: {
    userLogIn() {
      this.user = JSON.parse(localStorage.getItem('user')) || {}
    },

    userLogOut() {
      this.user = {}
    },

    closeDrawer() {
      this.menu.visible = false
    },

    createRipple(name) {
      let parts = (name) ? name.split(' ') : 'X X'
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
  }
}
</script>

<style lang="scss">
@import './assets/css/normalize.css';
@import '../node_modules/flexboxgrid/dist/flexboxgrid.min.css';
@import './styles/variables';
@import './styles/table';
@import './styles/tooltip';

body {
    background-color: $bg-primary;
    overflow-x: hidden;
    font-family: 'Lato', sans-serif;

    &::-webkit-scrollbar {
        width: 2px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: $font-primary;
        border-radius: 2px;
    }
}

a {
    color: inherit !important;
    text-decoration: none !important;
}

#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: $bg-primary;
}

.input {
    background: transparent;
    border: none;
    border-bottom: 1px solid $borders-primary;
    padding: 4px 3px;
    color: $font-primary;
    font-family: 'Lato', sans-serif;
    font-weight: bold;
    display: block;

    &:focus {
        border-bottom: 1.5px solid $borders-focus;
    }
}

.button {
    margin-top: 8px;
    font-size: 1.3em;
    padding: 8px;
    transition: background-color 0.25s;
    cursor: pointer;
    border-radius: 25px;
    font-family: 'Lato', sans-serif;
}

.label {
    font-weight: 700;
    display: block;
    font-size: 1.1em;
    margin-bottom: 14px;

    & input {
        margin: 0;
        font-size: 1em;
        width: 100%;
    }

    &--centered{
      width: 90%;
      margin: 0 auto 14px auto;
    }
}

.view-with-navbar {
    padding-top: 55px;
}

.center {
    margin: 0 auto;
}

*:focus {
    outline: none;
}

@media only screen and (max-width: 768px) {
    .view-with-navbar {
        padding-top: 9vh;
    }
}
</style>
