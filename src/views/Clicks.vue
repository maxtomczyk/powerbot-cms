<template>
  <div class="view-with-navbar clicks">
    <notifier ref="notifier"></notifier>

    <custom-dialog ref="urlEditDialog">
      <div slot="custom-dialog-header">
        <h1>Edit URL</h1>
      </div>
      <div slot="custom-dialog-content">
        <label class="label label--centered" for="friendly_name">
          Name
          <input
            class="input"
            type="text"
            name="friendly_name"
            v-model="editUrlEntry.friendly_name"
          >
        </label>
      </div>
      <div slot="custom-dialog-buttons">
        <div class="dialog__button dialog__button--orange" @click="saveURLChanges">SAVE</div>
      </div>
    </custom-dialog>

    <custom-dialog ref="payloadEditDialog">
      <div slot="custom-dialog-header">
        <h1>Edit payload</h1>
      </div>
      <div slot="custom-dialog-content">
        <label class="label label--centered" for="friendly_name">
          Name
          <input
            class="input"
            type="text"
            name="friendly_name"
            v-model="editPayloadClick.friendly_name"
          >
        </label>
      </div>
      <div slot="custom-dialog-buttons">
        <div class="dialog__button dialog__button--orange" @click="savePayloadChanges">SAVE</div>
      </div>
    </custom-dialog>

    <custom-dialog ref="urlRestartDialog">
      <div slot="custom-dialog-header">
        <h1>Remove URL counter</h1>
      </div>
      <div slot="custom-dialog-content">
        <div style="max-width: 800px;">
          You are about removing counted clicks for URL
          <b>
            <i>{{ restartUrlEntry.url }}</i>
          </b>. This cannot be undone, continue?
          <br>Remember, counter will appear here again when monitored request will be performed.
        </div>
        <checkbox
          v-model="restartUrlEntry.leaveCache"
          :val="restartUrlEntry.leaveCache"
          class="clicks__dialog-checkbox"
        >Don't remove cached entries</checkbox>
      </div>
      <div slot="custom-dialog-buttons">
        <div class="dialog__button dialog__button--orange" @click="resetUrlCounter">DELETE</div>
      </div>
    </custom-dialog>

    <custom-dialog ref="payloadRestartDialog">
      <div slot="custom-dialog-header">
        <h1>Remove payload counter</h1>
      </div>
      <div slot="custom-dialog-content">
        <div style="max-width: 800px;">
          You are about resetting counted clicks for payload
          <b>
            <i>{{ restartPayloadClick.payload }}</i>
          </b>. This cannnot be undone, continue?
        </div>
        <checkbox
          v-model="restartPayloadClick.leaveCache"
          :val="restartPayloadClick.leaveCache"
          class="clicks__dialog-checkbox"
        >Don't remove cached entries</checkbox>
      </div>
      <div slot="custom-dialog-buttons">
        <div class="dialog__button dialog__button--orange" @click="resetPayloadClicks">RESET</div>
      </div>
    </custom-dialog>

    <tabs @change="tabChange" ref="tabs">
      <div id="1">PAYLOADS TRACES</div>
      <div id="2">BUTTONS CLICKS</div>
      <div id="3">WEB LINKS</div>
    </tabs>
    <div class="clicks__wrapper" v-show="activeTab === '1'">
      <div class="clicks__chart-control">
        <label class="label label--centered clicks__chart-select">
          Starting payload
          <select class="input select" v-model="chartDataSettings.payload">
            <optgroup>
              <option v-for="payload in payloads.prior" :key="payload" :value="payload">{{ payloads.friendlyNames[payload] || payload }}</option>
            </optgroup>
            <optgroup>
              <option v-for="payload in payloads.rest" :key="payload" :value="payload">{{ payloads.friendlyNames[payload] || payload }}</option>
            </optgroup>
          </select>
        </label>

        <label class="label label--centered clicks__chart-select">
          Depth
          <select class="input select" v-model="chartDataSettings.depth">
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
          </select>
        </label>

        <label class="label label--centered clicks__chart-select">
          Records limit
          <select class="input select" v-model="chartDataSettings.limit">
            <option value="0">All</option>
            <option value="7">1 week</option>
            <option value="14">2 weeks</option>
            <option value="30">1 Month</option>
            <option value="90">3 Month</option>
          </select>
        </label>
      </div>
      <div class="clicks__chart">
        <chart-sankey :data="chartData" :config="chartConfig"></chart-sankey>
      </div>
    </div>
    <div class="clicks__wrapper" v-show="activeTab === '2'">
      <empty-state
        v-show="!payloadClicks.length"
        icon="unlink"
        title="No counters saved in database"
        text="Data is refreshed every 2 hours"
      ></empty-state>
      <table class="table admins__table">
        <tr class="table__row">
          <th class="table__head">Name</th>
          <th class="table__head">Payload</th>
          <th class="table__head">Clicks</th>
          <th class="table__head">Actions</th>
        </tr>
        <tr class="table__row" v-for="entry in payloadClicks" :key="entry.id">
          <td class="table__cell">{{ entry.friendly_name || '-' }}</td>
          <td class="table__cell">{{ entry.payload }}</td>
          <td class="table__cell">{{ entry.entries }}</td>
          <td class="table__cell">
            <font-awesome-icon
              @click="openPayloadEditDialog(entry)"
              v-tooltip.top-center="'Edit data'"
              icon="cog"
              size="lg"
              class="table__icon"
            />
            <font-awesome-icon
              @click="openPayloadRestartDialog(entry)"
              v-tooltip.top-center="'Reset counter'"
              icon="trash-alt"
              size="lg"
              class="table__icon"
            />
          </td>
        </tr>
      </table>
    </div>
    <div class="clicks__wrapper" v-show="activeTab === '3'">
      <empty-state
        v-show="!webEntries.length"
        icon="unlink"
        title="No counters saved in database"
        text="Data is refreshed every 2 hours"
      ></empty-state>
      <table class="table admins__table">
        <tr class="table__row">
          <th class="table__head">Name</th>
          <th class="table__head">URL</th>
          <th class="table__head">Entries</th>
          <th class="table__head">Actions</th>
        </tr>
        <tr class="table__row" v-for="entry in webEntries" :key="entry.id">
          <td class="table__cell">{{ entry.friendly_name || '-' }}</td>
          <td class="table__cell">{{ entry.url }}</td>
          <td class="table__cell">{{ entry.entries }}</td>
          <td class="table__cell">
            <font-awesome-icon
              @click="openURLEditDialog(entry)"
              v-tooltip.top-center="'Edit data'"
              icon="cog"
              size="lg"
              class="table__icon"
            />
            <font-awesome-icon
              @click="openURLRestartDialog(entry)"
              v-tooltip.top-center="'Delete counter'"
              icon="trash-alt"
              size="lg"
              class="table__icon"
            />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ChartSankey } from 'vue-d2b'
