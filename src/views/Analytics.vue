<template>
  <div>Analytics {{ urlKey }}</div>
</template>

<script>
export default {
  name: 'Analytics',
  props: {
    urlKey: String
  },
  data() {
    return {
      isActive: false
    }
  }
}
</script>
