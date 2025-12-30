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

const produtosRef = collection(db, "produtos")

export async function criarProduto({ nome, preco, estoque }) {
  await addDoc(produtosRef, {
    nome,
    preco: Number(preco),
    estoque: Number(estoque),
    createdAt: serverTimestamp(),
    ativo: true,
  })
}

export async function listarProdutos() {
  const q = query(produtosRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export async function atualizarProduto(id, dados) {
  const ref = doc(db, "produtos", id)
  await updateDoc(ref, dados)
}

export async function deletarProduto(id) {
  const ref = doc(db, "produtos", id)
  await deleteDoc(ref)
}
