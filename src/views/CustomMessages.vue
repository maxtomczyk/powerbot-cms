<template>
<div class="custom-messages">
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

    <md-dialog :md-active.sync="removeDialog.show">
        <md-dialog-title>Delete message</md-dialog-title>
        <md-dialog-content>
            You are about to delete <b>{{ removeDialog.name }}</b> message. Continue?
        </md-dialog-content>

        <md-dialog-actions>
            <md-button class="md-primary" @click="removeDialog.show = false">No</md-button>
            <md-button class="md-primary" @click="removeMessage(removeDialog.id)">Yes</md-button>
        </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="previewDialog.show">
        <md-dialog-title>Custom message preview</md-dialog-title>
        <md-dialog-content>
            {{ previewDialog.code }}
        </md-dialog-content>

        <md-dialog-actions>
            <md-button class="md-primary" @click="previewDialog.show = false">Close</md-button>
        </md-dialog-actions>
    </md-dialog>

    <message-creator :active="createDialog" @close="createDialog = false" @create="createMessage"></message-creator>

    <md-tabs :md-active-tab="activeGroup" @md-changed="tabChange">
        <md-tab v-for="group in groups" :id="`${group.id}`" :md-label="group.name" :key="group.id">
        </md-tab>
    </md-tabs>

    <md-table class="custom-messages__table">
        <md-table-row>
            <md-table-head>Name</md-table-head>
            <md-table-head>Description</md-table-head>
            <md-table-head>Actions</md-table-head>
        </md-table-row>
        <md-table-row v-for="message in messages" v-show="message.group_id == activeGroup" :key="message.id">
            <md-table-cell>{{ message.friendly_name }}</md-table-cell>
            <md-table-cell>{{ message.description }}</md-table-cell>
            <md-table-cell>
                <md-button class="md-icon-button" @click="showRemoveDialog(message)">
                    <md-icon>delete</md-icon>
                </md-button>
                <md-button class="md-icon-button" @click="showPreviewDialog(message)">
                    <md-icon>visibility</md-icon>
                </md-button>
            </md-table-cell>
        </md-table-row>
    </md-table>

    <md-speed-dial class="md-bottom-right">
        <md-speed-dial-target @click="createDialog = true">
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
            loadError: false,
            success: false,
            removeDialog: {
                name: '',
                show: false,
                id: null
            },
            previewDialog: {
                show: false,
                code: null
            },
            error: false,
            activeGroup: '1',
            createDialog: false,
            groups: [{
                id: 1,
                name: 'Emissions messages'
            }, {
                id: 2,
                name: 'Postbacks reactions'
            }, {
                id: 3,
                name: 'Keywords messages'
            }, {
                id: 4,
                name: 'Special messages'
            }],
            messages: []
        }
    },

    methods: {
        tabChange(e) {
            this.activeGroup = e
        },
        async createMessage(e) {
            try {
                e.group_id = this.activeGroup
                const message = await axios.put('/api/messages', e)
                this.messages.push(message.data)
                this.createDialog = false
                this.success = true
            } catch (e) {
                console.error(e)
                this.error = true
            }
        },

        showRemoveDialog(message) {
            this.removeDialog.name = message.friendly_name
            this.removeDialog.id = message.id
            this.removeDialog.show = true
        },

        showPreviewDialog(message) {
            this.previewDialog.code = message.json
            this.previewDialog.show = true
        },

        async removeMessage() {
            try {
                await axios.delete('/api/messages', {
                    data: {
                        id: this.removeDialog.id
                    }
                })
                this.messages.map((m, i) => {
                    if (m.id === this.removeDialog.id) this.messages.splice(i, 1)
                })
                this.success = true
                this.removeDialog.show = false
            } catch (e) {
                this.error = true
                console.error(e)
            }
        }
    },

    async created() {
        try {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
            const messages = await axios.get('/api/messages')
            this.messages = messages.data
        } catch (e) {
            this.loadError = true
        }
    }
}
</script>

<style lang="scss">
.custom-messages {
    &__table {
        margin-top: 2vh;
    }
}
</style>
