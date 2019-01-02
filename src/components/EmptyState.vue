<template>
<div class="empty-state">
  <div class="empty-state__icon-wrapper">
    <font-awesome-icon :icon="icon" size="10x" class="empty-state__icon" />
  </div>
  <div class="empty-state__title">
    <h1>{{ title }}</h1>
  </div>
  <div class="empty-state__text">
    <h3>{{ text }}</h3>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  props: ['icon', 'title', 'text']
}
</script>

<style lang="scss">
@import '../styles/variables';

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 88vh;
    color: $font-primary;

    &__title {
        font-size: 1.5em;
        h1 {
          margin-top: 15px;
        }
    }

    &__text {
      h3{
        margin-top: 0;
        font-size: 1.2em;
      }
    }
}
</style>
