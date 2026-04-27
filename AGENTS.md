# 🕊️ AGENTS.md — App Pública: Aportaciones Templo

## Descripción
Formulario público PWA (Progressive Web App) para que los miembros de la iglesia registren su aportación mensual al fondo del viaje al templo. Acceso mediante código QR impreso. Sin login, sin registro de cuenta.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Vue 3 (Composition API) |
| Build tool | Vite |
| PWA | vite-plugin-pwa |
| Estilos | Vuetify 3 (Mobile First) |
| HTTP client | Axios |
| Lenguaje | JavaScript (sin TypeScript) |

---

## Estructura de Carpetas

```
templo-app-public/
├── public/
│   └── icons/                  # Íconos PWA (192x192, 512x512)
├── src/
│   ├── main.js                 # Entrada, registra Vue + Vuetify
│   ├── App.vue                 # Root component
│   ├── api/
│   │   └── donations.js        # Llamadas al backend (axios)
│   └── components/
│       ├── DonationForm.vue     # Formulario principal
│       ├── SuccessMessage.vue    # Pantalla de éxito post-envío
│       └── ErrorMessage.vue     # Mensaje de error genérico
├── .env
├── .env.example
├── index.html
├── vite.config.js
└── package.json
```

---

## Variables de Entorno

### `.env.example`
```env
VITE_API_BASE_URL=https://api.tu-dominio.com/api/v1
VITE_APP_TITLE=Aportaciones Templo
```

> Todas las variables deben comenzar con `VITE_` para que Vite las exponga al cliente.

---

## Configuración Vite + PWA

### `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Aportaciones Templo',
        short_name: 'Aportaciones',
        description: 'Registra tu aportación mensual al fondo del templo',
        theme_color: '#0366F7',
        background_color: '#FFFFFF',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ]
})
```

---

## Pantallas de la App

### Única pantalla: Formulario de donación
La app tiene una sola vista. Sin navegación, sin router.

```
┌─────────────────────────────┐
│  🕊️  Aportaciones Templo    │
│  ─────────────────────────  │
│                             │
│  Tu nombre completo         │
│  [ _____________________ ]  │
│                             │
│  Monto ($)                  │
│  [ _____________________ ]  │
│                             │
│  Periodo                    │
│  [ Mayo 2025             ]  │  ← Solo lectura, lo configura el admin
│                             │
│  [ 💚  Registrar aportación ] │
│                             │
└─────────────────────────────┘
```

Después del envío exitoso, reemplazar el formulario con:

```
┌─────────────────────────────┐
│                             │
│         ✅                  │
│                             │
│   ¡Gracias, [nombre]!       │
│   Tu aportaciones de $[monto] │
│   fue registrada.           │
│                             │
│   Notifica tu donación        │
│   por WhatsApp.             │
│                             │
│  [ Registrar otra aportación] │
│                             │
└─────────────────────────────┘
```

---

## Flujo de la App

```
Abrir QR
   │
   ▼
Cargar formulario
   │
   ├─► GET /api/v1/public/info   ← Periodo activo, nombre del viaje, whatsapp del líder
   │         │
   │         ▼
   │   Mostrar periodo en campo de solo lectura
   │
   ▼
Usuario llena: nombre + monto
   │
   ▼
Tap en "Registrar aportación"
   │
   ├─► Validar campos (no vacíos, monto > 0)
   │
   ▼
POST /api/v1/public/donate
   │
   ├── Éxito → Recibe { id } de la donación creada
   │               │
   │               ▼
   │         GET /api/v1/public/donate/{id}   ← Obtener comprobante
   │               │
   │               ▼
   │         Mostrar SuccessMessage con datos del comprobante + link WhatsApp
   │
   └── Error → Mostrar ErrorMessage (no borrar el formulario)
```

---

## Confirmación por WhatsApp

Al recibir respuesta exitosa del backend, abrir WhatsApp con mensaje pre-armado usando la API de WhatsApp Web:

```javascript
// En SuccessMessage.vue
const openWhatsApp = (nombre, monto, periodo, phoneAdmin) => {
  const mensaje = `Hola, registré mi aportaciones:\n\nNombre: ${nombre}\nMonto: $${monto}\nPeriodo: ${periodo}\n\nGracias!`
  const url = `https://wa.me/${phoneAdmin}?text=${encodeURIComponent(mensaje)}`
  window.open(url, '_blank')
}
```

> El número de WhatsApp del líder debe venir desde el backend en la respuesta, o desde una variable de entorno `VITE_WHATSAPP_NUMBER`.

---

## Llamadas al Backend (`src/api/donations.js`)

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

// Obtener info pública: periodo activo, nombre del viaje, whatsapp del líder
export const getPublicInfo = () => api.get('/public/info')

// Registrar donación pública → responde con { donation_id, code, name, amount, month, ... }
export const submitDonation = (data) => api.post('/public/donate', {
  name: data.name,
  amount: data.amount
})

// Obtener comprobante de la donación recién enviada
export const getDonationReceipt = (id) => api.get(`/public/donate/${id}`)
```

