<template>
  <div class="text-center">
    <v-icon size="80" style="color: #1D9E75" class="mb-4">
      mdi-check-circle
    </v-icon>

    <h2 class="text-h5 mb-2">
      ¡Gracias, {{ donation.name }}!
    </h2>

    <p class="text-body-1 mb-4">
      Tu aportación de <strong>${{ donation.amount }}</strong>
      fue registrada.
    </p>

    <v-card variant="tonal" class="mb-4 text-left pa-4" style="border: 0.5px solid #E5E7EB; border-radius: 12px; background-color: #F5F7FA;">
      <div class="d-flex justify-space-between mb-2">
        <span class="text-body-2" style="color: #6B7280">Código:</span>
        <span class="text-body-2 font-weight-medium">{{ donation.code }}</span>
      </div>
      <div class="d-flex justify-space-between mb-2">
        <span class="text-body-2" style="color: #6B7280">Periodo:</span>
        <span class="text-body-2 font-weight-medium">{{ donation.month }}</span>
      </div>
      <div class="d-flex justify-space-between mb-2">
        <span class="text-body-2" style="color: #6B7280">Fecha:</span>
        <span class="text-body-2 font-weight-medium">{{ donation.donationDate }}</span>
      </div>
      <div class="d-flex justify-space-between">
        <span class="text-body-2" style="color: #6B7280">Hora:</span>
        <span class="text-body-2 font-weight-medium">{{ donation.donationTime }}</span>
      </div>
    </v-card>

    <p class="text-body-2 mb-4" style="color: #6B7280">
      Notifica tu donación por WhatsApp al líder.
    </p>

    <v-btn
      v-if="donation.whatsappPhone"
      style="background-color: #1D9E75; color: white"
      size="large"
      block
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
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