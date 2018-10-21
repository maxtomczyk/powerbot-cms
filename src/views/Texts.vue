<template>
<div>
    <md-snackbar md-position="center" :md-duration="10000" :md-active.sync="loadError">
        <span>Error occured during data load. Please refresh site or contact an administrator.</span>
        <md-button class="md-primary" @click="loadError = false">close</md-button>
    </md-snackbar>

    <md-tabs md-active-tab="s0">
        <md-tab v-for="(group, i) in groups" :id="`s${i}`" :md-label="group.name" :key="group.id">
            <md-table>
                <md-table-row>
                    <md-table-head>Name</md-table-head>
                    <md-table-head>Description</md-table-head>
                    <md-table-head>Actions</md-table-head>
                </md-table-row>
                <bot-text-row v-for="plug in plugs" v-if="plug.group === group.id" :key="plug.id" :plug="plug" :languages="languages"></bot-text-row>
            </md-table>
        </md-tab>
    </md-tabs>
</div>
</template>

<script>
import axios from 'axios'

export default {
    data: () => {
        return {
            loadError: false,
            plugs: [],
            texts: [],
            groups: [],
            languages: []
        }
    },

    async created() {
        try {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
            let plugs_data = await axios.get('/api/plugs')
            let texts_data = await axios.get(`/api/texts?group_id=${this.groupId}`)
            let plugs_groups = await axios.get('/api/plugs_groups')
            let languages_data = await axios.get('/api/languages')
            let buttons_data = await axios.get('/api/buttons')
            let buttons_plugs = await axios.get('/api/buttons_plugs')

            this.plugs = plugs_data.data
            this.texts = texts_data.data
            this.groups = plugs_groups.data
            this.languages = languages_data.data
            this.buttons = buttons_data.data
            this.buttons_plugs = buttons_plugs.data

            this.plugs.map(plug => {
                plug.texts = []
                plug.buttons_plugs = []
                this.texts.map(text => {
                    if (plug.id === text.plug_id) plug.texts.push(text)
                })
                this.buttons_plugs.map(button_plug => {
                    if (plug.id === button_plug.text_plug) {
                        button_plug.buttons = []
                        this.buttons.map(button => {
                            if (button.plug_id === button_plug.id) button_plug.buttons.push(button)
                        })
                        plug.buttons_plugs.push(button_plug)
                    }
                })
            })
        } catch (e) {
            this.loadError = true
        }
    }
}
</script>

<style lang="scss">
.md-tabs-content {
    min-height: 80vh;
}
</style>
