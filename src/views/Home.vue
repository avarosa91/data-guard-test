<template>
<div class="home-wrapper">
  <b-card no-body>
    <div class="logo">
      <img src="@/assets/logo.png" alt="logo">
    </div>
    <b-tabs v-if="!isBusy" pills card vertical nav-wrapper-class="w-25">
      <template v-for="(value, name) in tabData">
        <b-tab :id="name" :key="`${name}`" @click="changeRoute(name)" :active="activeTab === name">
          <template #title>
            <icon :icon="value.icon" />
            <span>{{ value.title }}</span>
          </template>
          <b-card-text>{{ value.title }} Plugins</b-card-text>
          <div class="plugins-list">
            <template v-for="item in pluginsData[name]">
              <plugin :key="`${item.id}-p`" :tab="name" :plugin="item" @onChangePluginCheckbox="onChangePluginCheckbox" />
            </template>
          </div>
        </b-tab>
      </template>
    </b-tabs>
    <div class="switcher">
        <b-form-checkbox
            :class="colorClass"
            v-model="isEnabled"
            name="check-button"
            switch
            @change="onChangeSwitcher()"
        />
        <span class="check-text">{{ checkText }}</span>
    </div>
    <div :class="!isEnabled ? 'color-bottom w-25 disabled' : 'color-bottom w-25 active'"></div>
  </b-card>
</div>
</template>

<script>
import Icon from '@/components/Icon.vue';
import { mapActions, mapGetters } from 'vuex';
import Plugin from '@/components/Plugin.vue';

