import { useState, useEffect} from 'react';
import {Button} from '../components/ui/button'
import {Card, CardHeader, CardTitle, CardContent} from '../components/ui/card'
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '../components/ui/dialog'
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { 
  criarServico, 
  listarServicos, 
  atualizarServico, 
  deletarServico 
} from "../services/firebase/services.js";

export default function Servicos(){

  const [servicos, setServicos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingServico, setEditingServico] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();


  const handleEditClick = (servico) => {
    setEditingServico(servico);
    setModalOpen(true);
    
    reset({
      Nome: servico.nome,
      Preco: servico.preco,
    });
  };

  const handleAddClick = () => {
    setEditingServico(null);
    setModalOpen(true);
    
    reset({
      Nome: '',
      Preco: '',
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Deseja realmente remover este serviço?')) {
      try {
        setLoading(true);
        await deletarServico(id);
        setServicos(servicos.filter(servico => servico.id !== id));
        alert('Serviço removido com sucesso!');
      } catch (error) {
        console.error("Erro ao deletar serviço:", error);
        alert("Erro ao deletar serviço!");
      } finally {
        setLoading(false);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      if (editingServico) {
        await atualizarServico(editingServico.id, {
          nome: data.Nome,
          preco: Number(data.Preco),
        });
        
        setServicos(servicos.map(servico =>
          servico.id === editingServico.id
            ? {
                ...servico,
                nome: data.Nome,
                preco: Number(data.Preco),
              }
            : servico
        ));
        
        alert('Serviço atualizado com sucesso!');
      } else {
        await criarServico({
          nome: data.Nome,
          preco: Number(data.Preco),
        });
        
        const servicosAtualizados = await listarServicos();
        setServicos(servicosAtualizados);
        
        alert('Serviço cadastrado com sucesso!');
      }
      
      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      alert("Erro ao salvar serviço!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function listaServicosCadastrados() {
      try {
        setLoading(true);
        const servicosFirebase = await listarServicos();
        console.log("Serviços do Firestore:", servicosFirebase);
        setServicos(servicosFirebase);
      } catch (error) {
        console.error("Erro ao listar serviços:", error);
        alert("Erro ao carregar serviços!");
      } finally {
        setLoading(false);
      }
    }

    listaServicosCadastrados();
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
            Adicionar serviço
          </Button>
        </div>

        {loading && servicos.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-xl">Carregando serviços...</p>
          </div>
        ) : servicos.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-xl">Nenhum serviço cadastrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicos.map((servico) => (
              <Card key={servico.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex justify-between text-gray-800">
                    {servico.nome}
                    <div className='flex gap-2'>
                      <Button 
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(servico.id)}
                        disabled={loading}
                      >
                        <FaRegTrashAlt />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(servico)}
                        disabled={loading}
                      >
                        <IoPencil />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-gray-600">Valor do serviço:</span>
                    <span className="text-gray-700 text-lg font-semibold">
                      R$ {servico.preco ? Number(servico.preco).toFixed(2).replace(".",",") : '0,00'}
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
              {editingServico ? 'Atualizar serviço' : 'Adicionar serviço'}
            </DialogTitle>
            <DialogDescription>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col items-center justify-center gap-5 text-white"
              >
                <div className="flex flex-col gap-1 w-full">
                  <label className="bg-transparent text-sm text-gray-200">
                    Nome do serviço
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
                    Preço do serviço
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
                    {loading ? 'Salvando...' : editingServico ? 'Atualizar' : 'Cadastrar'}
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