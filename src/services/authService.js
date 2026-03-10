import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Usuarios admin predefinidos
const ADMIN_EMAILS = ['admin@mitienda.com'];

// Rate limiting (5 intentos cada 15 minutos)
const intentosFallidos = new Map();

// Verificar si un usuario es admin
export const isAdmin = (user) => {
  return user && ADMIN_EMAILS.includes(user.email);
};

// Verificar rate limit
const checkRateLimit = (email) => {
  const ahora = Date.now();
  const intentos = intentosFallidos.get(email) || [];
  
  // Limpiar intentos viejos (> 15 minutos)
  const intentosRecientes = intentos.filter(t => ahora - t < 15 * 60 * 1000);
  
  if (intentosRecientes.length >= 5) {
    return false; // Demasiados intentos
  }
  
  intentosRecientes.push(ahora);
  intentosFallidos.set(email, intentosRecientes);
  return true;
};

// Iniciar sesión
export const login = async (email, password) => {
  try {
    // Verificar rate limit
    if (!checkRateLimit(email)) {
      return { 
        success: false, 
        error: 'Demasiados intentos fallidos. Esperá 15 minutos.' 
      };
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Limpiar intentos fallidos si el login es exitoso
    intentosFallidos.delete(email);
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    let mensaje = 'Error al iniciar sesión';
    switch (error.code) {
      case 'auth/user-not-found':
        mensaje = 'Usuario no encontrado';
        break;
      case 'auth/wrong-password':
        mensaje = 'Contraseña incorrecta';
        break;
      case 'auth/invalid-email':
        mensaje = 'Email inválido';
        break;
      case 'auth/too-many-requests':
        mensaje = 'Demasiados intentos. Intentá más tarde';
        break;
      default:
        mensaje = error.message;
    }
    return { success: false, error: mensaje };
  }
};

// Registrar usuario
export const register = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let mensaje = 'Error al registrar';
    switch (error.code) {
      case 'auth/email-already-in-use':
        mensaje = 'Este email ya está registrado';
        break;
      case 'auth/invalid-email':
        mensaje = 'Email inválido';
        break;
      case 'auth/weak-password':
        mensaje = 'La contraseña debe tener al menos 6 caracteres';
        break;
      default:
        mensaje = error.message;
    }
    return { success: false, error: mensaje };
  }
};

// Cerrar sesión
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtener rol del usuario
export const getUserRole = (user) => {
  if (!user) return 'guest';
  if (isAdmin(user)) return 'admin';
  return 'user';
};