export default {
  name: "Home",
  components: {
    Icon,
    Plugin,
  },
  data() {
    return {
      isBusy: true,
      tab: 'tab1',
      colorClass: 'active',
      checkText: 'All plugins enabled',
      isEnabled: true,
    };
  },
  created()
  {
    this.getTabsData();
  }
,
  computed: {
    ...mapGetters(['tabData', 'plugins']),
    activeTab() {
      return this.$route.params.tab;
    },
    pluginsData() {
      let obj = {};
      Object.entries(this.tabData).forEach(([key, value]) => {
        obj[key] = [];
        value.active.forEach((item) => obj[key].push([parseInt(item.replace('plugin', '')), { isActive: 'active', id: parseInt(item.replace('plugin', '')) }]));
        value.inactive.forEach((item) => obj[key].push([parseInt(item.replace('plugin', '')), { isActive: 'inactive', id: parseInt(item.replace('plugin', '')) }]));
        value.disabled.forEach((item) => obj[key].push([parseInt(item.replace('plugin', '')), { isActive: 'disabled', id: parseInt(item.replace('plugin', '')) }]));
      });
      Object.values(obj).map((item) => (item.sort((a, b) => a[0] - b[0])));
      Object.values(obj).map((tab) => tab.map((item) => item[0] = 'plugin' + item[0]));
      Object.entries(obj).map(([key, value]) => obj[key] = Object.fromEntries(value));
      Object.values(obj).map((item) => {
        Object.entries(item).map(([key]) => item[key].plugin = this.plugins[key])
      });
      return obj;
    },
  },
  methods: {
    ...mapActions(['fetchTabsData', 'fetchPlugins', 'changeTabsData']),
    changeRoute(tab) {
      if (this.activeTab === tab) {
        return;
      }
      this.isEnabled = this.tabData[tab].enabledAll;
      this.$router.push({ name: 'Home', params: { tab: tab } });
    },
    getTabsData() {
      this.isBusy = true;
      this.fetchTabsData().then((res) => {
        this.isBusy = false;
        this.isEnabled = res.data[this.activeTab].enabledAll;
      }).catch((err) => console.log(err));
      this.fetchPlugins().then(() => {
        this.isBusy = false;
      }).catch((err) => console.log(err));
    },
    onChangeSwitcher() {
      const arr = [];
      if (!this.isEnabled) {
        this.colorClass = 'disabled';
        this.checkText = 'All plugins disabled';
        Object.keys(this.tabData).forEach((key) => {
          this.tabData[key].active.map((item) => {
            if (this.tabData[key].disabled.some((elem) => elem === item)) {
              return;
            }
            this.tabData[key].disabled.push(item)
          });
          this.tabData[key].inactive.map((item) => {
            if (this.tabData[key].disabled.some((elem) => elem === item)) {
              return;
            }
            this.tabData[key].disabled.push(item)
          });
          this.tabData[key].active = [];
          this.tabData[key].inactive = [];
          this.tabData[key].inactive.map((item) => arr.push(item));
        })
      } else {
        this.colorClass = 'active';
        this.checkText = 'All plugins enabled';
        Object.keys(this.tabData).forEach((key) => {
          this.tabData[key].disabled.map((elem) => this.tabData[key].inactive.push(elem));
          this.tabData[key].disabled = [];
        });
      }

      const payload = {
        payload: this.tabData,
      }

      this.changeTabsData(payload).then(() => {
        this.getTabsData();
      }).catch((err) => console.log(err));
    },
    onChangePluginCheckbox({ tab, plugin }) {
      if (this.tabData[tab].active.some((elem) => elem === plugin)) {
          this.tabData[tab].active = this.tabData[tab].active.filter((elem) => elem !== plugin);
          this.tabData[tab].inactive.push(plugin);
        } else if (this.tabData[tab].inactive.some((elem) => elem === plugin)) {
          this.tabData[tab].inactive = this.tabData[tab].inactive.filter((elem) => elem !== plugin);
          this.tabData[tab].active.push(plugin);
        }

      const payload = {
        payload: this.tabData,
      }

      this.changeTabsData(payload).then(() => {
        this.getTabsData();
      }).catch((err) => console.log(err));
    }
  },
  watch: {
    isEnabled: {
      handler() {
        if (this.isEnabled) {
          this.colorClass = 'active';
          this.checkText = 'All plugins enabled';
        } else {
          this.colorClass = 'disabled';
          this.checkText = 'All plugins disabled';
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-wrapper {
  height: 100%;
  font-family: 'Verdana', sans-serif;
  font-size: 14px;
  .card {
    border: none;
    .logo {
      padding: 30px;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      img {
        width: 150px;
      }
    }
    .tabs {
      ::v-deep .col-auto {
        height: 100vh;
        background-color: $light-gray;
        ul.card-header {
          padding-top: 100px;
          width: 100%;
          padding-left: 0;
          padding-right: 0;
          .nav-item {
            .nav-link {
              text-align: left;
              padding: 15px 30px;
              color: $black;
              display: flex;
              &.active {
                background-color: $white;
                color: $black;
                display: flex;
                &:before {
                  content: '';
                  display: block;
                  position: absolute;
                  margin-top: -15px;
                  height: 51px;
                  left: 0;
                  width: 5px;
                  background-color: $red;
                }
              }
              span {
                margin-left: 10px;
              }
            }
          }
        }
      }
      .tab-content {
        .card-text {
          text-align: left;
          margin-left: 15px;
        }
        .plugins-list {
          display: flex;
          flex-wrap: wrap;
        }
      }
    }
    .switcher {
      position: absolute;
      bottom: 25px;
      left: 50px;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      ::v-deep .custom-control {
        .custom-control-label::after {
          background-color: $white;
        }
        &.active {
          .custom-control-label::before {
            background-color: $green;
            border-color: $green;
          }
        }
        &.disabled {
          .custom-control-label::before {
            background-color: $red;
            border-color: $red;
          }
        }
      }
      .check-text {
        font-size: 11px;
        font-weight: 600;
        display: block;
        margin-right: 30px;
      }
    }
    .color-bottom {
      display: block;
      position: absolute;
      bottom: 0;
      height: 30px;
      width: 100%;
      &.active {
        background-color: $green;
        background: linear-gradient(0deg, rgba(91,200,141,1) 0%, rgba(242,242,242,0) 100%);
      }
      &.disabled {
        background-color: $red;
        background: linear-gradient(0deg, rgba(198,48,64,1) 0%, rgba(242,242,242,0) 100%);
      }
    }
  }
}
</style>
