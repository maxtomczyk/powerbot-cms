<template>
  <div class="view-with-navbar">
    <creation-button @click="$refs.creationDialog.openDialog()"></creation-button>
    <notifier ref="notifier"></notifier>

    <custom-dialog ref="removeDialog">
      <div slot="custom-dialog-header">
        <h1>Remove administrator</h1>
      </div>
      <div slot="custom-dialog-content">
        You are about to remove administrator account of
        <i>
          <b>{{ delete_dialog.name }}</b>
        </i> with login
        <i>
          <b>{{ delete_dialog.login }}</b>
        </i>. Continue?
      </div>
      <div slot="custom-dialog-buttons">
        <div class="dialog__button dialog__button--orange" @click="deleteAdmin">DELETE</div>
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
              <label class="label label--centered">
                Current password
                <input
                  class="input"
                  type="password"
                  name="password"
                  v-model="password_dialog.user.password"
                >
              </label>
              <label class="label label--centered">
                New password
                <input
                  class="input"
                  type="password"
                  name="newPassword"
                  v-model="password_dialog.user.new_password"
                >
              </label>
              <label class="label label--centered" for="newPasswordRepeat">
                New password repeat
                <input
                  class="input"
                  type="password"
                  name="newPasswordRepeat"
                  v-model="password_dialog.user.new_password_repeat"
                >
              </label>
            </div>
          </div>
        </div>
      </div>
      <div slot="custom-dialog-buttons">
        <div class="dialog__button dialog__button--blue" @click="changePassword">CHANGE</div>
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
              <label class="label label--centered" for="name">
                Name
                <input
                  class="input"
                  type="text"
                  name="name"
                  v-model="creation_dialog.user.name"
                >
              </label>
              <label class="label label--centered" for="login">
                Login
                <input
                  class="input"
                  type="text"
                  name="login"
                  v-model="creation_dialog.user.login"
                >
              </label>
              <label class="label label--centered" for="login">
                Email
                <input
                  class="input"
                  type="email"
                  name="email"
                  v-model="creation_dialog.user.email"
                >
              </label>
            </div>
            <div class="col-xs-12 col-md-6">
              <label class="label label--centered" for="password">
                Password
                <input
                  class="input"
                  type="password"
                  name="password"
                  v-model="creation_dialog.user.password"
                >
              </label>
              <label class="label label--centered" for="password_repeat">
                Password again
                <input
                  class="input"
                  type="password"
                  name="password_repeat"
                  v-model="creation_dialog.user.password_repeat"
                >
              </label>
            </div>
          </div>
        </div>
      </div>
      <div slot="custom-dialog-buttons">
        <div class="dialog__button dialog__button--blue" @click="createAdmin">CREATE</div>
      </div>
    </custom-dialog>

    <table class="table admins__table">
      <tr class="table__row">
        <th class="table__head">Name</th>
        <th class="table__head">Email</th>
        <th class="table__head">Login</th>
        <th class="table__head">Actions</th>
      </tr>
      <tr class="table__row" v-for="admin in admins" :key="admin.id">
        <td class="table__cell">{{ admin.name }}</td>
        <td class="table__cell">{{ admin.email || '-' }}</td>
        <td class="table__cell">{{ admin.login }}</td>
        <td class="table__cell">
          <font-awesome-icon
            @click="$refs[`notificationDialog_${admin.id}`][0].openDialog()"
            v-if="admin.id === logged_admin.id || logged_admin.owner"
            icon="cog"
            size="lg"
            class="table__icon"
            v-tooltip.top-center="'Manage email notifications'"
          />
          <font-awesome-icon
            @click="password_dialog.user.id = admin.id; $refs.passwordDialog.openDialog()"
            v-if="admin.id === logged_admin.id"
            icon="key"
            size="lg"
            class="table__icon"
            v-tooltip.top-center="'Change password'"
          />
          <font-awesome-icon
            @click="openDeleteDialog($event, admin)"
            v-tooltip.top-center="'Remove administrator'"
            v-if="admin.id !== logged_admin.id && logged_admin.owner && !admin.owner"
            icon="trash-alt"
            size="lg"
            class="table__icon"
          />
        </td>

        <custom-dialog :ref="`notificationDialog_${admin.id}`">
          <div slot="custom-dialog-header">
            <h1>Edit account</h1>
          </div>
          <div slot="custom-dialog-content" style="min-width: 600px">
            <div style="display: flex">
              <div style="margin-right: 30px; width: 50%">
                <h2>Account data</h2>
                <label class="label label--centered" for="password_repeat">
                  Name
                  <input class="input" type="text" v-model="admin.name">
                </label>
                <label class="label label--centered" for="password_repeat">
                  Email
                  <input class="input" type="text" v-model="admin.email">
                </label>
                <h2>Email notifications</h2>
                <checkbox
                  v-model="admin.chat_requests_notifications"
                  :val="admin.chat_requests_notifications"
                >New chat requests</checkbox>
                <checkbox
                  v-model="admin.weekly_email_reports"
                  :val="admin.weekly_email_reports"
                >Weekly reports</checkbox>
                <checkbox
                  v-model="admin.monthly_email_reports"
                  :val="admin.monthly_email_reports"
                >Monthly reports</checkbox>
              </div>
              <div style="width: 50%">
                <h2>Views access</h2>
                <checkbox
                  @click="allowedViewsChange(view.name, $event, admin)"
                  v-for="view in views"
                  :key="view.path"
                  :val="admin.allowed_views.indexOf(view.name) !== -1"
                >{{ view.name }}</checkbox>
              </div>
            </div>
          </div>
          <div slot="custom-dialog-buttons">
            <div
              class="dialog__button dialog__button--orange"
              @click="changeAccountSettings(admin)"
            >SAVE</div>
          </div>
        </custom-dialog>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import {
  EventBus
} from '../event-bus'

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
          password_repeat: '',
          email: ''
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
      notificationsSettings: {
        0: {
          chatRequests: false,
          weeklyRaports: false,
          monthlyRaports: false
        }
      },
      admins: [],
      logged_admin: JSON.parse(localStorage.getItem('user')),
      views: []
    }
  },

  methods: {
    async createAdmin () {
      try {
        let new_admin = await axios.put('/api/admins', this.creation_dialog.user)
        this.admins.push(new_admin.data)
        this.creation_dialog.show = false
        this.$refs.notifier.pushNotification('success!', `${this.creation_dialog.user.name} account with login '${this.creation_dialog.user.login}' has been created!`, 'success')
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

    async changePassword () {
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
        this.$refs.notifier.pushNotification('changed!', 'Password has been changed.', 'success', 4000)
      } catch (e) {
        this.$refs.passwordDialog.closeDialog()
        this.$refs.notifier.pushNotification('cannot change!', `There was an error during password change request. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    async changeAccountSettings (admin) {
      try {
        await axios.post('/api/admins/account', admin)
        this.$refs[`notificationDialog_${admin.id}`][0].closeDialog()
        this.$refs.notifier.pushNotification('changed!', 'Account settings has been changed. Account name will fully change after next login.', 'success', 12000)
      } catch (e) {
        this.$refs.notificationsDialog.closeDialog()
        this.$refs.notifier.pushNotification('cannot change!', `There was an error during account settings change request. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    async deleteAdmin () {
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

    openDeleteDialog (admin) {
      this.delete_dialog.login = admin.login
      this.delete_dialog.name = admin.name
      this.delete_dialog.id = admin.id
      this.$refs.removeDialog.openDialog()
    },
    allowedViewsChange (view, val, admin) {
      if (val) admin.allowed_views.push(view)
      else admin.allowed_views.splice(admin.allowed_views.indexOf(view), 1)
    }
  },

  async created () {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
      let admins = await axios.get('/api/admins')
      this.admins = admins.data

      for (const admin in this.admins) {
        this.notificationsSettings[admin.id] = {
          chatRequests: admin.chat_requests_notifications,
          weeklyRaports: admin.weekly_email_raports,
          monthlyRaports: admin.monthly_email_raports
        }
      }

      this.views = this.$router.options.routes.filter(r => {
        const basics = ['Login', 'Logout', 'Dashboard', 'Admins']
        if (basics.indexOf(r.name) !== -1) return false
        else return true
      })
    } catch (e) {
      this.$refs.notifier.pushNotification('cannot load!', `There was an error during data load. Error code: ${e.response.status}`, 'error', 10000)
    }
  },
  mounted () {
    EventBus.$on('token_refresh', token => {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    })
  },
  destroyed () {
    EventBus.$off('token_refresh')
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
