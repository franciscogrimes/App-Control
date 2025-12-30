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

const clientesRef = collection(db, "clientes")

export async function criarCliente({ nome, email, telefone, dataNascimento }) {
  await addDoc(clientesRef, {
    nome,
    email,
    telefone,
    dataNascimento,
    createdAt: serverTimestamp(),
    ativo: true,
  })
}

export async function listarClientes() {
  const q = query(clientesRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export async function atualizarCliente(id, dados) {
  const ref = doc(db, "clientes", id)
  await updateDoc(ref, dados)
}

export async function deletarCliente (id) {
  const ref = doc(db, "clientes", id)
  await deleteDoc(ref)
}
