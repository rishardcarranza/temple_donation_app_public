import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

export const getPublicInfo = () => api.get('/public/info')

export const submitDonation = (data) => api.post('/public/donate', {
  name: data.name,
  amount: data.amount,
  leader_source: data.leader_source
})

export const getDonationReceipt = (id) => api.get(`/public/donate/${id}`)