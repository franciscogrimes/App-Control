import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Saidas() {

  const pedidosCadastrados = [
    {
      id: 1,
      cliente: "Chico",
      valor: "200,00",
      quantidade: "3",
      data: "25/10/2025"
    },
  ]

  const produtosServicos = [
    { id: 1, item: "Sobrancelha", valorUnitario: 50 },
    { id: 2, item: "Gel", valorUnitario: 20 },
    { id: 3, item: "Kit", valorUnitario: 75 }
  ];

  const [pedidos, setPedidos] = useState(pedidosCadastrados);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [filtroValor, setFiltroValor] = useState('');
  
  // Colunas visíveis
  const [colunasVisiveis, setColunasVisiveis] = useState({
    data: true,
    cliente: true,
    quantidade: true,
    valor: true
  });

  const [quantidade, setQuantidade] = useState(1);
  const [precoUnitario, setPrecoUnitario] = useState(5);
  const [valorTotal, setValorTotal] = useState(precoUnitario * quantidade);

  const { register, handleSubmit, reset } = useForm();

  const handleAddClick = () => {
    setEditingClient(null);
    setModalOpen(true);

    reset({
      Cliente: '',
      Quantidade: '',
      Valor: '',
      Data: ''
    });
    setQuantidade(1);
    setPrecoUnitario(5);
    setValorTotal(5);
  };

  // Atualiza o valor total automaticamente
  useEffect(() => {
    setValorTotal(precoUnitario * quantidade);
  }, [precoUnitario, quantidade]);

  const onSubmit = (data) => {
    if (editingClient) {
      setPedidos(pedidos.map(pedido =>
        pedido.id === editingClient.id
          ? {
              ...pedido,
              cliente: data.Cliente,
              quantidade,
              valor: valorTotal.toFixed(2),
              data: new Date().toLocaleDateString(),
            }
          : pedido
      ));
    } else {
      const newClient = {
        id: Date.now(),
        cliente: data.Cliente,
        quantidade,
        valor: valorTotal.toFixed(2),
        data: new Date().toLocaleDateString(),
      };
      setPedidos([...pedidos, newClient]);
    }

    setModalOpen(false);
  };

  // Função para alternar visibilidade de coluna
  const toggleColuna = (coluna) => {
    setColunasVisiveis(prev => ({
      ...prev,
      [coluna]: !prev[coluna]
    }));
  };

  // Filtro de busca geral
  const pedidosFiltrados = pedidos.filter((pedido) => {
    if (!filtroValor) return true;
    
    const valorBusca = filtroValor.toLowerCase();
    return (
      pedido.data.toLowerCase().includes(valorBusca) ||
      pedido.cliente.toLowerCase().includes(valorBusca) ||
      pedido.quantidade.toString().includes(valorBusca) ||
      pedido.valor.includes(valorBusca)
    );
  });

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <Button
              onClick={handleAddClick}
              className="bg-[#800020] hover:bg-[#600018] h-12 text-lg gap-2"
            >
              <FaPlus />
              Adicionar Saída
            </Button>

            {/* Campo de busca */}
            <input
              type="text"
              placeholder="Buscar em todas as colunas..."
              value={filtroValor}
              onChange={(e) => setFiltroValor(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 
                         placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-[#800020] focus:border-transparent w-full md:w-80"
            />
          </div>

          {/* Seletor de colunas visíveis */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Colunas visíveis:</h3>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={colunasVisiveis.data}
                  onChange={() => toggleColuna('data')}
                  className="w-4 h-4 text-[#800020] rounded focus:ring-[#800020] focus:ring-2"
                />
                <span className="text-sm text-gray-700">Data</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={colunasVisiveis.cliente}
                  onChange={() => toggleColuna('cliente')}
                  className="w-4 h-4 text-[#800020] rounded focus:ring-[#800020] focus:ring-2"
                />
                <span className="text-sm text-gray-700">Cliente</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={colunasVisiveis.quantidade}
                  onChange={() => toggleColuna('quantidade')}
                  className="w-4 h-4 text-[#800020] rounded focus:ring-[#800020] focus:ring-2"
                />
                <span className="text-sm text-gray-700">Unidades</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={colunasVisiveis.valor}
                  onChange={() => toggleColuna('valor')}
                  className="w-4 h-4 text-[#800020] rounded focus:ring-[#800020] focus:ring-2"
                />
                <span className="text-sm text-gray-700">Valor</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <Table>
            <TableCaption className="text-gray-500 py-4">
              {pedidosFiltrados.length === 0 
                ? "Nenhuma saída encontrada" 
                : `${pedidosFiltrados.length} saída(s) encontrada(s)`}
            </TableCaption>
            <TableHeader className="items-center">
              <TableRow className="bg-gray-50">
                {colunasVisiveis.data && (
                  <TableHead className="font-semibold">Data</TableHead>
                )}
                {colunasVisiveis.cliente && (
                  <TableHead className="font-semibold">Cliente</TableHead>
                )}
                {colunasVisiveis.quantidade && (
                  <TableHead className="font-semibold">Unidades</TableHead>
                )}
                {colunasVisiveis.valor && (
                  <TableHead className="font-semibold text-right">Valor (R$)</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidosFiltrados.map((row) => (
                <TableRow key={row.id}>
                  {colunasVisiveis.data && (
                    <TableCell className="font-medium text-gray-700">
                      {row.data}
                    </TableCell>
                  )}
                  {colunasVisiveis.cliente && (
                    <TableCell className="text-gray-700">
                      {row.cliente}
                    </TableCell>
                  )}
                  {colunasVisiveis.quantidade && (
                    <TableCell className="text-gray-700">
                      {row.quantidade}
                    </TableCell>
                  )}
                  {colunasVisiveis.valor && (
                    <TableCell className="text-right text-gray-800 font-semibold">
                      R$ {row.valor}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="flex items-center justify-center w-90 md:w-120 h-auto bg-white/20 backdrop-blur-md border border-white/30 rounded p-8">
          <DialogHeader className="w-full">
            <DialogTitle className="text-white font-bold text-3xl pb-5 text-center">
              {editingClient ? 'Atualizar pedido' : 'Adicionar pedido'}
            </DialogTitle>

            <DialogDescription>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col items-center justify-center gap-5 text-white"
              >
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm text-gray-200">Cliente</label>
                  <input
                    placeholder="Cliente"
                    type="text"
                    {...register("Cliente", { required: true })}
                    className="text-base w-full p-5 rounded-lg bg-white/20 text-white placeholder-gray-200 
                               border border-white/30 focus:outline-none focus:ring-2 
                               focus:ring-[#A04058] focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm text-gray-200">Produto</label>
                  <select
                    {...register("Produto")}
                    onChange={(e) => {
                      const produtoSelecionado = produtosServicos.find(
                        (item) => item.item === e.target.value
                      );
                      if (produtoSelecionado) {
                        setPrecoUnitario(produtoSelecionado.valorUnitario);
                      }
                    }}
                    className="text-base w-full p-5 rounded-lg bg-white/20 text-white placeholder-gray-200 
                               border border-white/30 focus:outline-none focus:ring-2 
                               focus:ring-[#A04058] focus:border-transparent transition-all"
                  >
                    <option value="">Selecione um produto</option>
                    {produtosServicos.map((item) => (
                      <option key={item.id} value={item.item}>
                        {item.item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm text-gray-200">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ex: 3"
                    value={quantidade}
                    onChange={(e) => setQuantidade(parseFloat(e.target.value) || 0)}
                    className="text-base w-full p-5 rounded-lg bg-white/20 text-white placeholder-gray-200 
                               border border-white/30 focus:outline-none focus:ring-2 
                               focus:ring-[#A04058] focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm text-gray-200">Valor unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={precoUnitario}
                    readOnly
                    className="text-base w-full p-5 rounded-lg bg-white/20 text-white placeholder-gray-200 
                               border border-white/30 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm text-gray-200">Valor total (R$)</label>
                  <input
                    type="number"
                    readOnly
                    value={valorTotal.toFixed(2)}
                    className="text-base w-full p-5 rounded-lg bg-white/20 text-white 
                               border border-white/30 focus:outline-none"
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
  );
}