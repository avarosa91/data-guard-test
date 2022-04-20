<template>
<div v-if="pluginItem"  :class="isDisabled ? 'plugin disabled' : 'plugin'">
  <div class="p-header">
    <p class="p-title">{{ pluginItem.title }}</p>
    <div class="check-group">
      <b-form-checkbox
          :class="colorClass"
          v-model="isActive"
          name="check-button"
          switch
          :disabled="isDisabled"
          @change="onChangePluginCheckbox()"
      />
      <span class="check-text">{{ checkText }}</span>
    </div>
  </div>
  <p class="description">{{ pluginItem.description }}</p>
</div>
</template>

<script>

export default {
  name: "Plugin",
  props: {
    plugin: {
      type: Object,
      default: () => {},
    },
    tab: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      isActive: true,
      colorClass: 'active',
      checkText: 'Allowed',
      isDisabled: false,
    };
  },
  created() {
    this.defineActiveClass();
  },
  computed: {
    pluginItem() {
      return this.plugin?.plugin || null;
    },
  },
  methods: {
    defineActiveClass() {
      switch (this.plugin.isActive) {
        case 'active':
          this.isActive = true;
          this.colorClass = 'active';
          this.checkText = 'Allowed';
          this.isDisabled = false;
          break;

        case 'inactive':
          this.isActive = false;
          this.colorClass = 'inactive';
          this.checkText = 'Blocked';
          this.isDisabled = false;
          break;

        case 'disabled':
          this.isActive = true;
          this.colorClass = 'active';
          this.checkText = 'Allowed';
          this.isDisabled = true;
      }
    },
    onChangePluginCheckbox() {
      const plugin = this.plugin.plugin.title.replace(' ', '').toLowerCase();
      this.$emit('onChangePluginCheckbox', { tab: this.tab, plugin: plugin })
    }
  }
}
</script>

<style lang="scss" scoped>
.plugin {
  width: 30%;
  border: 2px solid $border-gray;
  border-radius: 8px;
  color: $text-gray;
  padding: 15px;
  margin: 13px;
  position: relative;
  &.disabled {
    border-color: lighten($border-gray, 5%);
    &::before {
      content: "";
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      border-radius: 8px;
      border: 2px solid $white;
      display: block;
      position: absolute;
      background-color: $white;
      opacity: 0.6;
      z-index: 10;
    }
  }
  .p-header {
    display: flex;
    justify-content: space-between;
    .p-title {
      color: $black;
    }
    .check-group {
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
        &.inactive {
          .custom-control-label::before {
            background-color: $red;
            border-color: $red;
          }
        }
      }
      .check-text {
        font-size: 9px;
        font-weight: 600;
        display: block;
      }
    }
  }
  .description {
    margin-top: 10px;
    font-size: 12px;
    text-align: left;
    line-height: 2;
    max-width: 80%;
  }
}
</style>
