<template>
<div class="view-with-navbar">
  <creation-button @click="$refs.creationDialog.openDialog()"></creation-button>
  <notifier ref="notifier"></notifier>

  <custom-dialog ref="removeDialog">
    <div slot="custom-dialog-header">
      <h1>Remove administrator</h1>
    </div>
    <div slot="custom-dialog-content">
      You are about to remove administrator account of <i><b>{{ delete_dialog.name }}</b></i> with login <i><b>{{ delete_dialog.login }}</b></i>. Continue?
    </div>
    <div slot="custom-dialog-buttons">
      <div class="dialog__button dialog__button--orange" @click="deleteAdmin">
        DELETE
      </div>
    </div>
  </custom-dialog>

  <custom-dialog ref="passwordDialog">
    <div slot="custom-dialog-header">
      <h1>Password change</h1>
    </div>
    <div slot="custom-dialog-content">
      <div class="container" style="width: 100%">
        <div class="row">
          <div class="col-xs-12">
            <label class="label label--centered">Current password
              <input class="input" type="password" name="password" v-model="password_dialog.password" />
            </label>
            <label class="label label--centered">New password
              <input class="input" type="password" name="newPassword" v-model="password_dialog.new_password" />
            </label>
            <label class="label label--centered" for="newPasswordRepeat">New password repeat
              <input class="input" type="password" name="login" v-model="password_dialog.new_password_repeat" />
            </label>
          </div>
        </div>
      </div>
    </div>
    <div slot="custom-dialog-buttons">
      <div class="dialog__button dialog__button--blue" @click="changePassword">
        CHANGE
      </div>
    </div>
  </custom-dialog>

  <custom-dialog ref="creationDialog">
    <div slot="custom-dialog-header">
      <h1>New administrator</h1>
    </div>
    <div slot="custom-dialog-content">
      <div class="container" style="width: 100%; max-width: 800px;">
        <div class="row">
          <div class="col-xs-12 col-md-6">
            <label class="label label--centered" for="name">Name
              <input class="input" type="text" name="name" v-model="creation_dialog.user.name" />
            </label>
            <label class="label label--centered" for="login">Login
              <input class="input" type="text" name="login" v-model="creation_dialog.user.login" />
            </label>
          </div>
          <div class="col-xs-12 col-md-6">
            <label class="label label--centered" for="password">Password
              <input class="input" type="password" name="password" v-model="creation_dialog.user.password" />
            </label>
            <label class="label label--centered" for="password_repeat">Password again
              <input class="input" type="password" name="password_repeat" v-model="creation_dialog.user.password_repeat" />
            </label>
          </div>
        </div>
      </div>
    </div>
    <div slot="custom-dialog-buttons">
      <div class="dialog__button dialog__button--blue" @click="createAdmin">
        CREATE
      </div>
    </div>
  </custom-dialog>

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
        <font-awesome-icon @click="$refs.passwordDialog.openDialog()" icon="key" size="lg" class="table__icon" v-tooltip.top-center="'Change password'" />
        <font-awesome-icon @click="openDeleteDialog(admin)" v-tooltip.top-center="'Remove administrator'" v-if="admin.id !== logged_admin.id && logged_admin.owner && !admin.owner" icon="trash-alt" size="lg" class="table__icon" />
      </td>
    </tr>
  </table>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data: () => {
    return {
      error_snackbar: false,
      delete_dialog: {
        show: false,
        login: '',
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
        this.$refs.notifier.pushNotification('success!', `${this.creation_dialog.user.name} account with login '${this.creation_dialog.user.login} has been created!'`, 'success')
        this.$refs.creationDialog.closeDialog()
        this.creation_dialog.user = {
          login: '',
          name: '',
          password: '',
          password_repeat: ''
        }
      } catch (e) {
        this.$refs.creationDialog.closeDialog()
        this.$refs.notifier.pushNotification('cannot create!', `There was an error during admin creation request. Error code: ${e.response.status}`, 'error', 10000)
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
        this.$refs.passwordDialog.closeDialog()
        this.$refs.notifier.pushNotification('changed!', 'Password has beed changed.', 'success', 4000)
      } catch (e) {
        this.$refs.passwordDialog.closeDialog()
        this.$refs.notifier.pushNotification('cannot change!', `There was an error during password change request. Error code: ${e.response.status}`, 'error', 10000)
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

        this.$refs.notifier.pushNotification('done!', `Account with login '${this.delete_dialog.login}' has beed removed.`, 'success')
        this.$refs.removeDialog.closeDialog()
      } catch (e) {
        this.$refs.removeDialog.closeDialog()
        this.$refs.notifier.pushNotification('cannot delete!', `There was an error during admin remove request. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    openDeleteDialog(admin) {
      this.delete_dialog.login = admin.login
      this.delete_dialog.name = admin.name
      this.delete_dialog.id = admin.id
      this.$refs.removeDialog.openDialog()
    }
  },

  async created() {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
      let admins = await axios.get('/api/admins')
      this.admins = admins.data
    } catch (e) {
      this.$refs.notifier.pushNotification('cannot load!', `There was an error during data load. Error code: ${e.response.status}`, 'error', 10000)
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
