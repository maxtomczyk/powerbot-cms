<template>
  <div class="creation_button" @click="$emit('click')">
    <font-awesome-icon icon="plus" size="lg" class="creation-button__icon" />
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
@import '../styles/variables';

.creation_button {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    right: 30px;
    bottom: 30px;
    width: 4vw;
    height: 4vw;
    min-width: 50px;
    min-height: 50px;
    max-width: 56px;
    max-height: 56px;
    background-color: $green;
    font-size: 1.5em;
    color: $bg-accent;
    cursor: pointer;
    will-change: background-color color;
    transition: all .25s ease;

    &:hover{
      background-color: $green-hover;
      color: $bg-accent-hover;
    }
}
</style>
