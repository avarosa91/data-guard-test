<template>
  <div class="icon">
    <b-icon-grid3x3-gap-fill v-if="icon === 'icon-marketing'" />
    <b-icon-currency-exchange v-if="icon === 'icon-finance'" />
    <b-icon-clipboard-check v-if="icon === 'icon-people'" />
  </div>
</template>

<script>
import { BIconGrid3x3GapFill, BIconCurrencyExchange, BIconClipboardCheck } from 'bootstrap-vue';

export default {
  name: "Icon",
  components: {
    BIconGrid3x3GapFill,
    BIconClipboardCheck,
    BIconCurrencyExchange,
  },
  props: {
    icon: {
      type: String,
      default: 'icon-marketing'
    }
  }
}
</script>

<style scoped>

</style>
