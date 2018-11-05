<template>
<div id="app">
    <div class="page-container">
        <md-app md-mode="fixed">
            <md-app-toolbar class="md-primary" v-if="['/login'].indexOf($route.path) === -1">
                <md-button class="md-icon-button" @click="menu.visible = !menu.visible">
                    <md-icon>menu</md-icon>
                </md-button>
                <span class="md-title">{{ $route.name }}</span>
            </md-app-toolbar>

            <md-app-drawer :md-active.sync="menu.visible">
                <md-toolbar class="md-transparent drawer__toolbar" md-elevation="0">
                    <md-avatar class="md-avatar-icon md-large md-accent drawer__toolbar-avatar">
                        <md-ripple>{{ createRipple(user.name) }}</md-ripple>
                    </md-avatar>
                    <div class="drawer__toolbar-text">
                        <div class="md-title" style="color: #FFF">{{ user.name }}</div>
                        <div class="drawer__toolbar-subtitle">{{ (!user.owner) ? 'Administrator' : 'Owner' }}</div>
                    </div>
                </md-toolbar>

                <md-list>
                    <router-link to="/">
                        <md-list-item class="drawer__item" @click="closeDrawer()">
                            <md-icon class="drawer__icon">home</md-icon>
                            <span class="md-list-item-text drawer__link">Dashboard</span>
                        </md-list-item>
                    </router-link>
                    <router-link to="/chats">
                        <md-list-item class="drawer__item" @click="closeDrawer()">
                            <md-icon class="drawer__icon">announcement</md-icon>
                            <span class="md-list-item-text drawer__link">Chat requests</span>
                        </md-list-item>
                    </router-link>
                    <router-link to="/messages">
                        <md-list-item class="drawer__item" @click="closeDrawer()">
                            <md-icon class="drawer__icon">chat</md-icon>
                            <span class="md-list-item-text drawer__link">Messages</span>
                        </md-list-item>
                    </router-link>
                    <router-link to="/keywords">
                        <md-list-item class="drawer__item" @click="closeDrawer()">
                            <md-icon class="drawer__icon">font_download</md-icon>
                            <span class="md-list-item-text drawer__link">Custom keywords</span>
                        </md-list-item>
                    </router-link>
                    <router-link to="/postbacks">
                        <md-list-item class="drawer__item" @click="closeDrawer()">
                            <md-icon class="drawer__icon">input</md-icon>
                            <span class="md-list-item-text drawer__link">Custom postbacks</span>
                        </md-list-item>
                    </router-link>
                    <router-link to="/unknown_phrases">
                        <md-list-item class="drawer__item" @click="closeDrawer()">
                            <md-icon class="drawer__icon">error</md-icon>
                            <span class="md-list-item-text drawer__link">Unknown phrases</span>
                        </md-list-item>
                    </router-link>
                    <router-link to="/emissions">
                        <md-list-item class="drawer__item" @click="closeDrawer()">
                            <md-icon class="drawer__icon">settings_input_antenna</md-icon>
                            <span class="md-list-item-text drawer__link">Emissions</span>
                        </md-list-item>
                    </router-link>
                    <router-link to="/admins">
                        <md-list-item class="drawer__item" @click="closeDrawer()">
                            <md-icon class="drawer__icon">person_outline</md-icon>
                            <span class="md-list-item-text drawer__link">Administrators</span>
                        </md-list-item>
                    </router-link>
                    <router-link to="/logout">
                        <md-list-item class="drawer__item" @click="closeDrawer()">
                            <md-icon class="drawer__icon">exit_to_app</md-icon>
                            <span class="md-list-item-text drawer__link">Log out</span>
                        </md-list-item>
                    </router-link>
                </md-list>
            </md-app-drawer>

            <md-app-content>
                <router-view @logged="userLogIn()" @loggedOut="userLogOut()" />
            </md-app-content>
        </md-app>
    </div>
</div>
</template>

<script>
export default {
    name: 'App',
    data: () => {
        return {
            menu: {
                visible: false
            },
            user: JSON.parse(localStorage.getItem('user')) || {}
        }
    },

    methods: {
        userLogIn() {
            this.user = JSON.parse(localStorage.getItem('user')) || {}
        },

        userLogOut() {
            this.user = {}
        },

        closeDrawer() {
            this.menu.visible = false
        },

        createRipple(name) {
            let parts = (name) ? name.split(' ') : 'X X'
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        }
    }
}
</script>

<style lang="scss">
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.md-app {
    height: 100vh;
}

.drawer {
    &__toolbar {
        height: 20vh;
        background: url("../node_modules/incredbot-cms/src/assets/drawer_bg.png");
        background-size: cover;
    }

    &__toolbar-avatar {
        margin: 0 !important;
    }

    &__toolbar-text {
        text-align: left;
        margin-left: 7px;
        color: #FFF !important;
    }

    &__toolbar-subtitle {
        margin-left: 8px;
    }

    &__link {
        color: rgb(95, 124, 138) !important;
        font-size: 15px;
    }

    &__item {
        transition: 0;
        :hover {
            background-color: #f5f5f5;
        }
    }

    &__icon {
        font-size: 27px !important;
    }
}
</style>
