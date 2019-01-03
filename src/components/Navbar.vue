<template>
<div class="navbar__component">
  <drawer ref="drawer"></drawer>
  <div class="navbar__container container">
    <div class="row">
      <div class="navbar col-xs-12">
        <div class="navbar__side navbar__side--flex">
          <font-awesome-icon @click="$refs.drawer.toggle()" icon="bars" size="lg" class="navbar__menu-icon"/>
          <div class="navbar__view-title">
            {{ $route.name.toLowerCase() }}
          </div>
        </div>
        <div class="navbar__side">
          <div class="navbar__username">
            {{ user.name.toLowerCase() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data(){
    return {
      user: {}
    }
  },

  methods: {

  },

  created(){
    let data = JSON.parse(localStorage.getItem('user'))
    this.user = data
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.navbar {
  position: fixed;
  width: 100vw;
  height: 6vh;
  left: 0px;
  min-height: 55px;
  background-color: $bg-accent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: $font-primary;
  -webkit-box-shadow: 0px 1px 14px -2px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 1px 14px -2px rgba(0,0,0,0.75);
  box-shadow: 0px 1px 14px -2px rgba(0,0,0,0.75);
  z-index: 20;

    &__container {
        width: calc(100vw - 16px);
        z-index: 20;
        margin-bottom: 1%;
    }

    &__view-title{
      font-family: 'Major Mono Display', monospace;
      font-size: 2em;
    }

    &__menu-icon{
      font-size: 1.6em;
      margin-right: 20px;
      margin-left: 10px;
      cursor: pointer;
    }

    &__side{

      &--flex{
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
    }

    &__username{
      margin-right: 10px;
      font-family: 'Major Mono Display', monospace;
      font-size: 1.1em;
      font-weight: bold;
      color: $green;
    }
}

@media only screen and (max-width: 768px) {
  .navbar{
    height: 9vh;
  }
}
</style>
