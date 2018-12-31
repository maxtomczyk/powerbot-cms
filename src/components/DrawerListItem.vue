<template>
<div>
  <router-link :to="target">
    <div class="drawer-list-item" @click="$emit('clicked')" :class="($route.path === target) ? 'drawer-list-item--active' : ''">
      <font-awesome-icon :icon="icon" size="lg" class="drawer-list-item__icon" fixed-width/>
      <p class="drawer-list-item__title"><slot></slot></p>
    </div>
  </router-link>
</div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  props: ['icon', 'target']
}
</script>

<style lang="scss">
@import '../styles/variables';

.drawer-list-item{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: $font-primary;
  will-change: color, background-color;
  transition: all .2s ease;
  height: 30px;

  &:hover{
    color: $orange;
    background-color: $bg-accent-hover;
  }

  &__icon{
    display: block;
    margin-left: 20px;
    margin-right: 20px;
  }

  &__title{
    font-family: 'Major Mono Display', monospace;
    font-weight: bold;
    font-size: 1em;
    display: block;
    margin: 0;
  }

  &--active{
    color: $orange;
  }
}

</style>
