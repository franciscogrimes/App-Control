import { useState, useEffect} from 'react';
import {Button} from '../components/ui/button'
import {Card, CardHeader, CardTitle, CardContent} from '../components/ui/card'
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '../components/ui/dialog'
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { 
  criarProduto, 
  listarProdutos, 
  atualizarProduto, 
  deletarProduto 
} from "../services/firebase/produtos.js";

export default function Produtos(){

  const [produtos, setProdutos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();


  const handleEditClick = (produto) => {
    setEditingClient(produto);
    setModalOpen(true);
    
    reset({
      Nome: produto.nome,
      Preco: produto.preco,
    });
  };

  const handleAddClick = () => {
    setEditingClient(null);
    setModalOpen(true);
    
    reset({
      Nome: '',
      Preco: '',
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Deseja realmente remover este produto?')) {
      try {
        setLoading(true);
        await deletarProduto(id);
        setProdutos(produtos.filter(produto => produto.id !== id));
        alert('Produto removido com sucesso!');
      } catch (error) {
        console.error("Erro ao deletar produto:", error);
        alert("Erro ao deletar produto!");
      } finally {
        setLoading(false);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      if (editingClient) {
        await atualizarProduto(editingClient.id, {
          nome: data.Nome,
          preco: Number(data.Preco),
        });
        
        setProdutos(produtos.map(produto =>
          produto.id === editingClient.id
            ? {
                ...produto,
                nome: data.Nome,
                preco: Number(data.Preco),
              }
            : produto
        ));
        
        alert('Produto atualizado com sucesso!');
      } else {
        await criarProduto({
          nome: data.Nome,
          preco: Number(data.Preco),
          estoque: 0,
        });
        
        const produtosAtualizados = await listarProdutos();
        setProdutos(produtosAtualizados);
        
        alert('Produto cadastrado com sucesso!');
      }
      
      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function listaProdutosCadastrados() {
      try {
        setLoading(true);
        const produtosFirebase = await listarProdutos();
        console.log("Produtos do Firestore:", produtosFirebase);
        setProdutos(produtosFirebase);
      } catch (error) {
        console.error("Erro ao listar produtos:", error);
        alert("Erro ao carregar produtos!");
      } finally {
        setLoading(false);
      }
    }

    listaProdutosCadastrados();
  },[])

  return(
    <section className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="mb-6">
          <Button 
            onClick={handleAddClick}
            className="bg-[#800020] hover:bg-[#600018] h-12 text-lg gap-2"
            disabled={loading}
          >
            <FaPlus />
            Adicionar produto
          </Button>
        </div>

        {loading && produtos.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-xl">Carregando produtos...</p>
          </div>
        ) : produtos.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-xl">Nenhum produto cadastrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <Card key={produto.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex justify-between text-gray-800">
                    {produto.nome}
                    <div className='flex gap-2'>
                      <Button 
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(produto.id)}
                        disabled={loading}
                      >
                        <FaRegTrashAlt />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(produto)}
                        disabled={loading}
                      >
                        <IoPencil />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-gray-600">Estoque:</span>
                    <span className={`font-bold text-lg ${produto.estoque > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {produto.estoque} unidades
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-gray-600">Valor do produto:</span>
                    <span className="text-gray-700 text-lg">
                      R$ {produto.preco ? Number(produto.preco).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className='flex gap-20 items-center justify-center w-90 md:w-120 h-120 bg-white/20 backdrop-blur-md border border-white/30 rounded'>
          <DialogHeader>
            <DialogTitle className='text-white font-bold text-4xl pb-5'>
              {editingClient ? 'Atualizar produto' : 'Adicionar produto'}
            </DialogTitle>
            <DialogDescription>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col items-center justify-center gap-5 text-white"
              >
                <div className="flex flex-col gap-1 w-full">
                  <label className="bg-transparent text-sm text-gray-200">
                    Nome do produto
                  </label>
                  <input
                    placeholder="Nome"
                    type="text"
                    {...register("Nome", { required: true })}
                    className="w-full p-5 h-15 rounded-lg bg-white/20 text-white placeholder-gray-200 
                               border border-white/30 focus:outline-none focus:ring-2 
                               focus:ring-[#A04058] focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>
                
                <div className="flex flex-col gap-1 w-full">
                  <label className="bg-transparent text-sm text-gray-200">
                    Preço do produto
                  </label>
                  <input
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("Preco", { required: true, min: 0 })}
                    className="w-full p-5 h-15 rounded-lg bg-white/20 text-white placeholder-gray-200 
                               border border-white/30 focus:outline-none focus:ring-2 
                               focus:ring-[#A04058] focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-3 w-full justify-end">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="h-15 w-40 bg-white/20 text-white 
                               font-semibold rounded-lg hover:bg-white/30 active:scale-[0.98] 
                               transition-all shadow-md border border-white/30"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="h-15 w-40 bg-gradient-to-r from-[#800020] to-[#A04058] text-white 
                               font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] 
                               transition-all shadow-md disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : editingClient ? 'Atualizar' : 'Cadastrar'}
                  </button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  )
}