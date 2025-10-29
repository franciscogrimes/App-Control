import { useState} from 'react';
import {Button} from '../components/ui/button'
import {Card, CardHeader, CardTitle, CardContent} from '../components/ui/card'
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '../components/ui/dialog'
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import { useForm } from "react-hook-form";

export default function Produtos(){
  const produtosCadastrados = [
    {
      id: 1,
      nome: "Gel Sobrancelha - pantene",
      valor: "200,00",
      quantidade: "5",
    },
  ]

  const [produtos, setProdutos] = useState(produtosCadastrados);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

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
      Valor: produto.valor,
    });
  };

  const handleAddClick = () => {
    setEditingClient(null);
    setModalOpen(true);
    
    reset({
      Nome: '',
      Valor: '',
    });
  };

  const handleDelete = (id) => {
    if (confirm('Deseja realmente remover este produto?')) {
      setProdutos(produtos.filter(produto => produto.id !== id));
    }
  };

  const onSubmit = (data) => {
    if (editingClient) {
      setProdutos(produtos.map(produto =>
        produto.id === editingClient.id
          ? {
              ...produto,
              nome: data.Nome,
              valor: data.Valor,
            }
          : produto
      ));
    } else {
      const newClient = {
        id: Date.now(),
        nome: data.Nome,
        valor: data.Valor,
      };
      setProdutos([...produtos, newClient]);
    }
    
    setModalOpen(false);
  };

  return(
    <section className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="mb-6">
          <Button 
            onClick={handleAddClick}
            className="bg-[#800020] hover:bg-[#600018] h-12 text-lg gap-2"
          >
            <FaPlus />
            Adicionar produto
          </Button>
        </div>

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
                    >
                      <FaRegTrashAlt />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditClick(produto)}
                    >
                      <IoPencil />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-600">Quantidade:</span>
                  <span className= {`font-bold text-lg ${produto.quantidade > 0 ? `text-green-600`: `text-red-500` }`}>
                    {produto.quantidade} unidades
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-600">Valor do produto:</span>
                  <span className="text-gray-700 text-lg">R$ {produto.valor}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
                  />
                </div>
                
                <div className="flex flex-col gap-1 w-full">
                  <label className="bg-transparent text-sm text-gray-200">
                    Valor do produto
                  </label>
                  <input
                    placeholder="Valor"
                    type="text"
                    {...register("Valor", { required: true })}
                    className="w-full p-5 h-15 rounded-lg bg-white/20 text-white placeholder-gray-200 
                               border border-white/30 focus:outline-none focus:ring-2 
                               focus:ring-[#A04058] focus:border-transparent transition-all"
                  />
                </div>



                <div className="flex gap-3 w-full justify-end">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="h-15 w-40 bg-white/20 text-white 
                               font-semibold rounded-lg hover:bg-white/30 active:scale-[0.98] 
                               transition-all shadow-md border border-white/30"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="h-15 w-40 bg-gradient-to-r from-[#800020] to-[#A04058] text-white 
                               font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] 
                               transition-all shadow-md"
                  >
                    {editingClient ? 'Atualizar' : 'Cadastrar'}
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