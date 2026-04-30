<template>
  <v-form ref="form" @submit.prevent="submit">
    <v-text-field
      v-model="formData.name"
      label="Tu nombre completo"
      variant="outlined"
      :rules="[rules.required, rules.minLength]"
      :error-messages="errors.name"
      @input="errors.name = ''"
      class="mb-2"
    />

    <v-text-field
      v-model.number="formData.amount"
      label="Monto ($)"
      type="number"
      variant="outlined"
      :prefix="'$'"
      :hint="defaultAmountHint"
      :rules="[rules.positive]"
      :error-messages="errors.amount"
      @input="errors.amount = ''"
      class="mb-2"
    />

    <div class="leader-selection mb-4">
      <div class="text-body-2 text-medium-emphasis mb-2">Notificar a:</div>
      <v-btn-toggle
        v-model="selectedLeader"
        mandatory
        divided
        variant="outlined"
        color="primary"
        class="w-100"
      >
        <v-btn
          v-for="option in leaderOptions"
          :key="option.value"
          :value="option.value"
          size="small"
          class="flex-grow-1"
        >
          {{ option.label }}
        </v-btn>
      </v-btn-toggle>
    </div>

    <v-text-field
      :model-value="publicInfo.month_display"
      label="Periodo"
      variant="outlined"
      readonly
      class="mb-4"
      bg-color="surface-soft"
    />

    <v-alert
      v-if="alertMessage"
      type="info"
      variant="tonal"
      class="mb-4"
    >
      {{ alertMessage }}
    </v-alert>

    <v-btn
      type="submit"
      color="primary"
      size="large"
      block
      :loading="loading"
      :disabled="loading"
    >
      Registrar aportación
    </v-btn>
  </v-form>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { getPublicInfo, submitDonation, getDonationReceipt } from '../api/donations'

const emit = defineEmits(['success', 'error', 'info-loaded'])

const form = ref(null)
const loading = ref(false)
const publicInfo = ref({
  current_month: '',
  month_display: '',
  donation_goal: 0,
  default_amount: 2,
  whatsapp_phone: '',
  leader_options: [],
  default_leader: 'socsoc'
})

const selectedLeader = ref('socsoc')

const leaderOptions = computed(() => {
  return publicInfo.value.leader_options || []
})

const selectedLeaderPhone = computed(() => {
  const leader = leaderOptions.value.find(l => l.value === selectedLeader.value)
  return leader?.whatsapp_phone || publicInfo.value.whatsapp_phone
})

const formData = reactive({
  name: '',
  amount: null
})

const errors = reactive({
  name: '',
  amount: ''
})

const alertMessage = ref('')

const rules = {
  required: (v) => !!v || 'Campo requerido',
  minLength: (v) => (v && v.length >= 3) || 'Mínimo 3 caracteres',
  positive: (v) => (!v || v > 0) || 'Debe ser mayor a 0'
}

const defaultAmountHint = computed(() => {
  return publicInfo.value.default_amount 
    ? `Monto sugerido: $${publicInfo.value.default_amount}`
    : ''
})

onMounted(async () => {
  try {
    const { data } = await getPublicInfo()
    publicInfo.value = data

    if (data.default_amount) {
      formData.amount = data.default_amount
    }

    selectedLeader.value = data.default_leader || 'socsoc'

    emit('info-loaded', {
      wardName: data.ward_name || ''
    })
  } catch (error) {
    console.error('Error fetching public info:', error)
  }
})

const submit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  errors.name = ''
  errors.amount = ''
  alertMessage.value = ''

  try {
    const amountToSend = formData.amount || publicInfo.value.default_amount

    const { data } = await submitDonation({
      name: formData.name,
      amount: amountToSend,
      leader_source: selectedLeader.value
    })

    if (data.alert) {
      alertMessage.value = data.alert
    }

    const receiptResponse = await getDonationReceipt(data.donation_id)
    const receiptData = receiptResponse.data

    emit('success', {
      name: receiptData.member_name,
      amount: receiptData.amount,
      month: receiptData.month_display,
      donationDate: receiptData.donation_date,
      donationTime: receiptData.donation_time,
      code: receiptData.member_code,
      whatsappPhone: selectedLeaderPhone.value
    })
  } catch (error) {
    const message = error.response?.data?.detail || 'Error al registrar la donación. Intenta de nuevo.'
    emit('error', message)
  } finally {
    loading.value = false
  }
}
</script>