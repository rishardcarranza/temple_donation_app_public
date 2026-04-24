<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row justify="center" align="center">
          <v-col cols="12" sm="10" md="8" lg="6" xl="4">
            <v-card class="pa-6" elevation="2" rounded="lg">
              <v-img
                src="/favicon.ico"
                height="60"
                width="60"
                class="mx-auto mb-4"
                contain
              />

              <h1 class="text-h5 text-center mb-6 text-primary">
                Aportaciones Templo
              </h1>

              <DonationForm
                v-if="view === 'form'"
                @success="handleSuccess"
                @error="handleError"
              />

              <SuccessMessage
                v-else-if="view === 'success'"
                :donation="donationData"
                @new-donation="resetForm"
              />

              <ErrorMessage
                v-else-if="view === 'error'"
                :message="errorMessage"
                @retry="resetForm"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import DonationForm from './components/DonationForm.vue'
import SuccessMessage from './components/SuccessMessage.vue'
import ErrorMessage from './components/ErrorMessage.vue'

const view = ref('form')
const donationData = ref(null)
const errorMessage = ref('')

const handleSuccess = (data) => {
  donationData.value = data
  view.value = 'success'
}

const handleError = (message) => {
  errorMessage.value = message
  view.value = 'error'
}

const resetForm = () => {
  view.value = 'form'
  donationData.value = null
  errorMessage.value = ''
}
</script>

<style>
html {
  overflow-y: auto !important;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.v-application {
  max-width: 480px;
  margin: 0 auto;
}
</style>