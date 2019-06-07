<template>
<div class="checkbox__row">
  <div class="checkbox" @click="val = !val; $emit('change', val); $emit('input', val); $emit('click', val)" :class="(val) ? 'checkbox--checked' : ''">
    <div class="checkbox__wrapper">
      <div class="checkbox__inside">

      </div>
    </div>
  </div>
  <label class="label label--checkbox checkbox__label" @click="val = !val; $emit('input', val); $emit('click', val)">
    <slot></slot>
  </label>
</div>
</template>

<script>
export default {
  data() {
    return {
      val: this.$attrs.val
    }
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

.checkbox {
    width: 20px;
    height: 20px;

    &__wrapper {
        width: 100%;
        height: 100%;
        border: 2px solid $borders-primary;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: border 0.1s ease;
        will-change: border;
        cursor: pointer;
        position: relative;
    }

    &__inside {
        width: calc(50% + 2px);
        padding-top: calc(50% + 2px);
        position: absolute;
        top: calc(25% - 1px);
        left: calc(25% - 1px);
        border-radius: 2px;
        transition: border 0.1s ease, background-color 0.1s ease, opacity 0.1s ease;
    }

    &__row {
        width: 90%;
        margin: 0 auto;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 12px;
        padding-top: 5px;

        label {
            margin: 0 0 0 10px;
        }
    }

    &__label {
        cursor: pointer;
    }

    &:hover {
        .checkbox {
            &__wrapper {
                border: 2px solid $green;
            }
        }
    }

    &--checked {
        .checkbox {
            &__wrapper {
                border: 2px solid $green;
            }

            &__inside {
                background-color: $green;
                opacity: 1 !important;
            }
        }
    }
}
</style>
