<template>
  <div v-if="isActive" class="surfing-loader">
    <img src="@/assets/wave-fg.svg" class="wave-fg" />
    <span>🏄</span>
  </div>
</template>

<style lang="scss">
.surfing-loader {
  position: relative;
  font-size: 2em;

  // the surfer emoji
  span {
    $left: 40px;
    $top: 60px;

    position: absolute;
    display: block;
    transform: scaleX(-1);
    font-size: 1.5em;
    left: $left;
    top: $top;

    animation: surfer 5s infinite;
    @keyframes surfer {
      0% {
        left: $left;
        top: $top;
      }
      30% {
        left: $left + 30;
        top: $top - 10;
      }
      50% {
        left: $left + 45;
        top: $top + 5;
      }
      70% {
        left: $left + 40;
        top: $top - 5;
      }
      100% {
        left: $left;
        top: $top;
      }
    }
  }

  .wave-fg {
    position: absolute;
    $left: 0px;
    $top: 50px;

    top: $top;
    left: $left;

    animation: wave-fg 2s infinite;
    @keyframes wave-fg {
      0% {
        left: $left;
        top: $top;
      }
      50% {
        left: $left + 10;
        top: $top - 10;
      }
    }
  }
}
</style>

<script>
export default {
  name: 'SurfingLoader',
  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  }
}
</script>
