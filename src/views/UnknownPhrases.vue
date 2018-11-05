<template>
<div class="unknown-words">
    <md-snackbar md-position="center" :md-duration="10000" :md-active.sync="loadError">
        <span>Error occured during data load. Please refresh site or contact an administrator.</span>
        <md-button class="md-primary" @click="loadError = false">close</md-button>
    </md-snackbar>

    <md-table class="unknown-words__table">
        <md-table-row>
            <md-table-head>Phrase</md-table-head>
        </md-table-row>
        <md-table-row v-for="phrase in phrases" :key="phrase.id">
            <md-table-cell>{{ phrase.phrase }}</md-table-cell>
        </md-table-row>
    </md-table>
</div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            phrases: [],
            loadError: false
        }
    },

    methods: {

    },

    async created() {
        try {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
            const phrases = await axios.get('/api/phrases')
            this.phrases = phrases.data
        } catch (e) {
            this.loadError = true
        }
    }
}
</script>

<style lang="scss">

</style>
