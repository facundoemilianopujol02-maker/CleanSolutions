import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

const combosCollection = collection(db, 'combos');

// Obtener todos los combos
export const getCombos = async () => {
  try {
    const snapshot = await getDocs(combosCollection);
    const combos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('Combos cargados:', combos.length);
    return combos;
  } catch (error) {
    console.error("Error al obtener combos:", error);
    return [];
  }
};

// Agregar un combo
export const addCombo = async (combo) => {
  try {
    const docRef = await addDoc(combosCollection, {
      ...combo,
      createdAt: new Date().toISOString()
    });
    console.log('Combo agregado con ID:', docRef.id);
    return { id: docRef.id, ...combo };
  } catch (error) {
    console.error("Error al agregar combo:", error);
    throw error;
  }
};

// Actualizar combo
export const updateCombo = async (id, comboActualizado) => {
  try {
    const comboRef = doc(db, 'combos', id);
    const comboActual = await getDoc(comboRef);
    
    await updateDoc(comboRef, {
      ...comboActualizado,
      updatedAt: new Date().toISOString()
    });
    
    console.log('Combo actualizado:', id);
    return { id, ...comboActualizado };
  } catch (error) {
    console.error("Error al actualizar combo:", error);
    throw error;
  }
};

// Eliminar combo
export const deleteCombo = async (id) => {
  try {
    const comboRef = doc(db, 'combos', id);
    await deleteDoc(comboRef);
    console.log('Combo eliminado:', id);
    return id;
  } catch (error) {
    console.error("Error al eliminar combo:", error);
    throw error;
  }
};