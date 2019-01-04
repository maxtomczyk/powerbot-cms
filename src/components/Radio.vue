<template>
<div class="radio" @click="$emit('input', val); $emit('click', val)" :class="{'radio--active': val === actual}">
  <div class="radio__circle-wrapper">
    <div class="radio__circle">

    </div>
  </div>
  <label class="label label--centered">
    <slot></slot>
  </label>
</div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  props: ['val', 'actual']
}
</script>

<style lang="scss">
@import '../styles/variables';

.radio {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
    cursor: pointer;

    &:hover {
        .radio__circle-wrapper {
            border: solid 2px $green;
        }
    }

    &--active {
        .radio {
            &__circle {
                background-color: $green;
            }

            &__circle-wrapper {
                border: 2px solid $green;
            }
        }
    }

    label {
        margin-bottom: 0;
        margin-left: 4px;
        cursor: pointer;
    }

    &__circle-wrapper {
        padding: 3px;
        border-radius: 50%;
        border: solid 2px $font-primary;
        transition: border 0.2s ease;
    }

    &__circle {
        border-radius: 50%;
        will-change: background-color;
        transition: background-color 0.2s ease;
        width: 12px;
        height: 12px;
    }
}
</style>
