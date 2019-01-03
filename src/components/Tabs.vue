<template>
<div class="tabs" @click="clickHandler($event)">
  <slot class="tabs-content"></slot>
</div>
</template>

<script>
export default {
  data() {
    return {
      last: null
    }
  },

  methods: {
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    clickHandler(e) {
      let tabs = document.querySelectorAll('.tabs>div')
      if (!e.target.id || e.target.id === this.last) return
      tabs.forEach(tab => {
        tab.classList.remove('active-tab')
        if (tab.id === e.target.id) tab.classList.add('active-tab')
      })
      this.last = e.target.id
      this.$emit('change', e.target.id)
    },

    setActiveTab(id){
      let tabs = document.querySelectorAll('.tabs>div')
      tabs.forEach(tab => {
        tab.classList.remove('active-tab')
        if(tab.id === id) {
          tab.classList.add('active-tab')
          this.last = tab.id
        }
      })
    }
  },
  mounted(){
    let that = this
    const checker = setInterval(function () {
      let first = document.querySelector('.tabs>div')
      if(!first) return
      first.classList.add('active-tab')
      that.last = first.id
      clearInterval(checker)
    }, 100);
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
