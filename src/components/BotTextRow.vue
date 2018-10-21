<template>
<md-table-row>
    <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="save_error.show">
        <span>{{ save_error.text }}</span>
        <md-button class="md-primary" @click="save_error = false">close</md-button>
    </md-snackbar>

    <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="success">
        <span>Changes has been saved!</span>
        <md-button class="md-primary" @click="success = false">close</md-button>
    </md-snackbar>

    <md-table-cell>{{ plug.friendly_name }}</md-table-cell>
    <md-table-cell>{{ plug.description }}</md-table-cell>
    <md-table-cell>
        <md-button class="md-icon-button" @click="edit_dialog = true">
            <md-icon>edit</md-icon>
        </md-button>
        <md-button class="md-icon-button" @click="buttons_edit_dialog = true" v-if="plug.buttons_plugs.length">
            <md-icon>radio_button_checked</md-icon>
        </md-button>
    </md-table-cell>
    <div class='out-of-table'>
        <md-dialog class="texts__dialog" :md-active.sync="edit_dialog">
            <md-dialog-title class="texts-dialog__header">
                <div>
                    <span>Messages</span>
                    <br>
                    <span class="md-subheading">{{ plug.friendly_name }}</span>
                </div>
                <div>
                    <md-field class="language__select">
                        <label for="movie">Language</label>
                        <md-select v-model="selectedLang">
                            <md-option v-for="lang in languages" :value="lang.id" :key="lang.id">{{ lang.name }}</md-option>
                        </md-select>
                    </md-field>
                </div>
            </md-dialog-title>
            <md-dialog-content>
                <div v-for="(text, i) in texts" v-if="text.language_id === selectedLang" :key="`${+new Date()}id${i}`">
                    <bot-text-field :text="text" :i="i" @remove="texts.splice(i, 1)"></bot-text-field>
                </div>
                <div class="new-variant-button__wrapper">
                    <md-button class="md-icon-button new-variant-button md-accent" @click="createNewVariant()">
                        <md-icon>add</md-icon>
                    </md-button>
                </div>
            </md-dialog-content>
            <md-dialog-actions>
                <md-button class="md-primary" @click="edit_dialog = false">Close</md-button>
                <md-button class="md-primary" @click="saveChanges()">Save</md-button>
            </md-dialog-actions>
        </md-dialog>

        <md-dialog class="buttons__dialog" :md-active.sync="buttons_edit_dialog" md-fullscreen>
            <md-dialog-title class="texts-dialog__header" style="padding-bottom: 1%;">
                <div>
                    <span>Buttons</span>
                    <br>
                    <span class="md-subheading">{{ plug.friendly_name }}</span>
                </div>
                <div>
                    <md-field class="language__select">
                        <label for="movie">Language</label>
                        <md-select v-model="selectedLang">
                            <md-option v-for="lang in languages" :value="lang.id" :key="lang.id">{{ lang.name }}</md-option>
                        </md-select>
                    </md-field>
                </div>
            </md-dialog-title>
            <md-dialog-content>
                <md-tabs class="buttons-tabs" md-alignment="centered" style="">
                    <md-tab v-for="(plug, i) in buttons_plugs" :key="plug.id" :id="`p${i}`" class="buttons__tab" :md-label="tabTitle(plug.friendly_name, buttons_plugs.length)">
                        <div class="buttons__wrapper" v-for="(button, o) in plug.buttons" :key="`${+new Date()}id${o}`" v-show="selectedLang === button.language_id">
                            <bot-text-line :text="button" :i="o" :card="i" @remove="removeButton"></bot-text-line>
                        </div>

                        <div class="new-variant-button__wrapper" style="margin-top: 5%; margin-left: 13%;">
                            <md-button class="md-icon-button new-variant-button md-accent" @click="createNewButtonVariant(i)">
                                <md-icon>add</md-icon>
                            </md-button>
                        </div>
                    </md-tab>
                </md-tabs>
            </md-dialog-content>
            <md-dialog-actions>
                <md-button class="md-primary" @click="buttons_edit_dialog = false">Close</md-button>
                <md-button class="md-primary" @click="saveButtonsChanges()">Save</md-button>
            </md-dialog-actions>
        </md-dialog>

    </div>
