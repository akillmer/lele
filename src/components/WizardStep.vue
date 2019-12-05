<template>
  <div :class="{ 'wizard-step': true, inactive: !isActive }">
    <img :class="{ overlay: !isActive }" src="@/assets/pixel.png" />
    <h2 v-if="title !== ''">{{ title }}</h2>
    <slot />
  </div>
</template>

<style lang="scss">
@import './vars.scss';

.wizard-step {
  position: relative;
  margin-bottom: 3em;

  &.inactive {
    opacity: 0.5;
  }

  img {
    display: none;
  }

  // extend the transparent image so nothing can be interacted with
  // particularly for protecting the recaptcha checkbox until steps are verified
  .overlay {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
  }

  h2 {
    color: #333;
    font-size: 1.8em;
  }

  button {
    margin-top: 1em;
    font-size: 1.2em;
    padding: 1em;
    border: solid 1px darken($leleColor, 20%);
    border-radius: 4px;
    background-color: #fafafa;
    cursor: pointer;

    &:active {
      opacity: 0.5;
    }
  }

  input[type='text'] {
    box-sizing: border-box;
    font-size: 1.2em;
    padding: 0.7em;
    border: solid 1px #ccc;
    border-radius: 4px;
    width: 100%;

    &::placeholder {
      color: #ccc;
    }
  }
}
</style>

<script>
export default {
  name: 'WizardStep',
  props: {
    title: String,
    isActive: {
      type: Boolean,
      required: true
    }
  }
}
</script>
