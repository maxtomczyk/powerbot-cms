<template>
<div class="keywords">
    <md-snackbar md-position="center" :md-duration="10000" :md-active.sync="loadError">
        <span>Error occured during data load. Please refresh site or contact an administrator.</span>
        <md-button class="md-primary" @click="loadError = false">close</md-button>
    </md-snackbar>

    <md-snackbar md-position="center" :md-duration="3000" :md-active.sync="success">
        <span>Request success!</span>
        <md-button class="md-primary" @click="password_dialog.success = false">close</md-button>
    </md-snackbar>

    <md-snackbar md-position="center" :md-duration="3000" :md-active.sync="error">
        <span>Request ended with error!</span>
        <md-button class="md-primary" @click="password_dialog.success = false">close</md-button>
    </md-snackbar>

    <md-dialog :md-active.sync="creationDialog">
        <md-dialog-title>Create keyword</md-dialog-title>
        <md-dialog-content>
            <md-field>
                <label>Friendly name</label>
                <md-input v-model="keyword.friendly_name"></md-input>
            </md-field>
            <md-field>
                <label>Regex body</label>
                <md-input v-model="keyword.regex_body"></md-input>
            </md-field>
            <md-field>
                <label>Regex flags</label>
                <md-input v-model="keyword.regex_flags"></md-input>
            </md-field>
            <md-field>
                <label>Message</label>
                <md-select v-model="keyword.message_id">
                    <md-option v-for="message in messages" :key="message.id" :value="message.id">{{ message.friendly_name }}</md-option>
                </md-select>
            </md-field>
        </md-dialog-content>

        <md-dialog-actions>
            <md-button class="md-primary" @click="creationDialog = false">Cancel</md-button>
            <md-button class="md-primary" @click="create()">Create</md-button>
        </md-dialog-actions>
    </md-dialog>

    <md-table class="keywords__table">
        <md-table-row>
            <md-table-head>Name</md-table-head>
            <md-table-head>Regex</md-table-head>
            <md-table-head>Message</md-table-head>
            <md-table-head>Actions</md-table-head>
        </md-table-row>
        <md-table-row v-for="keyword in keywords" :key="keyword.id">
            <md-table-cell>{{ keyword.friendly_name }}</md-table-cell>
            <md-table-cell>{{ `/${keyword.regex_body}/${keyword.regex_flags}` }}</md-table-cell>
            <md-table-cell>{{ keyword.message_name }}</md-table-cell>
            <md-table-cell>
                <md-button class="md-icon-button" @click="remove(keyword.id)">
                    <md-icon>delete</md-icon>
                </md-button>
            </md-table-cell>
        </md-table-row>
    </md-table>

    <md-speed-dial class="md-bottom-right">
        <md-speed-dial-target @click="creationDialog = true">
            <md-icon>add</md-icon>
        </md-speed-dial-target>
    </md-speed-dial>
</div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            creationDialog: false,
            loadError: false,
            error: false,
            success: false,
            keywords: [],
            messages: [],
            keyword: {
                regex_body: '',
                regex_flags: '',
                message_id: null,
                friendly_name: ''
            }
        }
    },

    methods: {
        async remove(id) {
            try {
                await axios.delete('/api/keyword', {
                    data: {
                        id
                    }
                })

                this.keywords.map((k, i) => {
                    if (k.id === id) this.keywords.splice(i, 1)
                })

                this.success = true
            } catch (e) {
                this.error = true
            }
        },

        async create(id) {
            try {
                const created = await axios.put('/api/keyword', this.keyword)
                this.keywords.push(created.data)
                this.creationDialog = false
                this.success = true
            } catch (e) {
                this.error = true
            }
        }
    },

    async created() {
        try {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
            const keywords = await axios.get('/api/keywords')
            const messages = await axios.get('/api/messages?id=3')
            this.keywords = keywords.data
            this.messages = messages.data
        } catch (e) {
            this.loadError = true
        }
    }
}
</script>

<style lang="scss">
.md-select-menu {
    z-index: 9999;
}
</style>
