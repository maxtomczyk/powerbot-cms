<template>
<div class="tabs" @click="clickHandler($event)">
  <slot class="tabs-content"></slot>
</div>
</template>

<script>
export default {
  data() {
    return {
      last: null,
      hash: null
    }
  },

  methods: {
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    clickHandler(e) {
      let tabs = this.$slots.default
      if (!e.target.id || e.target.id === this.last) return
      tabs.forEach(tab => {
        tab.elm.classList.remove('active-tab')
        if (tab.elm.id === e.target.id) tab.elm.classList.add('active-tab')
      })
      this.last = e.target.id
      this.$emit('change', e.target.id)
    },

    setActiveTab(id) {
      let tabs = this.$slots.default
      tabs.forEach(tab => {
        tab.elm.classList.remove('active-tab')
        if (tab.elm.id === id) {
          tab.elm.classList.add('active-tab')
          this.last = tab.elm.id
          this.$emit('change', tab.elm.id)
        }
      })
    }
  },
  mounted() {
    let that = this

    const checker = setInterval(function() {
      if (!that.$slots.default) return
      that.$slots.default[0].elm.classList.add('active-tab')
      clearInterval(checker)
    }, 1000);
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    background-color: $bg-primary;
    color: $font-primary;
    font-weight: 700;
    margin-bottom: 15px;
    text-align: center;

    div {
        position: relative;
        height: 5vh;
        min-height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 10px;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            display: block;
            width: 0;
            height: 3px;
            transition: all 0.15s ease;
        }

        &:hover {
            background-color: $bg-accent-hover;
        }

        &.active-tab {
            background-color: $bg-accent;

            &::after {
                width: 100%;
                background-color: $green;
            }
        }
    }
}
</style>
