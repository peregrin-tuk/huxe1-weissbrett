<template>
  <IconButton
    :icon="icon"
    :selected="selected"
    @click-event="$store.commit('setActiveTool', tool)"
  />
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "./IconButton.vue"

export default Vue.extend({
  name: "ToolButton",
  components: {
    IconButton
  },
  props: {
    tool: String,
    icon: {
      type: String,
      required: true
    }
  },
  computed: {
    selected(): boolean {
      return this.$store.state.activeTool === this.tool
    }
  }
});
</script>

<style lang="scss" scoped>
</style>
