import { useState, useRef, useEffect } from 'react';
import {Button} from '../components/ui/button'
import {Card, CardHeader, CardTitle, CardContent} from '../components/ui/card'
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '../components/ui/dialog'
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { withMask } from "use-mask-input";

export default function Clientes(){
  const clientesCadastrados = [
    {
      id: 1,
      nome: "Francisco Grimes",
      valorGasto: "200,00",
      nascimento: "18-11-2000",
      telefone: "(48) 98816-2418"
    },
    {
      id: 2,
      nome: "Maria Silva",
      valorGasto: "350,00",
      nascimento: "25-03-1995",
      telefone: "(48) 99123-4567"
    },
  ]

  const [clientes, setClientes] = useState(clientesCadastrados);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

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

  // Abre modal para editar
  const handleEditClick = (cliente) => {
    setEditingClient(cliente);
    setModalOpen(true);
    
    // Preenche formulário com dados do cliente
    reset({
      Nome: cliente.nome,
      Telefone: cliente.telefone,
      Nascimento: cliente.nascimento,
      ValorGasto: cliente.valorGasto,
    });
  };

  // Abre modal para adicionar
  const handleAddClick = () => {
    setEditingClient(null);
    setModalOpen(true);
    
    // Limpa formulário
    reset({
      Nome: '',
      Telefone: '',
      Nascimento: '',
      ValorGasto: '',
    });
  };

  // Deletar cliente
  const handleDelete = (id) => {
    if (confirm('Deseja realmente remover este cliente?')) {
      setClientes(clientes.filter(cliente => cliente.id !== id));
    }
  };

  // Salvar (adicionar ou atualizar)
  const onSubmit = (data) => {
    if (editingClient) {
      // Atualizar cliente existente
      setClientes(clientes.map(cliente =>
        cliente.id === editingClient.id
          ? {
              ...cliente,
              nome: data.Nome,
              telefone: data.Telefone,
              nascimento: data.Nascimento,
              valorGasto: data.ValorGasto,
            }
          : cliente
      ));
    } else {
      // Adicionar novo cliente
      const newClient = {
        id: Date.now(),
        nome: data.Nome,
        telefone: data.Telefone,
        nascimento: data.Nascimento,
        valorGasto: data.ValorGasto,
      };
      setClientes([...clientes, newClient]);
    }
    
    setModalOpen(false);
  };

  return(
    <section className="h-auto bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="mb-6">
          <Button 
            onClick={handleAddClick}
            className="bg-[#800020] hover:bg-[#600018] h-12 text-lg gap-2"
          >
            <FaPlus />
            Adicionar cliente
          </Button>
        </div>

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
                    >
                      <FaRegTrashAlt />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditClick(cliente)}
                    >
                      <IoPencil />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Valor Gasto:</span>
                  <span className="font-semibold text-[#800020]">
                    R$ {cliente.valorGasto}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Nascimento:</span>
                  <span className="text-gray-700">{cliente.nascimento}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Telefone:</span>
                  <span className="text-gray-700">{cliente.telefone}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label className="bg-transparent text-sm text-gray-200">
                    Data de Nascimento
                  </label>
                  <input
                    placeholder="XX-XX-XXXX"
                    type="text"
                    {...register("Nascimento", { required: true })}
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