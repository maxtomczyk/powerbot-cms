<template>
  <div class="loader" v-show="active">
    <div class="loader__overlay">
      <div class="loader__window">
        <div>
          <spinner class="loader__spinner"></spinner>
          <div class="loader__text">{{ text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: 'Loading...',
      active: false
    }
  },

  methods: {
    open (text) {
      if (text) this.text = text
      this.active = true
    },

    close () {
      this.text = 'Loading...'
      this.active = false
    }
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

.loader {
  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 150;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__window {
    display: flex;
    justify-content: center;
    padding: 2% 0;
    width: 10%;
    min-width: 230px;
  }

  &__spinner {
    text-align: center;
  }

  &__text {
    margin-top: 12px;
    font-size: 1.1em;
    color: #fff;
    font-weight: 700;
    text-align: center;
  }
}
</style>
