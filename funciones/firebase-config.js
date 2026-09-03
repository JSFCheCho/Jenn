/* ============================================================
   Configuración de Firebase
   Sácala de: Firebase Console -> ⚙️ Project Settings -> General
   -> "Your apps" -> (si no tienes una app web, créala con el ícono </>)
   ============================================================

   Estas llaves son PÚBLICAS (van en el código del navegador,
   cualquiera puede verlas con F12). Eso es normal y esperado
   en Firebase: lo que de verdad protege tus datos son las
   "Rules" de Firestore/Storage, no que esta llave esté oculta.
*/

const firebaseConfig = {
    apiKey: "AIzaSyBLQpoNw9YJEK8VvOex3X2qDwZBaTZRwnU",
    authDomain: "paginaweb-f1873.firebaseapp.com",
    projectId: "paginaweb-f1873",
    storageBucket: "paginaweb-f1873.firebasestorage.app",
    messagingSenderId: "1082697198683",
    appId: "1:1082697198683:web:6404329ccd13817ee3637e",
};

// Inicializa Firebase una sola vez; login.js y el futuro panel.js
// reutilizan esta misma inicialización.
firebase.initializeApp(firebaseConfig);
