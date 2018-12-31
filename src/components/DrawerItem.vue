<template>
<div>
  <router-link :to="target">
    <div class="drawer-item" @click="$emit('clicked')" :class="($route.path === target) ? 'drawer-item--active' : ''">
      <font-awesome-icon :icon="icon" size="3x" class="drawer-item__icon" fixed-width/>
      <p class="drawer-item__title"><slot></slot></p>
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

.drawer-item{
  text-align: center;
  color: $font-primary;
  will-change: color;
  transition: color .2s ease;
  grid-row: 1;

  &:hover{
    color: $orange;
  }

  &__icon{
    font-size: 3em;
  }

  &__title{
    margin: 8px 0 0 0;
    font-family: 'Major Mono Display', monospace;
    font-weight: bold;
  }

  &--active{
    color: $orange;
  }
}

@media only screen and (max-width: 1367px) {
  .drawer-item__title{
    font-size: .7em;
  }

  .drawer-item__icon{
    font-size: 2.5em;
  }
}
</style>
