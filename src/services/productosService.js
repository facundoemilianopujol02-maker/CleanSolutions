import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  where,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Referencia a la colección de productos
const productosCollection = collection(db, 'productos');

// ============================================
// FUNCIONES CRUD PARA PRODUCTOS
// ============================================

// Obtener todos los productos
export const getProductos = async () => {
  try {
    const snapshot = await getDocs(productosCollection);
    const productos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('Productos cargados desde Firestore:', productos.length);
    return productos;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};

// Agregar un nuevo producto
export const addProducto = async (producto) => {
  try {
    const docRef = await addDoc(productosCollection, {
      ...producto,
      oferta: false,
      createdAt: new Date().toISOString()
    });
    console.log('Producto agregado con ID:', docRef.id);
    return { id: docRef.id, ...producto, oferta: false };
  } catch (error) {
    console.error("Error al agregar producto:", error);
    throw error;
  }
};

// Actualizar un producto existente
export const updateProducto = async (id, productoActualizado) => {
  try {
    const productoRef = doc(db, 'productos', id);
    
    // Primero obtener el producto actual para mantener campos como oferta
    const productoActual = await getDoc(productoRef);
    const dataActual = productoActual.data();
    
    // Mantener campos de oferta si existen
    const nuevosDatos = {
      ...productoActualizado,
      oferta: dataActual?.oferta || false,
      descuento: dataActual?.descuento || null,
      precioOferta: dataActual?.precioOferta || null,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(productoRef, nuevosDatos);
    console.log('Producto actualizado:', id);
    return { id, ...nuevosDatos };
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

// Eliminar un producto
export const deleteProducto = async (id) => {
  try {
    const productoRef = doc(db, 'productos', id);
    await deleteDoc(productoRef);
    console.log('Producto eliminado:', id);
    return id;
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
};

// ============================================
// FUNCIONES PARA OFERTAS
// ============================================

// Marcar producto como oferta
export const marcarOferta = async (id, descuento) => {
  try {
    const productoRef = doc(db, 'productos', id);
    const productoSnap = await getDoc(productoRef);
    
    if (!productoSnap.exists()) {
      throw new Error('Producto no encontrado');
    }
    
    const producto = productoSnap.data();
    const precioOriginal = producto.precio;
    const precioOferta = Math.round(precioOriginal * (1 - descuento / 100));
    
    await updateDoc(productoRef, {
      oferta: true,
      descuento: descuento,
      precioOferta: precioOferta
    });
    
    console.log('Producto marcado como oferta:', id);
    return { id, ...producto, oferta: true, descuento, precioOferta };
  } catch (error) {
    console.error("Error al marcar oferta:", error);
    throw error;
  }
};

// Quitar oferta de un producto
export const quitarOferta = async (id) => {
  try {
    const productoRef = doc(db, 'productos', id);
    
    await updateDoc(productoRef, {
      oferta: false,
      descuento: null,
      precioOferta: null
    });
    
    console.log('Oferta quitada:', id);
    return id;
  } catch (error) {
    console.error("Error al quitar oferta:", error);
    throw error;
  }
};

// Obtener solo productos en oferta
export const getProductosEnOferta = async () => {
  try {
    const q = query(productosCollection, where('oferta', '==', true));
    const snapshot = await getDocs(q);
    const productos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return productos;
  } catch (error) {
    console.error("Error al obtener productos en oferta:", error);
    return [];
  }
};