</md-table-row>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            visible: true,
            languages: this.$attrs.languages,
            selectedLang: this.$attrs.languages[0].id,
            plug: this.$attrs.plug,
            edit_dialog: false,
            buttons_edit_dialog: false,
            texts: this.$attrs.plug.texts,
            buttons_plugs: this.$attrs.plug.buttons_plugs,
            save_error: {
                show: false,
                text: ''
            },
            success: false
        }
    },
    methods: {
        show() {
            this.visible = true
        },

        createNewVariant() {
            let o = {
                plug_id: this.plug.id,
                text: '',
                language_id: this.selectedLang
            }
            this.texts.push(o)
        },

        removeButton(i, o) {
            this.buttons_plugs[o].buttons.splice(i, 1)
        },

        createNewButtonVariant(i) {
            let o = {
                plug_id: this.buttons_plugs[i].id,
                text: '',
                language_id: this.selectedLang,
                toDelete: false
            }
            this.buttons_plugs[i].buttons.push(o)
        },

        async saveChanges() {
            try {
                let response = await axios.post('/api/texts', {
                    texts: this.texts
                })

                this.texts = response.data.texts
                this.edit_dialog = false
                this.success = true
            } catch (e) {
                this.save_error.text = e.response.data
                this.save_error.show = true
            }
        },

        async saveButtonsChanges() {
            try {
                let response = await axios.post('/api/buttons', {
                    buttons_plugs: this.buttons_plugs
                })

                this.buttons_plugs.map(wrapper => {
                    wrapper.buttons = response.data.buttons[wrapper.id]
                })

                this.buttons_edit_dialog = false
                this.success = true
            } catch (e) {
                this.save_error.text = e.response.data
                this.save_error.show = true
            }
        },

        tabTitle(text, l) {
            if (l >= 10) {
                if (text.length <= 8) return text
                else return `${text.substring(0, 8)}...`
            } else if (l >= 8) {
                if (text.length <= 10) return text
                else return `${text.substring(0, 10)}...`
            } else if (l >= 6) {
                if (text.length <= 12) return text
                else return `${text.substring(0, 12)}...`
            } else {
                return text
            }
        }
    },

    created() {

    }
}
</script>

<style lang="scss">
.texts {
    &__dialog {
        min-width: 40vw;
        transition: all 0.5s ease;
    }
}

.texts-dialog {
    &__subhead-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
    }
}

.hidden {
    display: none;
}

.to-delete {
    background-color: pink !important;
}

.new-variant-button {
    &__wrapper {
        display: flex;
        justify-content: flex-end;
    }
}

.md-select-menu {
    z-index: 999;
}

.language {
    &__select {
        width: 90%;
    }
}

.buttons {
    &__dialog {
        width: 98%;
        height: 96%;
        max-width: none;
        max-height: none;

        & > div > .md-dialog-content {
            overflow-x: hidden;
        }
    }

    &__tab {
        display: flex;
        justify-content: flex-start;
        width: 100%;
        height: auto;
        flex-wrap: wrap;
        margin: 0 !important;
        padding: 0 0 0 2.5%;
    }

    &__wrapper {
        width: 30%;
        margin-right: 2.5%;
        margin-top: 3%;
    }
}

.buttons-tabs {
    padding-bottom: 10px;
    min-height: 0;

    & > .md-tabs-content {
        min-height: 0;
        height: auto !important;
        overflow-x: hidden;
    }

    &::-webkit-scrollbar {
        height: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #a2a2a2;
    }

    &::-webkit-scrollbar-track {
        background-color: #f2f2f2;
    }

    & > div > button {
        overflow: visible !important;
        max-width: none !important;
        min-width: auto !important;
    }
}
</style>
