# Firebase Setup Guide

Esta guía te ayudará a configurar Firebase Authentication y Firestore para tellingQuote.

## Paso 1: Crear un Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto"
3. Nombre del proyecto: `telling-quote` (o el que prefieras)
4. Desactiva Google Analytics (opcional para este proyecto)
5. Click en "Crear proyecto"

## Paso 2: Registrar tu Aplicación Web

1. En el dashboard del proyecto, click en el ícono web `</>`
2. Nombre de la app: `tellingQuote`
3. **No** marques "Configure Firebase Hosting"
4. Click en "Registrar app"
5. Copia el objeto `firebaseConfig` que aparece

## Paso 3: Configurar Variables de Entorno

1. En la raíz del proyecto, copia el archivo de ejemplo:
   ```bash
   cp .env.local.example .env.local
   ```

2. Abre `.env.local` y pega los valores de tu `firebaseConfig`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

## Paso 4: Habilitar Authentication

1. En Firebase Console, ve a **Authentication** en el menú lateral
2. Click en **Get Started**
3. En la pestaña **Sign-in method**, click en **Google**
4. Activa el toggle **Enable**
5. Ingresa un **Project support email** (tu correo)
6. Click en **Save**

## Paso 5: Crear Base de Datos Firestore

1. En Firebase Console, ve a **Firestore Database**
2. Click en **Create database**
3. Selecciona **Start in production mode** (usaremos reglas de seguridad custom)
4. Elige una ubicación cercana a tus usuarios:
   - `us-central1` (Iowa, USA)
   - `southamerica-east1` (São Paulo, Brazil)
   - Otra que prefieras
5. Click en **Enable**

## Paso 6: Configurar Reglas de Seguridad

1. En Firestore Database, ve a la pestaña **Rules**
2. Reemplaza el contenido con las reglas del archivo `firestore.rules`:
   ```bash
   # Copia el contenido de firestore.rules
   ```
3. Click en **Publish**

### Resumen de las Reglas:
- ✅ Los usuarios solo pueden leer/escribir sus propios datos
- ✅ Validación de estructura de datos (readings, settings)
- ✅ Requiere autenticación para todas las operaciones
- ❌ Denegar acceso público a todos los documentos

## Paso 7: Configurar Índices (Opcional pero Recomendado)

Las queries complejas pueden requerir índices. Firebase te mostrará el link para crearlos si son necesarios.

Para crear índices manualmente:
1. Ve a **Firestore Database** > **Indexes**
2. Click en **Create Index**
3. Colección: `users/{uid}/readings`
4. Campos a indexar:
   - `createdAt` (Descending)
   - `updatedAt` (Descending)
5. Click en **Create**

## Paso 8: Verificar Instalación

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre http://localhost:3000
3. Click en **Iniciar Sesión**
4. Si todo está correcto, deberías ver el popup de Google OAuth

## Estructura de Datos en Firestore

```
users/
  {uid}/
    profile/
      info/
        - email: string
        - displayName: string
        - photoURL: string
        - createdAt: Timestamp
        - lastSeen: Timestamp
    
    readings/
      {readingId}/
        - id: string
        - title: string
        - content: string
        - tags: string[]
        - createdAt: string (ISO)
        - updatedAt: Timestamp
        - isCompleted: boolean
    
    settings/
      preferences/
        - fontFamily: string
        - fontSize: string
        - theme: string
        - updatedAt: Timestamp
      
      accessibility/
        - [accessibility settings]
        - updatedAt: Timestamp
```

## Límites del Plan Gratuito (Spark)

Firebase ofrece un plan gratuito generoso que debería ser suficiente para desarrollo y usuarios iniciales:

### Firestore:
- **Almacenamiento**: 1 GB
- **Lecturas**: 50,000 / día
- **Escrituras**: 20,000 / día
- **Eliminaciones**: 20,000 / día

### Authentication:
- **Usuarios**: Ilimitados
- **Autenticaciones**: Ilimitadas

### Estimación de Uso:
- **1000 usuarios activos**
- **10 lecturas por usuario** = 10,000 readings
- **5 sincronizaciones/día** = 50,000 lecturas/día
- **2 creaciones/día** = 2,000 escrituras/día
- ✅ **Dentro del límite gratuito**

## Monitoreo de Uso

1. Ve a **Usage and Billing** en Firebase Console
2. Revisa:
   - **Firestore Usage**: lecturas/escrituras/almacenamiento
   - **Authentication Usage**: sign-ins

## Solución de Problemas

### Error: "Firebase not configured"
- Verifica que `.env.local` existe y tiene los valores correctos
- Reinicia el servidor de desarrollo

### Error: "Permission denied" en Firestore
- Verifica que las reglas de seguridad estén publicadas
- Asegúrate de estar autenticado
- Revisa la consola de Firebase para ver los errores de reglas

### Error: "Auth domain is not authorized"
- Ve a Authentication > Settings > Authorized domains
- Agrega `localhost` si no está presente

### Popup de Google no aparece
- Verifica que Google Sign-In esté habilitado en Authentication
- Revisa la consola del navegador para errores
- Asegúrate de que no haya bloqueadores de popups activos

## Próximos Pasos

Una vez configurado Firebase:

1. ✅ Prueba el sign-in con Google
2. ✅ Crea una lectura y verifica que se sincronice
3. ✅ Abre la app en otro navegador/dispositivo y verifica la sincronización
4. ✅ Prueba el modo offline (desconecta WiFi)
5. ✅ Exporta tus datos

## Recursos Adicionales

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth/web/google-signin)
