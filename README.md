# Templo App Public

Formulario público PWA (Progressive Web App) para que los miembros de la iglesia registren su aportación mensual al fondo del viaje al templo.

---

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

```bash
npm install
```

## Configuración

Crear archivo `.env` basado en `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8001/api/v1
```

## Desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`

## Producción

```bash
npm run build
npm run preview
```

La app de producción se genera en `/dist`.

## Estructura del Proyecto

```
src/
├── main.js              # Entrada Vue + Vuetify
├── App.vue              # Root component
├── api/
│   └── donations.js     # Llamadas al backend
└── components/
    ├── DonationForm.vue   # Formulario de donación
    ├── SuccessMessage.vue # Pantalla de éxito
    └── ErrorMessage.vue   # Mensaje de error
```

## Características

- PWA instalable en Android y iOS
- Sin autenticación, acceso mediante código QR
- Registro de aportaciones en dólares ($)
- Validación inline de campos
- Notificación por WhatsApp al líder
- Diseño mobile-first (max 480px)
- Sin router, sin store (estado local)

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/public/info` | Info del periodo activo |
| POST | `/public/donate` | Registrar donación |
| GET | `/public/donate/{id}` | Obtener comprobante |

Ver `AGENTS.md` para más detalles.