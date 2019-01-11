<template>
<div class="dashboard view-with-navbar">
  <notifier ref="notifier"></notifier>
  <div class="dashboard__wrapper">
    <div class="container" style="width: 100%;">
      <div class="row" style="height: 18vh; min-height: 150px">
        <div class="col-xs-12 col-md-6">
          <div class="dashboard__status-panel dashboard__panel">
            <h3>SYSTEM STATUS</h3>
            <div class="status-panel__boxes">
              <div class="status-panel__box">
                <div class="dashboard__panel-header" v-tooltip.bottom-start="'Status of API service.'">
                  <font-awesome-icon icon="server" size="lg" fixed-width />
                  <h5>System</h5>
                </div>
                <div class="status-panel__content">
                  <div class="status-panel__data-row">
                    Status: <span class="status-panel__state" :class="assignStatusClass(status.system)">{{ (status.system.live === true) ? 'Running' : (status.system.live === false) ? 'Down' : 'Unknown' }}</span>
                  </div>
                </div>
              </div>
              <div class="status-panel__box">
                <div class="dashboard__panel-header" v-tooltip.bottom-start="'Status of connected Postgres database status.'">
                  <font-awesome-icon icon="database" size="lg" fixed-width />
                  <h5>Database</h5>
                </div>
                <div class="status-panel__content">
                  <div class="status-panel__data-row">
                    Status: <span class="status-panel__state" :class="assignStatusClass(status.database)">{{ (status.database.live === true) ? 'Running' : (status.database.live === false) ? 'Down' : 'Unknown' }}</span>
                  </div>
                </div>
              </div>
              <div class="status-panel__box">
                <div class="dashboard__panel-header" v-tooltip.bottom-start="'Status of Redis cache service.'">
                  <font-awesome-icon icon="memory" size="lg" fixed-width />
                  <h5>Cache</h5>
                </div>
                <div class="status-panel__content">
                  <div class="status-panel__data-row">
                    Status: <span class="status-panel__state" :class="assignStatusClass(status.cache)">{{ (status.cache.live === true) ? 'Running' : (status.cache.live === false) ? 'Down' : 'Unknown' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-md-6">
          <div class="dashboard__panel messages-panel">
            <h3>MESSAGES</h3>
            <div class="messages-panel__boxes">
              <div class="messages-panel__box">
                <div class="dashboard__panel-header">
                  <font-awesome-icon icon="arrow-alt-circle-down" size="lg" fixed-width />
                  <h5>Incoming</h5>
                </div>
                <div class="dashboard__panel-content">
                  <div class="messages-panel__number dashboard__panel-number">
                    {{ messages.incoming }}
                  </div>
                </div>
              </div>
              <div class="messages-panel__box">
                <div class="dashboard__panel-header">
                  <font-awesome-icon icon="arrow-alt-circle-up" size="lg" fixed-width />
                  <h5>Outgoing</h5>
                </div>
                <div class="dashboard__panel-content">
                  <div class="messages-panel__number dashboard__panel-number">
                    {{ messages.outgoing }}
                  </div>
                </div>
              </div>
              <div class="messages-panel__box">
                <div class="dashboard__panel-header">
                  <font-awesome-icon icon="globe" size="lg" fixed-width />
                  <h5>Total</h5>
                </div>
                <div class="dashboard__panel-content">
                  <div class="messages-panel__number dashboard__panel-number">
                    {{ messages.total }}
                  </div>
                </div>
              </div>
              <div class="messages-panel__box">
                <div class="dashboard__panel-header">
                  <font-awesome-icon icon="percentage" size="lg" fixed-width />
                  <h5>O/I Ratio</h5>
                </div>
                <div class="dashboard__panel-content">
                  <div class="messages-panel__number dashboard__panel-number">
                    {{ messages.ratio }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row" style="height: 18vh; min-height: 150px">
        <div class="col-xs-12 col-md-6">
          <div class="dashboard__status-panel dashboard__panel">
            <h3>BOT</h3>
            <div class="messages-panel__boxes">
              <div class="messages-panel__box">
                <div class="dashboard__panel-header">
                  <font-awesome-icon icon="comment-alt" size="lg" fixed-width />
                  <h5>Messages</h5>
                </div>
                <div class="dashboard__panel-content">
                  <div class="messages-panel__number dashboard__panel-number">
                    {{ bot.messages }}
                  </div>
                </div>
              </div>
              <div class="messages-panel__box">
                <div class="dashboard__panel-header">
                  <font-awesome-icon icon="paperclip" size="lg" fixed-width />
                  <h5>Attachments</h5>
                </div>
                <div class="dashboard__panel-content">
                  <div class="messages-panel__number dashboard__panel-number">
                    {{ bot.attachments }}
                  </div>
                </div>
              </div>
              <div class="messages-panel__box">
                <div class="dashboard__panel-header">
                  <font-awesome-icon icon="calendar-alt" size="lg" fixed-width />
                  <h5>Days in web</h5>
                </div>
                <div class="dashboard__panel-content">
                  <div class="messages-panel__number dashboard__panel-number">
                    {{ bot.daysUp }}
                  </div>
                </div>
              </div>
              <div class="messages-panel__box">
                <div class="dashboard__panel-header">
                  <font-awesome-icon icon="bullhorn" size="lg" fixed-width />
                  <h5>Broadcasts</h5>
                </div>
                <div class="dashboard__panel-content">
                  <div class="messages-panel__number dashboard__panel-number">
                    {{ bot.broadcasts }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-md-6">
          <div class="dashboard__panel messages-panel">
            <h3>USERS</h3>
            <div class="messages-panel__boxes">
              <div class="messages-panel__box">
                <div class="dashboard__panel-header">
                  <font-awesome-icon icon="percentage" size="lg" fixed-width />
                  <h5>Gender</h5>
                </div>
                <div class="dashboard__panel-content">
                  <div class="messages-panel__number dashboard__panel-number" style="font-size: 1.1em;">
                    <div><span class="dashboard__panel-number-title">Males: </span>{{ users.percents.male }}%</div>
                    <div><span class="dashboard__panel-number-title">Females: </span>{{ users.percents.female }}%</div>
                  </div>
                </div>
              </div>
              <div class="messages-panel__box">
                <div class="dashboard__panel-header">
                  <font-awesome-icon icon="users" size="lg" fixed-width />
                  <h5>All</h5>
                </div>
                <div class="dashboard__panel-content">
                  <div class="messages-panel__number dashboard__panel-number">
                    {{ users.total }}
                  </div>
                </div>
              </div>
              <div class="messages-panel__box">
                <div class="dashboard__panel-header">
                  <font-awesome-icon icon="user-times" size="lg" fixed-width />
                  <h5>Deleted</h5>
                </div>
                <div class="dashboard__panel-content">
                  <div class="messages-panel__number dashboard__panel-number">
                    {{ users.deleted }}
                  </div>
                </div>
              </div>
              <div class="messages-panel__box">
                <div class="dashboard__panel-header">
                  <font-awesome-icon icon="user-clock" size="lg" fixed-width />
                  <h5>Awaiting</h5>
                </div>
                <div class="dashboard__panel-content">
                  <div class="messages-panel__number dashboard__panel-number">
                    {{ users.awaiting }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row" style="">
        <div class="col-xs-12">
          <div class="dashboard__panel chart-panel">
            <h3>MESSAGES IN TIME</h3>
            <div class="dashboard__panel-content">
              <apexchart ref="messagesChart" type="line" height="330" :options="messagesChart.options" :series="messagesChart.series" />
            </div>
          </div>
        </div>
      </div>

      <div class="row" style="">
        <div class="col-xs-12 col-lg-6">
          <div class="dashboard__panel chart-panel">
            <h3>DAILY USERS</h3>
            <div class="dashboard__panel-content">
              <apexchart type="area" height="350" ref="dailyUsersChart" :options="dailyUsersChart.options" :series="dailyUsersChart.series" />
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-lg-6">
          <div class="dashboard__panel chart-panel">
            <h3>WEEKLY USERS</h3>
            <div class="dashboard__panel-content">
              <apexchart type="area" height="350" ref="weeklyUsersChart" :options="weeklyUsersChart.options" :series="weeklyUsersChart.series" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import {
  EventBus
} from '../event-bus'

export default {
  data() {
    return {
      statusInterval: null,
      status: {
        system: {
          live: null
        },
        database: {
          live: null
        },
        cache: {
          live: null
        }
      },
      messages: {
        incoming: 0,
        outgoing: 0,
        total: 0,
        ratio: 0
      },

      bot: {
        messages: 0,
        attachments: 0,
        broadcasts: 0,
        daysUp: 0
      },

      users: {
        total: 0,
        deleted: 0,
        awaiting: 0,
        percents: {
          male: 0,
          female: 0
        }
      },

      messagesChart: {
        options: {
          xaxis: {
            type: 'datetime',
            categories: [],
            tooltip: {
              enabled: false
            }
          },
          tooltip: {
            x: {
              show: true,
              formatter: (val) => {
                let start = new Date(val)
                let end = new Date(+new Date(start) + 10 * 60 * 1000)

                let hs = start.getHours().toString()
                let ms = start.getMinutes().toString()
                let he = end.getHours().toString()
                let me = end.getMinutes().toString()

                if (hs.length !== 2) hs = `0${hs}`
                if (ms.length !== 2) ms = `0${ms}`
                if (he.length !== 2) he = `0${he}`
                if (me.length !== 2) me = `0${me}`

                return `${hs}:${ms} - ${he}:${me}`
              }
            }
          },
          markers: {
            size: 0
          }
        },
        series: [{
          name: 'Outgoing',
          data: []
        }, {
          name: 'Incoming',
          data: []
        }, {
          name: 'Total',
          data: []
        }]
      },

      dailyUsersChart: {
        options: {
          xaxis: {
            type: 'datetime',
            categories: [],
            tooltip: {
              enabled: false
            }
          },
          markers: {
            size: 0
          }
        },
        series: [{
          name: 'Total users',
          data: []
        }, {
          name: 'Active users',
          data: []
        }]
      },

      weeklyUsersChart: {
        options: {
          xaxis: {
            type: 'datetime',
            categories: [],
            tooltip: {
              enabled: false
            }
          },
          tooltip: {
            x: {
              show: true,
              formatter: (val) => {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                let start = new Date(val)
                let end = new Date(+new Date(start) + 7 * 24 * 60 * 60 * 1000)
                return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]}`
              }
            }
          },
          markers: {
            size: 0
          }
        },
        series: [{
          name: 'Total users',
          data: []
        }, {
          name: 'Active users',
          data: []
        }]
      }
    }
  },

  methods: {
    assignStatusClass(status) {
      if (status.live === true) return 'status-panel__state--up'
      else if (status.live === false) return 'status-panel__state--down'
      else return 'status-panel__state--unknown'
    },

    async getSystemStatus() {
      try {
        const status = await axios.get('/api/stats/system')
        this.status = status.data
      } catch (e) {
        this.status.system.live = false
        this.status.database.live = null
        this.status.cache.live = null
      }
    },

    async setMessagesChartData(hours) {
      try {
        const request = await axios.get(`/api/stats/messages_chart?hours=${hours}`)
        this.messagesChart.options.xaxis.categories = request.data.xaxis

        this.$refs.messagesChart.refresh()
        for (const row of request.data.stats) {
          this.messagesChart.series[0].data.push(row.messages_outgoing)
          this.messagesChart.series[1].data.push(row.messages_incoming)
          this.messagesChart.series[2].data.push(row.messages_total)
        }
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot load!', `An error occured during messages time chart data load. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    async setMessagesData(hours) {
      try {
        const request = await axios.get(`/api/stats/messages?hours=${hours}`)
        this.messages = request.data
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot load!', `An error occured during messages statistic data load. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    async setBotData() {
      try {
        const request = await axios.get('/api/stats/bot')
        this.bot = request.data
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot load!', `An error occured during bot data load. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    async setUsersData() {
      try {
        const request = await axios.get('/api/stats/users')
        this.users = request.data
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot load!', `An error occured during users data load. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    async setDailyUsersChart(days) {
      try {
        const request = await axios.get(`/api/stats/users_daily_chart?days=${days}`)
        this.dailyUsersChart.options.xaxis.categories = request.data.xaxis
        this.$refs.dailyUsersChart.refresh()
        this.dailyUsersChart.series[0].data = request.data.allUsers
        this.dailyUsersChart.series[1].data = request.data.uniqueUsers
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot load!', `An error occured during users daily chart data load. Error code: ${e.response.status}`, 'error', 10000)
      }
    },

    async setWeeklyUsersChart(weeks) {
      try {
        const request = await axios.get(`/api/stats/users_weekly_chart?weeks=${weeks}`)
        this.weeklyUsersChart.options.xaxis.categories = request.data.xaxis
        this.$refs.weeklyUsersChart.refresh()
        this.weeklyUsersChart.series[0].data = request.data.allUsers
        this.weeklyUsersChart.series[1].data = request.data.uniqueUsers
      } catch (e) {
        this.$refs.notifier.pushNotification('cannot load!', `An error occured during users weekly chart data load. Error code: ${e.response.status}`, 'error', 10000)
      }
    }
  },

  async created() {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
      let that = this
      await this.getSystemStatus()
      await this.setMessagesChartData(72)
      await this.setMessagesData(72)
      await this.setBotData()
      await this.setUsersData()
      await this.setDailyUsersChart(21)
      await this.setWeeklyUsersChart(26)
      setInterval(async function() {
        await that.getSystemStatus()
      }, 60 * 1000)
    } catch (e) {
      this.$refs.notifier.pushNotification('cannot load!', `An error occured during data load. Error code: ${e.response.status}`, 'error', 10000)
    }
  },

  async mounted() {
    EventBus.$on('token_refresh', token => {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    })
  },

  destroyed() {
    EventBus.$off('token_refresh')
    clearInterval(this.statusInterval)
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

.dashboard {

    .row {
        & > div {
            margin-bottom: 50px;
        }
    }

    &__wrapper {
        width: 90%;
        margin: 0 auto;
    }

    &__panel {
        height: 100%;
        background-color: $bg-accent;
        color: $font-primary;
        padding: 15px;
        -webkit-box-shadow: 0 1px 11px -2px rgba(0,0,0,0.75);
        -moz-box-shadow: 0 1px 11px -2px rgba(0,0,0,0.75);
        box-shadow: 0 1px 11px -2px rgba(0,0,0,0.75);
        h3 {
            margin-bottom: 3px;
            margin-top: 0;
        }
    }

    &__panel-header {
        display: flex;
        align-items: center;
        margin-top: 0;
        height: 30px;
        cursor: default;

        h5 {
            margin-left: 8px;
            font-size: 1.03em;
        }
    }

    &__panel-content {
        width: 100%;
        height: calc(65% - 5px);
    }

    &__panel-number {
        font-size: 1.5em;
        padding-left: 15px;
        margin-top: 5px;
    }

    &__panel-number-title {
        font-size: 0.7em;
    }
}

.status-panel {
    &__boxes {
        display: flex;
        justify-content: space-around;
    }

    &__box {
        height: 100px;
        width: calc(32% - 6px);
        padding: 3px;
    }

    &__content {
        margin-top: 6px;
    }

    &__state {
        font-weight: 700;

        &--unknown {
            color: $warning;
        }

        &--up {
            color: $green;
        }

        &--down {
            color: $error;
        }
    }
}

.messages-panel {
    &__boxes {
        display: flex;
        justify-content: space-around;
    }

    &__box {
        height: 100px;
        width: calc(24% - 6px);
        padding: 3px;
    }
}

.chart-panel {
    padding-bottom: 0;
}

.messages-chart {
    &__label {
        position: relative;
        left: 0;
        width: 10%;
        text-align: left;
    }
}

.apexcharts-canvas {
    margin: 0 auto;
}

.apexcharts-legend-text {
    color: $font-primary !important;
}
</style>
