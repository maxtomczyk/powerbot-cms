<template>
  <div class="dashboard view-with-navbar">
    <notifier ref="notifier"></notifier>
    <div class="dashboard__wrapper">
      <div class="container" style="width: 100%;">
        <div class="row">
          <div class="col-xs-12 col-md-6 mobile-limited-height">
            <div class="dashboard__status-panel dashboard__panel">
              <h3>SYSTEM STATUS</h3>
              <div class="status-panel__boxes">
                <div class="status-panel__box">
                  <div
                    class="dashboard__panel-header"
                    v-tooltip.bottom-start="'Status of API service.'"
                  >
                    <font-awesome-icon icon="server" size="lg" fixed-width/>
                    <h5>System</h5>
                  </div>
                  <div class="status-panel__content">
                    <div class="status-panel__data-row">
                      Status:
                      <span
                        class="status-panel__state"
                        :class="assignStatusClass(status.system)"
                      >{{ (status.system.live === true) ? 'Running' : (status.system.live === false) ? 'Down' : 'Unknown' }}</span>
                    </div>
                  </div>
                </div>
                <div class="status-panel__box">
                  <div
                    class="dashboard__panel-header"
                    v-tooltip.bottom-start="'Status of connected Postgres database status.'"
                  >
                    <font-awesome-icon icon="database" size="lg" fixed-width/>
                    <h5>Database</h5>
                  </div>
                  <div class="status-panel__content">
                    <div class="status-panel__data-row">
                      Status:
                      <span
                        class="status-panel__state"
                        :class="assignStatusClass(status.database)"
                      >{{ (status.database.live === true) ? 'Running' : (status.database.live === false) ? 'Down' : 'Unknown' }}</span>
                    </div>
                  </div>
                </div>
                <div class="status-panel__box">
                  <div
                    class="dashboard__panel-header"
                    v-tooltip.bottom-start="'Status of Redis cache service.'"
                  >
                    <font-awesome-icon icon="memory" size="lg" fixed-width/>
                    <h5>Cache</h5>
                  </div>
                  <div class="status-panel__content">
                    <div class="status-panel__data-row">
                      Status:
                      <span
                        class="status-panel__state"
                        :class="assignStatusClass(status.cache)"
                      >{{ (status.cache.live === true) ? 'Running' : (status.cache.live === false) ? 'Down' : 'Unknown' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-md-6 mobile-limited-height">
            <div class="dashboard__panel messages-panel">
              <div class="dashboard__panel-header-flex">
                <h3>MESSAGES</h3>
                <date-range :val="72" @change="setMessagesData">
                  <option :value="24">Last 24 hours</option>
                  <option :value="72">Last 72 hours</option>
                  <option :value="168">Last week</option>
                  <option :value="336">Last 2 weeks</option>
                  <option :value="720">Last month</option>
                  <option :value="2160">Last 3 months</option>
                  <option :value="4320">Last 6 months</option>
                  <option :value="8640">Last year</option>
                </date-range>
              </div>
              <div class="messages-panel__boxes">
                <div class="messages-panel__box">
                  <div class="dashboard__panel-header">
                    <font-awesome-icon icon="arrow-alt-circle-down" size="lg" fixed-width/>
                    <h5>Incoming</h5>
                  </div>
                  <div class="dashboard__panel-content">
                    <div
                      class="messages-panel__number dashboard__panel-number"
                    >{{ messages.incoming }}</div>
                  </div>
                </div>
                <div class="messages-panel__box">
                  <div class="dashboard__panel-header">
                    <font-awesome-icon icon="arrow-alt-circle-up" size="lg" fixed-width/>
                    <h5>Outgoing</h5>
                  </div>
                  <div class="dashboard__panel-content">
                    <div
                      class="messages-panel__number dashboard__panel-number"
                    >{{ messages.outgoing }}</div>
                  </div>
                </div>
                <div class="messages-panel__box">
                  <div class="dashboard__panel-header">
                    <font-awesome-icon icon="globe" size="lg" fixed-width/>
                    <h5>Total</h5>
                  </div>
                  <div class="dashboard__panel-content">
                    <div class="messages-panel__number dashboard__panel-number">{{ messages.total }}</div>
                  </div>
                </div>
                <div class="messages-panel__box">
                  <div class="dashboard__panel-header">
                    <font-awesome-icon icon="percentage" size="lg" fixed-width/>
                    <h5>O/I Ratio</h5>
                  </div>
                  <div class="dashboard__panel-content">
                    <div class="messages-panel__number dashboard__panel-number">{{ messages.ratio }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12 col-md-6 mobile-limited-height">
            <div class="dashboard__status-panel dashboard__panel">
              <h3>BOT</h3>
              <div class="messages-panel__boxes">
                <div class="messages-panel__box">
                  <div class="dashboard__panel-header">
                    <font-awesome-icon icon="comment-alt" size="lg" fixed-width/>
                    <h5>Messages</h5>
                  </div>
                  <div class="dashboard__panel-content">
                    <div class="messages-panel__number dashboard__panel-number">{{ bot.messages }}</div>
                  </div>
                </div>
                <div class="messages-panel__box">
                  <div class="dashboard__panel-header">
                    <font-awesome-icon icon="paperclip" size="lg" fixed-width/>
                    <h5>Attachments</h5>
                  </div>
                  <div class="dashboard__panel-content">
                    <div
                      class="messages-panel__number dashboard__panel-number"
                    >{{ bot.attachments }}</div>
                  </div>
                </div>
                <div class="messages-panel__box">
                  <div class="dashboard__panel-header">
                    <font-awesome-icon icon="calendar-alt" size="lg" fixed-width/>
                    <h5>Days in web</h5>
                  </div>
                  <div class="dashboard__panel-content">
                    <div class="messages-panel__number dashboard__panel-number">{{ bot.daysUp }}</div>
                  </div>
                </div>
                <div class="messages-panel__box">
                  <div class="dashboard__panel-header">
                    <font-awesome-icon icon="bullhorn" size="lg" fixed-width/>
                    <h5>Broadcasts</h5>
                  </div>
                  <div class="dashboard__panel-content">
                    <div class="messages-panel__number dashboard__panel-number">{{ bot.broadcasts }}</div>
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
                    <font-awesome-icon icon="percentage" size="lg" fixed-width/>
                    <h5>Gender</h5>
                  </div>
                  <div class="dashboard__panel-content">
                    <div
                      class="messages-panel__number dashboard__panel-number"
                      style="font-size: 1.1em;"
                    >
                      <div>
                        <span class="dashboard__panel-number-title">Males:</span>
                        {{ users.percents.male }}%
                      </div>
                      <div>
                        <span class="dashboard__panel-number-title">Females:</span>
                        {{ users.percents.female }}%
                      </div>
                    </div>
                  </div>
                </div>
                <div class="messages-panel__box">
                  <div class="dashboard__panel-header">
                    <font-awesome-icon icon="users" size="lg" fixed-width/>
                    <h5>All</h5>
                  </div>
                  <div class="dashboard__panel-content">
                    <div class="messages-panel__number dashboard__panel-number">{{ users.total }}</div>
                  </div>
                </div>
                <div class="messages-panel__box">
                  <div class="dashboard__panel-header">
                    <font-awesome-icon icon="user-times" size="lg" fixed-width/>
                    <h5>Deleted</h5>
                  </div>
                  <div class="dashboard__panel-content">
                    <div class="messages-panel__number dashboard__panel-number">{{ users.deleted }}</div>
                  </div>
                </div>
                <div class="messages-panel__box">
                  <div class="dashboard__panel-header">
                    <font-awesome-icon icon="user-clock" size="lg" fixed-width/>
                    <h5>Awaiting</h5>
                  </div>
                  <div class="dashboard__panel-content">
                    <div class="messages-panel__number dashboard__panel-number">{{ users.awaiting }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row" style>
          <div class="col-xs-12">
            <div class="dashboard__panel chart-panel">
              <div class="dashboard__panel-header-flex">
                <h3>MESSAGES IN TIME</h3>
                <date-range :val="72" @change="setMessagesChartData">
                  <option :value="24">Last 24 hours</option>
                  <option :value="72">Last 72 hours</option>
                  <option :value="168">Last week</option>
                  <option :value="336">Last 2 weeks</option>
                  <option :value="720">Last month</option>
                  <option :value="2160">Last 3 months</option>
                  <option :value="4320">Last 6 months</option>
                  <option :value="8640">Last year</option>
                </date-range>
              </div>
              <div class="dashboard__panel-content">
                <apexchart
                  ref="messagesChart"
                  type="line"
                  height="330"
                  :options="messagesChart.options"
                  :series="messagesChart.series"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row" style>
          <div class="col-xs-12 col-lg-12">
            <div class="dashboard__panel chart-panel">
              <div class="dashboard__panel-header-flex">
                <h3>DAILY USERS</h3>
                <date-range :val="30" @change="setDailyUsersChart">
                  <option :value="7">Last week</option>
                  <option :value="14">Last 2 weeks</option>
                  <option :value="30">Last month</option>
                  <option :value="90">Last 3 months</option>
                </date-range>
              </div>
              <div class="dashboard__panel-content">
                <apexchart
                  type="area"
                  height="350"
                  ref="dailyUsersChart"
                  :options="dailyUsersChart.options"
                  :series="dailyUsersChart.series"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row" style>
          <div class="col-xs-12 col-lg-6">
            <div class="dashboard__panel chart-panel">
              <div class="dashboard__panel-header-flex">
                <h3>WEEKLY USERS</h3>
                <date-range :val="9" @change="setWeeklyUsersChart">
                  <option :value="9">Last 2 months</option>
                  <option :value="13">Last 3 months</option>
                  <option :value="26">Last 6 months</option>
                  <option :value="52">Last year</option>
                </date-range>
              </div>
              <div class="dashboard__panel-content">
                <apexchart
                  type="area"
                  height="350"
                  ref="weeklyUsersChart"
                  :options="weeklyUsersChart.options"
                  :series="weeklyUsersChart.series"
                />
              </div>
            </div>
          </div>

          <div class="col-xs-12 col-lg-6">
            <div class="dashboard__panel chart-panel">
              <div class="dashboard__panel-header-flex">
                <h3>MONTHLY USERS</h3>
                <date-range :val="6" @change="setMonthlyUsersChart">
                  <option :value="6">Last 6 months</option>
                  <option :value="12">Last year</option>
                  <option :value="24">Last 2 years</option>
                </date-range>
              </div>
              <div class="dashboard__panel-content">
                <apexchart
                  type="area"
                  height="350"
                  ref="monthlyUsersChart"
                  :options="monthlyUsersChart.options"
                  :series="monthlyUsersChart.series"
                />
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
import { EventBus } from '../event-bus'

export default {
  data () {
    return {
      statusInterval: null,
      messagesPanelRange: 72,
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
              formatter: val => {
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

                return `${hs}:${ms} - ${he}:${me} UTC`
              }
            }
          },
          markers: {
            size: 0
          }
        },
        series: [
          {
            name: 'Outgoing',
            data: []
          },
          {
            name: 'Incoming',
            data: []
          },
          {
            name: 'Total',
            data: []
          }
        ]
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
          tooltip: {
            x: {
              show: true,
              formatter: val => {
                const months = [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec'
                ]
                let start = new Date(val + 3 * 60 * 60 * 1000)
                return `${start.getDate()} ${months[start.getMonth()]}`
              }
            }
          },
          markers: {
            size: 0
          }
        },
        series: [
          {
            name: 'Total users',
            data: []
          },
          {
            name: 'Active users',
            data: []
          },
          {
            name: 'New users',
            data: []
          }
        ]
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
              formatter: val => {
                const months = [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec'
                ]
                let start = new Date(val + 3 * 60 * 60 * 1000)
                let end = new Date(
                  +new Date(start) +
                  7 * 24 * 60 * 60 * 1000 -
                  2 * 60 * 60 * 1000
                )
                return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]}`
              }
            }
          },
          markers: {
            size: 0
          }
        },
        series: [
          {
            name: 'Total users',
            data: []
          },
          {
            name: 'Active users',
            data: []
          },
          {
            name: 'New users',
            data: []
          }
        ]
      },

      monthlyUsersChart: {
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
              formatter: val => {
                const months = [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec'
                ]
                let start = new Date(val + 3 * 60 * 60 * 1000)
                return `${months[start.getMonth()]} ${start.getFullYear()}`
              }
            }
          },
          markers: {
            size: 0
          }
        },
        series: [
          {
            name: 'Total users',
            data: []
          },
          {
            name: 'Active users',
            data: []
          },
          {
            name: 'New users',
            data: []
          }
        ]
      }
    }
  },

  methods: {
    assignStatusClass (status) {
      if (status.live === true) return 'status-panel__state--up'
      else if (status.live === false) return 'status-panel__state--down'
      else return 'status-panel__state--unknown'
    },

    async getSystemStatus () {
      try {
        const status = await axios.get('/api/stats/system')
        this.status = status.data
      } catch (e) {
        this.status.system.live = false
        this.status.database.live = null
        this.status.cache.live = null
      }
    },

    async setMessagesChartData (hours) {
      try {
        const url = (typeof hours === 'object') ? `/api/stats/messages_chart?start=${hours.start}&end=${hours.end}` : `/api/stats/messages_chart?hours=${hours}`
        const request = await axios.get(url)

        this.messagesChart.series[0].data = []
        this.messagesChart.series[1].data = []
        this.messagesChart.series[2].data = []

        for (const row of request.data.stats) {
          this.messagesChart.series[0].data.push({
            x: row.start,
            y: row.messages_outgoing
          })
          this.messagesChart.series[1].data.push({
            x: row.start,
            y: row.messages_incoming
          })
          this.messagesChart.series[2].data.push({
            x: row.start,
            y: row.messages_total
          })
        }
      } catch (e) {
        this.$refs.notifier.pushNotification(
          'cannot load!',
          `An error occured during messages time chart data load. Error code: ${e.response.status}`,
          'error',
          10000
        )
      }
    },

    async setMessagesData (hours) {
      try {
        const url =
          typeof hours === 'object'
            ? `/api/stats/messages?start=${hours.start}&end=${hours.end}`
            : `/api/stats/messages?hours=${hours}`
        const request = await axios.get(url)
        this.messages = request.data
      } catch (e) {
        this.$refs.notifier.pushNotification(
          'cannot load!',
          `An error occured during messages statistic data load. Error code: ${e.response.status}`,
          'error',
          10000
        )
      }
    },

    async setBotData () {
      try {
        const request = await axios.get('/api/stats/bot')
        this.bot = request.data
      } catch (e) {
        this.$refs.notifier.pushNotification(
          'cannot load!',
          `An error occured during bot data load. Error code: ${e.response.status}`,
          'error',
          10000
        )
      }
    },

    async setUsersData () {
      try {
        const request = await axios.get('/api/stats/users')
        this.users = request.data
      } catch (e) {
        this.$refs.notifier.pushNotification(
          'cannot load!',
          `An error occured during users data load. Error code: ${e.response.status}`,
          'error',
          10000
        )
      }
    },

    async setDailyUsersChart (days) {
      try {
        const url =
          typeof days === 'object'
            ? `/api/stats/users_daily_chart?start=${days.start}&end=${days.end}`
            : `/api/stats/users_daily_chart?days=${days}`
        const request = await axios.get(url)
        this.dailyUsersChart.series[0].data = []
        this.dailyUsersChart.series[1].data = []
        this.dailyUsersChart.series[2].data = []

        for (const row of request.data.rows) {
          this.dailyUsersChart.series[0].data.push({
            x: row.start,
            y: row.all_users
          })
          this.dailyUsersChart.series[1].data.push({
            x: row.start,
            y: row.unique_users
          })
          this.dailyUsersChart.series[2].data.push({
            x: row.start,
            y: row.new_users
          })
        }
      } catch (e) {
        this.$refs.notifier.pushNotification(
          'cannot load!',
          `An error occured during users daily chart data load. Error code: ${e.response.status}`,
          'error',
          10000
        )
      }
    },

    async setWeeklyUsersChart (weeks) {
      try {
        const url = (typeof weeks === 'object') ? `/api/stats/users_weekly_chart?start=${weeks.start}&end=${weeks.end}` : `/api/stats/users_weekly_chart?weeks=${weeks}`
        const request = await axios.get(url)

        this.weeklyUsersChart.series[0].data = []
        this.weeklyUsersChart.series[1].data = []
        this.weeklyUsersChart.series[2].data = []

        for (const row of request.data.rows) {
          this.weeklyUsersChart.series[0].data.push({
            x: row.start,
            y: row.all_users
          })
          this.weeklyUsersChart.series[1].data.push({
            x: row.start,
            y: row.unique_users
          })
          this.weeklyUsersChart.series[2].data.push({
            x: row.start,
            y: row.new_users
          })
        }
      } catch (e) {
        this.$refs.notifier.pushNotification(
          'cannot load!',
          `An error occured during users weekly chart data load. Error code: ${e.response.status}`,
          'error',
          10000
        )
      }
    },

    async setMonthlyUsersChart (months) {
      try {
        const url = (typeof months === 'object') ? `/api/stats/users_monthly_chart?start=${months.start}&end=${months.end}` : `/api/stats/users_monthly_chart?months=${months}`

        const request = await axios.get(url)
        this.monthlyUsersChart.series[0].data = []
        this.monthlyUsersChart.series[1].data = []
        this.monthlyUsersChart.series[2].data = []

        for (const row of request.data.rows) {
          this.monthlyUsersChart.series[0].data.push({
            x: row.start,
            y: row.all_users
          })
          this.monthlyUsersChart.series[1].data.push({
            x: row.start,
            y: row.unique_users
          })
          this.monthlyUsersChart.series[2].data.push({
            x: row.start,
            y: row.new_users
          })
        }
      } catch (e) {
        this.$refs.notifier.pushNotification(
          'cannot load!',
          `An error occured during users monthly chart data load. Error code: ${e.response.status}`,
          'error',
          10000
        )
      }
    }
  },

  async created () {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
      let that = this
      await this.getSystemStatus()
      await this.setMessagesChartData(72)
      await this.setMessagesData(this.messagesPanelRange)
      await this.setBotData()
      await this.setUsersData()
      await this.setDailyUsersChart(30)
      await this.setWeeklyUsersChart(9)
      await this.setMonthlyUsersChart(6)
      setInterval(async function () {
        await that.getSystemStatus()
      }, 60 * 1000)
    } catch (e) {
      this.$refs.notifier.pushNotification(
        'cannot load!',
        `An error occured during data load. Error code: ${e.response.status}`,
        'error',
        10000
      )
    }
  },

  async mounted () {
    EventBus.$on('token_refresh', token => {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    })
  },

  destroyed () {
    EventBus.$off('token_refresh')
    clearInterval(this.statusInterval)
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

.dashboard {
  .row {
    padding: 15px;

    &:not(:first-of-type) {
      margin-top: 25px;
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
    -webkit-box-shadow: 0 1px 11px -2px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0 1px 11px -2px rgba(0, 0, 0, 0.75);
    box-shadow: 0 1px 11px -2px rgba(0, 0, 0, 0.75);
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

  &__panel-header-flex {
    display: flex;
    flex-wrap: wrap;

    select {
      left: 20px;
      top: -6px;
      width: 20% !important;
      min-width: 130px;
      position: relative;
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

  & > .notifier__row {
    background: pink;
  }
}

.status-panel {
  &__boxes {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  &__box {
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

@media only screen and (max-width: 768px) {
  .dashboard {
    .row {
      height: auto !important;
      margin-top: 0px !important;
    }

    .mobile-limited-height {
      &:not(:last-of-type) {
        margin-bottom: 20px;
      }
    }

    &__panel {
      height: auto !important;
    }

    &__panel-header {
      h5 {
        display: none;
      }
    }

    &__panel-number {
      font-size: 1em;
    }
  }
}
</style>
