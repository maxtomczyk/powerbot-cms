<template>
<div class="unknown-words">
    <md-snackbar md-position="center" :md-duration="10000" :md-active.sync="loadError">
        <span>Error occured during data load. Please refresh site or contact an administrator.</span>
        <md-button class="md-primary" @click="loadError = false">close</md-button>
    </md-snackbar>

    <md-table class="unknown-words__table">
        <md-table-row>
            <md-table-head>Word</md-table-head>
            <md-table-head>Occurrences</md-table-head>
        </md-table-row>
        <md-table-row v-for="word in words" :key="word.id">
            <md-table-cell>{{ word.word }}</md-table-cell>
            <md-table-cell>{{ word.occurrences }}</md-table-cell>
        </md-table-row>
    </md-table>
</div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            words: [],
            loadError: false
        }
    },

    methods: {

    },

    async created() {
        try {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
            const words = await axios.get('/api/words')
            this.words = words.data
        } catch (e) {
            this.loadError = true
        }
    }
}
</script>

<style lang="scss">

</style>
