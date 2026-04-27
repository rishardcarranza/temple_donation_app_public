<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row justify="center" align="center">
          <v-col cols="12" sm="10" md="8" lg="6" xl="4">
            <v-card class="pa-6" rounded="lg">
              <v-img
                src="/icons/icon-192.png"
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
:root {
  --color-primary: #0366F7;
  --color-primary-dark: #0250C5;
  --color-surface-soft: #E6F1FB;
  --color-success: #1D9E75;
  --color-error: #E24B4A;
  --color-background: #FFFFFF;
  --color-surface-alt: #F5F7FA;
  --color-text-primary: #1A1A2E;
  --color-text-secondary: #6B7280;
  --border-radius-sm: 8px;
  --border-radius-lg: 12px;
  --border-subtle: 0.5px;
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  overflow-y: auto !important;
}

body {
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  margin: 0;
}

.v-application {
  font-family: var(--font-family) !important;
  max-width: 480px;
  margin: 0 auto;
}

.v-card {
  border: var(--border-subtle) solid #E5E7EB !important;
  border-radius: var(--border-radius-lg) !important;
}

.v-btn {
  min-height: 48px !important;
  text-transform: none !important;
  font-weight: 500 !important;
  letter-spacing: 0 !important;
}

.v-text-field .v-field {
  border-radius: var(--border-radius-sm) !important;
}

.text-muted {
  color: var(--color-text-secondary) !important;
}
</style>