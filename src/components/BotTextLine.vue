<template>
<div>
  <div class="texts-dialog__subhead-wrapper" style="width: 80%; margin: 0 auto;">
    <span class="md-subheading">Button variant</span>
    <md-button class="md-icon-button" @click="toggleToDelete()">
      <md-icon class="delete-button__icon">{{ (text.toDelete) ? 'undo' : 'delete' }}</md-icon>
    </md-button>
  </div>
  <md-field v-show="!text.toDelete" :class="(text.toDelete) ? 'hidden': 'showed'" style="width: 80%; margin: 0 auto;">
    <label>Button variant</label>
    <md-input v-model="text.text"></md-input>
  </md-field>
</div>
</template>

<script>
export default {
  data() {
    return {
      text: this.$attrs.text,
      i: this.$attrs.i,
      card: this.$attrs.card
    }
  },

  methods: {
    toggleToDelete() {
      if (!this.text.id) {
        this.$emit('remove', this.i, this.card)
      } else {
        this.text.toDelete = !this.text.toDelete
        this.$forceUpdate()
        this.$emit('mark-to-del', this.i)
      }
    }
  }
}
</script>

<style lang="scss">

</style>
