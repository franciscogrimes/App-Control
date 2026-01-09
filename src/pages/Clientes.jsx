import { useState, useRef, useEffect } from 'react';
import {Button} from '../components/ui/button'
import {Card, CardHeader, CardTitle, CardContent} from '../components/ui/card'
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '../components/ui/dialog'
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { withMask } from "use-mask-input";
import { 
  criarCliente, 
  listarClientes, 
  atualizarCliente, 
  deletarCliente 
} from "../services/firebase/clientes.js";

export default function Clientes(){
  const [clientes, setClientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const phoneRef = useRef(null);

  // Aplica máscara quando modal abre
  useEffect(() => {
    if (modalOpen && phoneRef.current) {
      withMask('(99) 99999-9999')(phoneRef.current);
    }
  }, [modalOpen]);

  // Carrega clientes do Firebase ao montar o componente
  useEffect(() => {
    async function listaClientesCadastrados() {
      try {
        setLoading(true);
        const clientesFirebase = await listarClientes();
        console.log("Clientes do Firestore:", clientesFirebase);
        setClientes(clientesFirebase);
      } catch (error) {
        console.error("Erro ao listar clientes:", error);
        alert("Erro ao carregar clientes!");
      } finally {
        setLoading(false);
      }
    }

    listaClientesCadastrados();
  }, []);

  // Abre modal para editar
  const handleEditClick = (cliente) => {
    setEditingClient(cliente);
    setModalOpen(true);
    
    // Preenche formulário com dados do cliente
    reset({
      Nome: cliente.nome,
      Email: cliente.email,
      Telefone: cliente.telefone,
      DataNascimento: cliente.dataNascimento,
    });
  };

  const handleAddClick = () => {
    setEditingClient(null);
    setModalOpen(true);
    
    reset({
      Nome: '',
      Email: '',
      Telefone: '',
      DataNascimento: '',
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Deseja realmente remover este cliente?')) {
      try {
        setLoading(true);
        await deletarCliente(id);
        setClientes(clientes.filter(cliente => cliente.id !== id));
        alert('Cliente removido com sucesso!');
      } catch (error) {
        console.error("Erro ao deletar cliente:", error);
        alert("Erro ao deletar cliente!");
      } finally {
        setLoading(false);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      if (editingClient) {
        // ATUALIZAR CLIENTE EXISTENTE
        await atualizarCliente(editingClient.id, {
          nome: data.Nome,
          email: data.Email,
          telefone: data.Telefone,
          dataNascimento: data.DataNascimento,
        });
        
        setClientes(clientes.map(cliente =>
          cliente.id === editingClient.id
            ? {
                ...cliente,
                nome: data.Nome,
                email: data.Email,
                telefone: data.Telefone,
                dataNascimento: data.DataNascimento,
              }
            : cliente
        ));
        
        alert('Cliente atualizado com sucesso!');
      } else {
        // CRIAR NOVO CLIENTE
        await criarCliente({
          nome: data.Nome,
          email: data.Email,
          telefone: data.Telefone,
          dataNascimento: data.DataNascimento,
        });
        
        // Recarrega a lista de clientes do Firebase para pegar o ID correto
        const clientesAtualizados = await listarClientes();
        setClientes(clientesAtualizados);
        
        alert('Cliente cadastrado com sucesso!');
      }
      
      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      alert("Erro ao salvar cliente!");
    } finally {
      setLoading(false);
    }
  };

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
            Adicionar cliente
          </Button>
        </div>

        {loading && clientes.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-xl">Carregando clientes...</p>
          </div>
        ) : clientes.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-xl">Nenhum cliente cadastrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientes.map((cliente) => (
              <Card key={cliente.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex justify-between text-gray-800">
                    {cliente.nome}
                    <div className='flex gap-2'>
                      <Button 
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(cliente.id)}
                        disabled={loading}
                      >
                        <FaRegTrashAlt />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(cliente)}
                        disabled={loading}
                      >
                        <IoPencil />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-gray-700">{cliente.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nascimento:</span>
                    <span className="text-gray-700">{cliente.dataNascimento}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Telefone:</span>
                    <span className="text-gray-700">{cliente.telefone}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className='flex items-center justify-center w-90 md:w-120 h-auto bg-white/20 backdrop-blur-md border border-white/30 rounded'>
          <DialogHeader>
            <DialogTitle className='text-white font-bold text-4xl pb-5'>
              {editingClient ? 'Atualizar cliente' : 'Adicionar cliente'}
            </DialogTitle>
            <DialogDescription>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col items-center justify-center gap-5 text-white"
              >
                <div className="flex flex-col gap-1 w-full">
                  <label className="bg-transparent text-sm text-gray-200">
                    Nome
                  </label>
                  <input
                    placeholder="Nome completo"
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
                    Email
                  </label>
                  <input
                    placeholder="email@exemplo.com"
                    type="email"
                    {...register("Email", { required: true })}
                    className="w-full p-5 h-15 rounded-lg bg-white/20 text-white placeholder-gray-200 
                               border border-white/30 focus:outline-none focus:ring-2 
                               focus:ring-[#A04058] focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label className="bg-transparent text-sm text-gray-200">
                    Telefone
                  </label>
                  <input
                    placeholder="(XX) XXXXX-XXXX"
                    type="text"
                    {...register("Telefone", { required: true })}
                    ref={(e) => {
                      register("Telefone").ref(e);
                      phoneRef.current = e;
                    }}
                    className="w-full p-5 h-15 rounded-lg bg-white/20 text-white placeholder-gray-200 
                               border border-white/30 focus:outline-none focus:ring-2 
                               focus:ring-[#A04058] focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label className="bg-transparent text-sm text-gray-200">
                    Data de Nascimento
                  </label>
                  <input
                    placeholder="DD/MM/AAAA"
                    type="date"
                    {...register("DataNascimento", { required: true })}
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