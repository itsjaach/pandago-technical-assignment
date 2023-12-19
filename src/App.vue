<template>
  <RouterView />
</template>

<script>
import { RouterView } from 'vue-router'
import { defineComponent } from 'vue'
export default defineComponent({
  components: {
    RouterView
  }
})
</script>
