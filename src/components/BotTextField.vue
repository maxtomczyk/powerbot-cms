<template>
<div>
    <div class="texts-dialog__subhead-wrapper">
        <span class="md-subheading">Variant</span>
        <md-button class="md-icon-button" @click="toggleToDelete()">
            <md-icon class="delete-button__icon">{{ (text.toDelete) ? 'undo' : 'delete' }}</md-icon>
        </md-button>
    </div>
    <md-field v-show="!text.toDelete" :class="(text.toDelete) ? 'hidden': 'showed'">
        <label>Message</label>
        <md-textarea v-model="text.text" rows="3"></md-textarea>
    </md-field>
</div>
</template>

<script>
export default {
    data() {
        return {
            text: this.$attrs.text,
            i: this.$attrs.i
        }
    },

    methods: {
        toggleToDelete() {
            if (!this.text.id) {
                this.$emit('remove', this.i)
            } else {
                this.text.toDelete = !this.text.toDelete
                this.$emit('mark-to-del', this.i)
            }
        }
    }
}
</script>

<style lang="scss">

</style>
