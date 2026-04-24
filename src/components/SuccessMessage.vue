<template>
  <div class="text-center">
    <v-icon size="80" color="success" class="mb-4">
      mdi-check-circle
    </v-icon>

    <h2 class="text-h5 mb-2">
      ¡Gracias, {{ donation.name }}!
    </h2>

    <p class="text-body-1 mb-4">
      Tu aportación de <strong>${{ donation.amount }}</strong>
      fue registrada.
    </p>

    <v-card variant="tonal" class="mb-4 text-left pa-4">
      <div class="d-flex justify-space-between mb-2">
        <span class="text-body-2 text-grey">Código:</span>
        <span class="text-body-2 font-weight-medium">{{ donation.code }}</span>
      </div>
      <div class="d-flex justify-space-between mb-2">
        <span class="text-body-2 text-grey">Periodo:</span>
        <span class="text-body-2 font-weight-medium">{{ donation.month }}</span>
      </div>
      <div class="d-flex justify-space-between mb-2">
        <span class="text-body-2 text-grey">Fecha:</span>
        <span class="text-body-2 font-weight-medium">{{ donation.donationDate }}</span>
      </div>
      <div class="d-flex justify-space-between">
        <span class="text-body-2 text-grey">Hora:</span>
        <span class="text-body-2 font-weight-medium">{{ donation.donationTime }}</span>
      </div>
    </v-card>

    <p class="text-body-2 text-grey mb-4">
      Notifica tu donación por WhatsApp al líder.
    </p>

    <v-btn
      v-if="donation.whatsappPhone"
      color="success"
      size="large"
      block
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      min-height="52"
      class="mb-4"
    >
      <v-icon start>mdi-whatsapp</v-icon>
      Notificar por WhatsApp
    </v-btn>

    <v-btn
      variant="outlined"
      color="primary"
      size="large"
      block
      min-height="52"
      @click="$emit('new-donation')"
    >
      Registrar otra aportación
    </v-btn>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  donation: {
    type: Object,
    required: true
  }
})

defineEmits(['new-donation'])

const whatsappUrl = computed(() => {
  if (!props.donation.whatsappPhone) return ''
  
  const phone = props.donation.whatsappPhone.replace(/\D/g, '')
  const mensaje = `Hola, registré mi aportación:\n\nNombre: ${props.donation.name}\nMonto: $${props.donation.amount}\nPeriodo: ${props.donation.month}\n\nGracias!`
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`
})
</script>