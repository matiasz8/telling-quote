# Firebase Setup - Pasos en Firebase Console

Este documento describe los pasos que debes completar en Firebase Console para finalizar la configuración.

## ✅ Completado (Código)

- [x] `.env.local` creado con credenciales
- [x] Firebase SDK instalado
- [x] Archivos de configuración creados:
  - `lib/firebase/config.ts` - Inicialización
  - `lib/firebase/auth.ts` - Autenticación
  - `lib/firebase/firestore.ts` - Base de datos
  - `lib/firebase/index.ts` - Exports

---

## 🔧 Pasos en Firebase Console

### 1. Habilitar Authentication

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **telling-quote**
3. En el menú lateral, ve a **Build > Authentication**
4. Click en **"Comenzar"** (Get started)
5. En la pestaña **"Sign-in method"**:
   - Click en **"Email/Password"**
   - **Activa** el toggle para "Email/Password"
   - (Opcional) Activa "Email link (passwordless sign-in)"
   - Click **"Guardar"**

**Resultado esperado:** Deberías ver "Email/Password" como "Enabled" en la lista.

---

### 2. Crear Firestore Database

1. En el menú lateral, ve a **Build > Firestore Database**
2. Click en **"Crear base de datos"** (Create database)
3. Selecciona el modo:
   - **⚠️ Producción** (Recommended) - Requiere reglas de seguridad
   - ~~Prueba~~ - Evitar en producción
4. Elige la ubicación:
   - Recomendado: **us-central** (o la más cercana a tus usuarios)
   - ⚠️ **No podrás cambiar esto después**
5. Click **"Habilitar"** (Enable)

**Resultado esperado:** Deberías ver la interfaz de Firestore con "Comenzar colección".

---

### 3. Configurar Security Rules

1. En Firestore Database, ve a la pestaña **"Reglas"** (Rules)
2. **Reemplaza** el contenido con estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function: Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function: Check if user owns the resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users can only access their own data
    match /users/{userId} {
      // User profile
      allow read, write: if isOwner(userId);
      
      // User's readings
      match /readings/{readingId} {
        allow read, write: if isOwner(userId);
        
        // Validate reading data structure
        allow create: if isOwner(userId)
          && request.resource.data.keys().hasAll(['title', 'content'])
          && request.resource.data.title is string
          && request.resource.data.content is string
          && (!request.resource.data.keys().hasAny(['tags']) || request.resource.data.tags is list);
        
        allow update: if isOwner(userId)
          && request.resource.data.title is string
          && request.resource.data.content is string
          && (!request.resource.data.keys().hasAny(['tags']) || request.resource.data.tags is list);
      }
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publicar"** (Publish)

**Resultado esperado:** Las reglas se actualizan y muestran "Publicado" con timestamp.

---

### 4. Índices de Firestore (Opcional pero Recomendado)

Firestore creará índices automáticamente cuando los necesite, pero puedes crearlos manualmente:

1. Ve a la pestaña **"Índices"** (Indexes)
2. Click **"Crear índice"** si ves algún error en los logs
3. Para consultas por tags + fecha:
   - Collection: `users/{userId}/readings`
   - Fields:
     - `tags` (Array)
     - `createdAt` (Descending)

---

## 🧪 Verificar Configuración

### Test en Consola

1. Ve a **Build > Firestore Database**
2. Click **"Comenzar colección"**
3. ID de colección: `users`
4. ID de documento: `test-user-id`
5. Agrega un campo:
   - Campo: `email`
   - Tipo: `string`
   - Valor: `test@example.com`
6. Click **"Guardar"**

Si ves el documento creado, ¡Firestore está funcionando! ✅

**⚠️ ELIMINA** este documento de prueba después.

---

### Test en Código (Opcional)

Puedes probar la configuración ejecutando:

```bash
npm run dev
```

Y en la consola del navegador:

```javascript
import { auth } from '@/lib/firebase';
console.log('Firebase initialized:', auth.app.name); // Should log: "[DEFAULT]"
```

---

## 📊 Checklist Final

- [ ] Authentication habilitado (Email/Password)
- [ ] Firestore Database creado (región: ____________)
- [ ] Security Rules configuradas y publicadas
- [ ] (Opcional) Índices creados
- [ ] (Opcional) Test de documento realizado

---

## 🔐 Notas de Seguridad

1. **`.env.local` NUNCA debe subirse a Git** (ya está en `.gitignore`)
2. Las **Security Rules** protegen tus datos - nunca uses `allow read, write: if true;` en producción
3. Cada usuario solo puede ver/modificar **sus propios datos**
4. Las reglas validan la **estructura** de los documentos

---

## 📚 Próximos Pasos

Una vez completados estos pasos, puedes continuar con:

- **TRD-002**: Sistema de Tags
- **TRD-005**: Implementar UI de Authentication
- Migrar de localStorage a Firestore

---

## 🆘 Problemas Comunes

### Error: "Missing or insufficient permissions"
- **Causa**: Security Rules bloquean el acceso
- **Solución**: Verifica que el usuario esté autenticado y que las reglas permitan la operación

### Error: "Firebase: Error (auth/operation-not-allowed)"
- **Causa**: Email/Password no está habilitado
- **Solución**: Ve a Authentication > Sign-in method y habilita Email/Password

### Firestore writes not working
- **Causa**: Índice faltante
- **Solución**: Ve a Firestore > Índices y crea los índices sugeridos

---

**Fecha creación:** $(date)
**Proyecto:** telling-quote
**Firebase Project ID:** telling-quote
