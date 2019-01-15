<template>
<div class="data-range">
  <div class="data-range__periods" v-show="!rangeMode">
    <select class="input select" v-model="period" @change="$emit('change', period)">
      <slot></slot>
    </select>
  </div>
  <div class="data-range__ranges" v-show="rangeMode">
    <input type="date" class="input" v-model="start" @change="rangeChange" />
    <span class="data-range__range-separator"> - </span>
    <input type="date" class="input" v-model="end" @change="rangeChange" />
  </div>
  <div class="data-range__switch-mode">
    <span v-show="rangeMode" @click="rangeMode = !rangeMode">Period</span>
    <span v-show="!rangeMode" @click="rangeMode = !rangeMode">Range</span>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      period: this.$attrs.val,
      start: null,
      end: null,
      rangeMode: false
    }
  },

  methods: {
    rangeChange() {
      if (!this.start || !this.end) return

      let startTs = +new Date(this.start)
      let endTs = +new Date(this.end)

      if ((endTs - startTs) < 0) return

      this.$emit('change', {
        start: this.start,
        end: this.end
      })
    }
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

.data-range {
    display: flex;
    align-items: center;
    &__switch-mode {
        color: $blue;
        font-size: 0.8em;
        text-decoration: underline;
        cursor: pointer;
    }

    &__periods {
        margin-right: 35px;
    }

    &__ranges {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin: -3px 15px 0 25px;

        input {
            width: 40%;
            display: block;
        }
    }
}

@media only screen and (max-width: 768px) {
    .data-range {

        &__ranges {
            margin-left: 0;
            margin-right: 0;
            justify-content: flex-start;
            width: 70%;
            margin-right: 10px;

            input{
              width: 48%;
            }
        }
    }
}
</style>
