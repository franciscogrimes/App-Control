// services/firebase/entradas.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore"

import { db } from "./config"

const entradasRef = collection(db, "entradas")

export async function darEntrada({ fornecedor, valorPago, estoque, produto }) {
  await addDoc(entradasRef, {
    fornecedor,
    produto,
    valorPago: Number(valorPago),
    quantidade: Number(estoque),
    createdAt: serverTimestamp(),
    ativo: true,
  })
}

export async function listarEntradas() {
  const q = query(entradasRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export async function atualizarEntrada(id, dados) {
  const ref = doc(db, "entradas", id)
  await updateDoc(ref, dados)
}

export async function deletarEntrada(id) {
  const ref = doc(db, "entradas", id)
  await deleteDoc(ref)
}