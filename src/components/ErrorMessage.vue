<template>
  <div class="text-center">
    <v-icon size="80" style="color: #E24B4A" class="mb-4">
      mdi-alert-circle
    </v-icon>

    <h2 class="text-h5 mb-2">
      Algo salió mal
    </h2>

    <v-alert
      type="error"
      variant="tonal"
      class="mb-4 text-left"
      style="background-color: #FEF2F2; border: 0.5px solid #E24B4A; border-radius: 8px;"
    >
      {{ message }}
    </v-alert>

    <v-btn
      color="primary"
      size="large"
      block
      @click="$emit('retry')"
    >
      Intentar de nuevo
    </v-btn>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  }
})

defineEmits(['retry'])
</script>