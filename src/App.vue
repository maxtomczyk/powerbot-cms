<template>
<div id="app">
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

.noscroll {
    overflow: hidden;
}

.input {
    background: transparent;
    border: none;
    border-bottom: 1px solid $borders-primary;
    padding: 4px 3px;
    color: $font-primary;
    font-family: 'Lato', sans-serif;
    font-weight: 400;
    display: block;

    &:focus {
        border-bottom: 1.5px solid $borders-focus;
    }

    &.select {
        width: 100%;
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

    &--centered {
        width: 90%;
        margin: 0 auto 14px;
    }

    &--checkbox {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
}

.textarea {
    width: 100%;

    &--bordered {
        border: 1px solid $borders-primary;
        border-radius: 4px;

        &:focus {
            border: 1.5px solid $borders-focus;
        }
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