### Respuesta esperada de cada endpoint

**`GET /api/v1/public/info`**
```json
{
  "current_month": "2026-04",
  "month_display": "abril-2026",
  "donation_goal": 150,
  "default_amount": 2,
  "whatsapp_phone": "+50399999999"
}
```

**`POST /api/v1/public/donate`**
```json
{
  "donation_id": 1,
  "message": "Donacion registrada exitosamente",
  "code": "ML001",
  "name": "María López",
  "amount": 2,
  "month": "2026-04",
  "month_display": "abril-2026",
  "status": "pending"
}
```

**`GET /api/v1/public/donate/{id}`**
```json
{
  "member_name": "María López",
  "member_code": "ML001",
  "amount": 2,
  "month": "2026-04",
  "month_display": "abril-2026",
  "donation_date": "24/04/2026",
  "donation_time": "10:30:00",
  "status": "pending"
}
```

---

## Validaciones del Formulario

| Campo | Regla |
|-------|-------|
| Nombre | Requerido, mínimo 3 caracteres |
| Monto | Requerido, número positivo, mayor a 0 |
| Periodo | Solo lectura, viene del backend |

Mostrar errores de validación **inline** debajo de cada campo, no como alertas.

---

## Reglas de Diseño (Mobile First)

### Paleta de Colores
| Color | Hex |
|-------|-----|
| Primary | `#0366F7` |
| Primary hover | `#0250C5` |
| Surface suave | `#E6F1FB` |
| Surface alternativo | `#F5F7FA` |
| Éxito | `#1D9E75` |
| Error / validación | `#E24B4A` |
| Background | `#FFFFFF` |
| Texto principal | `#1A1A2E` |
| Texto secundario | `#6B7280` |

### Directrices
- Diseño centrado, máximo 480px de ancho en desktop
- Fuente mínima 16px para evitar zoom automático en iOS
- Botón de envío: ancho completo, altura mínima 48px, fácil de tocar
- Sin gradientes
- Sin sombras decorativas
- Bordes sutiles: 0.5px
- border-radius: 8px (elementos), 12px (tarjetas)
- Sin menú de navegación, sin header complejo, solo logo + formulario
- El campo de periodo debe verse claramente como **no editable** (color gris suave)

---

## Checklist de Desarrollo

- [x] Inicializar proyecto: `npm create vite@latest`
- [x] Instalar dependencias: `vuetify`, `vite-plugin-pwa`, `axios`
- [x] Configurar `vite.config.js` con plugin PWA
- [x] Crear `DonationForm.vue` con los 3 campos
- [x] Conectar `getPublicInfo()` al montar el componente
- [x] Mostrar periodo como campo de solo lectura con dato de `/public/info`
- [x] Implementar `submitDonation()` al hacer submit → obtener `id` de la respuesta
- [x] Llamar `getDonationReceipt(id)` tras envío exitoso para obtener comprobante
- [x] Crear `SuccessMessage.vue` mostrando datos del comprobante + botón WhatsApp
- [x] Crear `ErrorMessage.vue` para errores de red
- [x] Validaciones inline en el formulario
- [x] Probar en móvil real (no solo DevTools)
- [x] Generar íconos PWA y colocar en `/public/icons/`
- [x] Verificar que "Agregar a pantalla de inicio" funcione en Android y iOS
- [x] Configurar `.env` con URL del backend real

---

## Reglas Importantes

1. **Sin router** — La app es una sola pantalla. No usar Vue Router.
2. **Sin Pinia/Vuex** — El estado es simple, manejar con `ref` y `reactive` localmente.
3. **El periodo nunca lo edita el usuario** — Siempre viene del backend, campo de solo lectura.
4. **No guardar datos en localStorage** — Cada vez que se abre la app, fresh start.
5. **WhatsApp es opcional para el usuario** — El botón abre WhatsApp pero no es obligatorio tocarlo.
6. **Errores de red deben ser amigables** — Nunca mostrar mensajes técnicos al usuario.
