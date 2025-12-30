// services/firebase/saidas.js
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

const saidasRef = collection(db, "saidas")

export async function darSaida({ cliente, produto, quantidade, valorTotal }) {
  await addDoc(saidasRef, {
    cliente,
    produto,
    quantidade: Number(quantidade),
    valorTotal: Number(valorTotal),
    createdAt: serverTimestamp(),
    ativo: true,
  })
}

export async function listarSaidas() {
  const q = query(saidasRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export async function atualizarSaida(id, dados) {
  const ref = doc(db, "saidas", id)
  await updateDoc(ref, dados)
}

export async function deletarSaida(id) {
  const ref = doc(db, "saidas", id)
  await deleteDoc(ref)
}