import { EventBus } from '../event-bus'

export default {
  data () {
    return {
      activeTab: '1',
      webEntries: [],
      payloadClicks: [],
      editUrlEntry: {},
      editPayloadClick: {},
      restartUrlEntry: {},
      restartPayloadClick: {},
      payloads: {
        prior: [],
        rest: [],
        friendlyNames: {}
      },
      chartDataSettings: {
        limit: 0,
        depth: 5,
        payload: 'MENU'
      },
      chartLayersRecords: {},
      chartData: {
        nodes: [],
        links: []
      }
    }
  },
  components: {
    ChartSankey
  },
  async created () {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
      const urlClicks = await axios.get('/api/stats/url_clicks')
      const payloadClicks = await axios.get('/api/stats/payload_clicks')
      this.webEntries = urlClicks.data
      this.payloadClicks = payloadClicks.data
      await this.loadPayloadsList()
      await this.loadPayloadTraces()
    } catch (e) {
      this.$refs.notifier.pushNotification('cannot load!', `There was an error during data load. Error code: ${e.response.status}`, 'error', 10000)
    }
  },

  methods: {
    chartConfig (config) {
      config
        .sankey()
        .sankey()
        .nodePadding(3)

      config
        .sankey()
        .nodeDraggableY(true)
    },

    invisibleString (length) {
      let str = ''
      for (let i = 0; i < length; i++) {
        str += '\u2029'
      }
      return str
    },

    async loadPayloadsList () {
      try {
        const payloads = await axios.get('api/stats/payloads')
        this.payloads.friendlyNames = payloads.data.friendlyNames
        this.payloads.prior = payloads.data.prioritized
        let rest = []
        for (let payload of payloads.data.all) if (payloads.data.prioritized.indexOf(payload) === -1) rest.push(payload)
        this.payloads.rest = rest
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot load!', `There was an error during data load. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    async loadPayloadTraces () {
      try {
        const payload = this.chartDataSettings.payload
        const depth = this.chartDataSettings.depth
        const limit = this.chartDataSettings.limit
        const request = await axios.get(`/api/stats/payload_traces?payload=${payload}&depth=${depth}&limit=${limit}`)
        const traces = request.data
        let nodes = new Set()
        let links = []
        this.chartLayersRecords = []

        for (let i = 0; i < depth; i++) {
          let linksToNextLayer = {}
          for (let trace of traces) {
            const payload = this.payloads.friendlyNames[trace[i]] || trace[i]
            const next = this.payloads.friendlyNames[trace[i + 1]] || trace[i + 1]
            if (!payload) continue
            nodes.add(`${payload}${this.invisibleString(i)}`)
            if (!next) continue
            if (!linksToNextLayer[`${payload}${this.invisibleString(i)}-->${next}${this.invisibleString(i + 1)}`]) linksToNextLayer[`${payload}${this.invisibleString(i)}-->${next}${this.invisibleString(i + 1)}`] = 1
            else linksToNextLayer[`${payload}${this.invisibleString(i)}-->${next}${this.invisibleString(i + 1)}`]++
          }
          let sum = 0
          for (let link in linksToNextLayer) {
            const linkNodes = link.split('-->')
            const value = linksToNextLayer[link]
            sum += parseInt(value)
            links.push({
              source: linkNodes[0],
              target: linkNodes[1],
              value
            })
          }
          this.chartLayersRecords[i] = sum
        }
        nodes = Array.from(nodes, (name) => { return { name } })
        this.chartData.nodes = nodes
        this.chartData.links = links
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot load!', `There was an error during data load. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    tabChange (e) {
      this.activeTab = e
      this.$forceUpdate()
    },

    openURLEditDialog (entry) {
      this.editUrlEntry = entry
      this.$refs.urlEditDialog.openDialog()
    },

    openPayloadEditDialog (entry) {
      this.editPayloadClick = entry
      this.$refs.payloadEditDialog.openDialog()
    },

    openURLRestartDialog (entry) {
      this.restartUrlEntry = entry
      this.restartUrlEntry.leaveCache = false
      this.$refs.urlRestartDialog.openDialog()
    },

    openPayloadRestartDialog (entry) {
      this.restartPayloadClick = entry
      this.restartPayloadClick.leaveCache = false
      this.$refs.payloadRestartDialog.openDialog()
    },

    async saveURLChanges () {
      try {
        await axios.post('/api/stats/url_entry', this.editUrlEntry)
        this.$refs.urlEditDialog.closeDialog()
        this.$refs.notifier.pushNotification('saved!', `URL data has been saved.`, 'success', 6000)
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot save!', `There was an error during data save. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    async savePayloadChanges () {
      try {
        await axios.post('/api/stats/payload_click', this.editPayloadClick)
        this.$refs.payloadEditDialog.closeDialog()
        this.$refs.notifier.pushNotification('saved!', `Payload data has been saved.`, 'success', 6000)
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot save!', `There was an error during data save. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    async resetUrlCounter () {
      try {
        await axios.delete('/api/stats/url_entry', { data: this.restartUrlEntry })
        let i = 0
        for (let entry of this.webEntries) {
          if (entry.id === this.restartUrlEntry.id) {
            this.webEntries.splice(i, 1)
            break
          }
          i++
        }
        this.$refs.urlRestartDialog.closeDialog()
        this.$refs.notifier.pushNotification('cleared!', `URL counter has been cleared.`, 'success', 6000)
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot reset!', `There was an error during counter resetting. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    async resetPayloadClicks () {
      try {
        await axios.delete('/api/stats/payload_clicks', { data: this.restartPayloadClick })
        for (let entry of this.payloadClicks) {
          if (entry.id === this.restartPayloadClick.id) {
            entry.entries = 0
            break
          }
        }
        this.$refs.payloadRestartDialog.closeDialog()
        this.$refs.notifier.pushNotification('cleared!', `Payload counter has been cleared.`, 'success', 6000)
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot reset!', `There was an error during counter resetting. Error code: ${e.response.status}`, 'error', 10000)
      }
    }
  },
  mounted () {
    EventBus.$on('token_refresh', token => {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    })
  },
  destroyed () {
    EventBus.$off('token_refresh')
  },
  watch: {
    chartDataSettings: {
      deep: true,
      handler: function (u) {
        this.loadPayloadTraces()
      }
    }
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

.clicks {
  &__dialog-checkbox {
    margin-left: 0 !important;
    margin-top: 8px !important;
  }

  &__chart {
    width: 85vw;
    height: 70vh;
    margin: 0 auto;

    text {
      fill: #f2f2f2;
    }
  }

  &__chart-select {
    width: 10vw;
    color: $font-primary;

    select {
      margin-top: 5px;
    }
  }

  &__chart-control {
    display: flex;
    width: 40vw;
    min-width: 700px;
    margin: 0 auto;
  }
}
</style>
