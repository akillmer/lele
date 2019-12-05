<template>
  <div v-if="hasError" :class="{ 'error-message': true, fatal: isFatal }">
    <font-awesome-icon
      v-if="isFatal"
      class="icon"
      :icon="['fas', 'exclamation']"
    ></font-awesome-icon>
    <slot v-if="hasError" />
  </div>
</template>

<style lang="scss">
@import './vars.scss';

.error-message {
  position: absolute;
  margin-top: 0.5em;
  color: darken($leleColor, 40%);

  pre {
    color: #777;
    margin-bottom: 0;
  }

  &.fatal {
    color: red;
    border: solid 1px darken(red, 10%);
    padding: 0.5em;
    background-color: #fafafa;
    border-radius: 4px;

    .icon {
      margin: 0 0.5em 0 0.25em;
    }
  }
}
</style>
<script>
export default {
  name: 'ErrorMessage',
  props: {
    isFatal: Boolean,
    hasError: {
      type: Boolean,
      required: true
    }
  }
}
</script>
