<template>
<div class="view-with-navbar">


  <!-- <md-snackbar md-position="center" :md-duration="10000" :md-active.sync="error_snackbar">
    <span>Error occured during data load. Please refresh site or contact an administrator.</span>
    <md-button class="md-primary" @click="error_snackbar = false">close</md-button>
  </md-snackbar>

  <md-snackbar class="top-index" md-position="center" :md-duration="3000" :md-active.sync="creation_dialog.error">
    <span>Error occured during account creating.</span>
    <md-button class="md-primary" @click="creation_dialog.error = false">close</md-button>
  </md-snackbar>

  <md-snackbar class="top-index" md-position="center" :md-duration="3000" :md-active.sync="password_dialog.error">
    <span>Error occured during password change.</span>
    <md-button class="md-primary" @click="password_dialog.error = false">close</md-button>
  </md-snackbar>

  <md-snackbar md-position="center" :md-duration="3000" :md-active.sync="password_dialog.success">
    <span>Password has been changed.</span>
    <md-button class="md-primary" @click="password_dialog.success = false">close</md-button>
  </md-snackbar>

  <md-snackbar class="top-index" md-position="center" :md-duration="3000" :md-active.sync="delete_dialog.error">
    <span>Error occured during account deleting.</span>
    <md-button class="md-primary" @click="password_dialog.success = false">close</md-button>
  </md-snackbar>

  <md-dialog :md-active.sync="creation_dialog.show">
    <md-dialog-title>New administrator</md-dialog-title>
    <md-dialog-content>
      <md-field>
        <label>Login</label>
        <md-input v-model="creation_dialog.user.login"></md-input>
      </md-field>
      <md-field>
        <label>Name</label>
        <md-input v-model="creation_dialog.user.name"></md-input>
      </md-field>
      <md-field>
        <label>Password</label>
        <md-input type="password" v-model="creation_dialog.user.password"></md-input>
      </md-field>
      <md-field>
        <label>Password repeat</label>
        <md-input type="password" v-model="creation_dialog.user.password_repeat"></md-input>
      </md-field>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="creation_dialog.show = false">Close</md-button>
      <md-button class="md-primary" @click="createAdmin()">Save</md-button>
    </md-dialog-actions>
  </md-dialog>

  <md-dialog :md-active.sync="password_dialog.show">
    <md-dialog-title>Change password</md-dialog-title>
    <md-dialog-content>
      <md-field>
        <label>Password</label>
        <md-input type="password" v-model="password_dialog.user.password"></md-input>
      </md-field>
      <md-field>
        <label>New password</label>
        <md-input type="password" v-model="password_dialog.user.new_password"></md-input>
      </md-field>
      <md-field>
        <label>New password repeat</label>
        <md-input type="password" v-model="password_dialog.user.new_password_repeat"></md-input>
      </md-field>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="password_dialog.show = false">Close</md-button>
      <md-button class="md-primary" @click="changePassword()">Save</md-button>
    </md-dialog-actions>
  </md-dialog>

  <md-dialog :md-active.sync="delete_dialog.show">
    <md-dialog-title>Delete administrator</md-dialog-title>
    <md-dialog-content>
      You are about to delete <b>{{ delete_dialog.name }}</b> account. Continue?
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="delete_dialog.show = false">No</md-button>
      <md-button class="md-primary" @click="deleteAdmin()">Yes</md-button>
    </md-dialog-actions>
  </md-dialog> -->

  <table class="table admins__table">
    <tr class="table__row">
      <th class="table__head">Name</th>
      <th class="table__head">Login</th>
      <th class="table__head">Actions</th>
    </tr>
    <tr class="table__row" v-for="admin in admins" :key="admin.id">
      <td class="table__cell">{{ admin.name }}</td>
      <td class="table__cell">{{ admin.login }}</td>
      <td class="table__cell">
        <font-awesome-icon icon="key" size="lg" class="table__icon" v-tooltip.top-center="'Change password'"/>
        <font-awesome-icon v-tooltip.top-center="'Remove administrator'" v-if="admin.id !== logged_admin.id && logged_admin.owner && !admin.owner" icon="trash-alt" size="lg" class="table__icon" />
      </td>
    </tr>
  </table>

  <!-- <md-speed-dial class="md-bottom-right">
    <md-speed-dial-target @click="creation_dialog.show = true">
      <md-icon>add</md-icon>
    </md-speed-dial-target>
  </md-speed-dial> -->
</div>
</template>

<script>
import axios from 'axios'

export default {
  data: () => {
    return {
      error_snackbar: false,
      msg: 'xDD',
      delete_dialog: {
        show: false,
        name: '',
        id: null,
        error: false
      },
      creation_dialog: {
        show: false,
        error: false,
        user: {
          login: '',
          name: '',
          password: '',
          password_repeat: ''
        }
      },
      password_dialog: {
        show: false,
        error: false,
        success: false,
        user: {
          password: '',
          new_password: '',
          new_password_repeat: ''
        }
      },
      admins: [],
      logged_admin: JSON.parse(localStorage.getItem('user'))
    }
  },

  methods: {
    async createAdmin() {
      try {
        let new_admin = await axios.put('/api/admins', this.creation_dialog.user)
        this.admins.push(new_admin.data)
        this.creation_dialog.show = false
        this.creation_dialog.user = {
          login: '',
          name: '',
          password: '',
          password_repeat: ''
        }
      } catch (e) {
        this.creation_dialog.error = true
      }
    },

    async changePassword() {
      try {
        await axios.post('/api/admins', this.password_dialog.user)
        this.password_dialog.success = true
        this.password_dialog.show = false
        this.password_dialog.user = {
          password: '',
          new_password: '',
          new_password_repeat: ''
        }
      } catch (e) {
        this.password_dialog.error = true
      }
    },

    async deleteAdmin() {
      try {
        await axios.delete('/api/admins', {
          data: {
            id: this.delete_dialog.id
          }
        })

        this.admins.map((a, i) => {
          if (a.id === this.delete_dialog.id) this.admins.splice(i, 1)
        })

        this.delete_dialog.show = false
      } catch (e) {
        this.delete_dialog.error = true
      }
    }
  },

  async created() {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
      let admins = await axios.get('/api/admins')
      this.admins = admins.data
    } catch (e) {
      this.error_snackbar = true
    }
  }
}
</script>

<style lang="scss">
.admins {

    &__table {
        width: calc(100vw - 6%);
        padding: 0 3%;
        margin: 0 auto;
    }
}
</style>
