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

const servicosRef = collection(db, "servicos")

export async function criarServico({ nome, preco }) {
  await addDoc(servicosRef, {
    nome,
    preco: Number(preco),
    createdAt: serverTimestamp(),
    ativo: true,
  })
}

export async function listarServicos() {
  const q = query(servicosRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export async function atualizarServico(id, dados) {
  const ref = doc(db, "servicos", id)
  await updateDoc(ref, dados)
}

export async function deletarServico(id) {
  const ref = doc(db, "servicos", id)
  await deleteDoc(ref)
}
