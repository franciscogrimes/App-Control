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
import { 
  darSaida, 
  listarSaidas,
  atualizarSaida,
} from "../services/firebase/saidas.js";
import { listarProdutos, atualizarProduto } from "../services/firebase/produtos.js";
import { listarServicos } from "../services/firebase/services.js";
import { listarClientes } from "../services/firebase/clientes.js";
import { ExportButton } from '@/components/ExportDocument';
import { serverTimestamp } from "firebase/firestore";


export default function Saidas() {
  const [produtosServicos, setProdutosServicos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [saidas, setSaidas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSaida, setEditingSaida] = useState(null);
  const [filtroValor, setFiltroValor] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Colunas visíveis
  const [colunasVisiveis, setColunasVisiveis] = useState({
    data: true,
    cliente: true,
    produto: true,
    quantidade: true,
    valor: true
  });

  const [quantidade, setQuantidade] = useState();
  const [precoUnitario, setPrecoUnitario] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  // Lista combinada de produtos e serviços
  const itensDisponiveis = [
    ...produtosServicos.map(p => ({ ...p, tipo: 'produto' })),
    ...servicos.map(s => ({ ...s, tipo: 'servico' }))
  ];

  // Carrega dados ao montar
  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        
        const produtos = await listarProdutos();
        setProdutosServicos(produtos);
        
        const servicosFirebase = await listarServicos();
        setServicos(servicosFirebase);
        
        const clientesFirebase = await listarClientes();
        setClientes(clientesFirebase);
        
        const saidasFirebase = await listarSaidas();
        setSaidas(saidasFirebase);
        
        console.log("Produtos:", produtos);
        console.log("Serviços:", servicosFirebase);
        console.log("Clientes:", clientesFirebase);
        console.log("Saídas:", saidasFirebase);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar dados!");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const handleAddClick = () => {
    setEditingSaida(null);
    setModalOpen(true);

    reset({
      Cliente: '',
      Produto: '',
    });
    setQuantidade();
    setPrecoUnitario(0);
    setValorTotal(0);
    setProdutoSelecionado(null);
  };

  // Atualiza o valor total automaticamente
  useEffect(() => {
    setValorTotal(precoUnitario * quantidade);
  }, [precoUnitario, quantidade]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Validação: verifica se há estoque suficiente APENAS PARA PRODUTOS
      if (produtoSelecionado && produtoSelecionado.tipo === 'produto' && produtoSelecionado.estoque < quantidade) {
        alert(`Estoque insuficiente! Disponível: ${produtoSelecionado.estoque} unidades`);
        return;
      }
      
      if (editingSaida) {
        // ATUALIZAR SAÍDA EXISTENTE
        // Atualiza estoque apenas se for produto
        if (produtoSelecionado && produtoSelecionado.tipo === 'produto') {
          const diferencaQuantidade = Number(data.Quantidade) - Number(editingSaida.quantidade);
          
          await atualizarProduto(produtoSelecionado.id, {
            estoque: Number(produtoSelecionado.estoque || 0) - diferencaQuantidade
          });
        }

        await atualizarSaida(editingSaida.id, {
          cliente: data.Cliente,
          produto: data.Produto,
          quantidade: Number(quantidade),
          valorTotal: Number(valorTotal),
        });
        
        setSaidas(saidas.map(saida =>
          saida.id === editingSaida.id
            ? {
                ...saida,
                cliente: data.Cliente,
                produto: data.Produto,
                quantidade: Number(quantidade),
                valorTotal: Number(valorTotal),
              }
            : saida
        ));
        
        const produtosAtualizados = await listarProdutos();
        setProdutosServicos(produtosAtualizados);
        
        alert('Saída atualizada com sucesso!');
        
      } else {
        // CRIAR NOVA SAÍDA
        await darSaida({
          cliente: data.Cliente,
          produto: data.Produto,
          quantidade: Number(quantidade),
          valorTotal: Number(valorTotal),
          createdAt: serverTimestamp()
        });
        
        // Atualiza estoque apenas se for produto
        if (produtoSelecionado && produtoSelecionado.tipo === 'produto') {
          await atualizarProduto(produtoSelecionado.id, {
            estoque: Number(produtoSelecionado.estoque || 0) - Number(quantidade)
          });
        }
        
        const produtosAtualizados = await listarProdutos();
        setProdutosServicos(produtosAtualizados);
        
        const saidasAtualizadas = await listarSaidas();
        setSaidas(saidasAtualizadas);
        
        alert('Saída cadastrada com sucesso!');
      }
      
      setModalOpen(false);
      reset();
      
    } catch (error) {
      console.error("Erro ao salvar saída:", error);
      alert("Erro ao salvar saída: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para alternar visibilidade de coluna
  const toggleColuna = (coluna) => {
    setColunasVisiveis(prev => ({
      ...prev,
      [coluna]: !prev[coluna]
    }));
  };

  // Filtro de busca geral
  const saidasFiltradas = saidas.filter((saida) => {
    if (!filtroValor) return true;

    const valorBusca = filtroValor.toLowerCase();

    const dataFormatada = saida.createdAt?.toDate
      ? new Date(saida.createdAt.toDate()).toLocaleDateString('pt-BR')
      : '';

    return (
      dataFormatada.includes(valorBusca) ||
      saida.cliente?.toLowerCase().includes(valorBusca) ||
      saida.produto?.toLowerCase().includes(valorBusca) ||
      saida.quantidade?.toString().includes(valorBusca) ||
      saida.valorTotal?.toString().includes(valorBusca)
    );
  });

  // Formata data do Firestore
  const formatarData = (timestamp) => {
    if (!timestamp) return '-';
    try {
      return timestamp.toDate().toLocaleDateString('pt-BR');
    } catch (error) {
      return error;
    }
  };

  const exportColumns = {
    createdAt: {
      label: 'Data',
      format: (timestamp) => {
        if (!timestamp) return '-';
        
        try {
          // Se for um objeto do Firestore com método toDate()
          if (timestamp.toDate && typeof timestamp.toDate === 'function') {
            return timestamp.toDate().toLocaleDateString('pt-BR');
          }
          
          // Se já for uma string de data
          if (typeof timestamp === 'string') {
            return new Date(timestamp).toLocaleDateString('pt-BR');
          }
          
          // Se for um objeto Date
          if (timestamp instanceof Date) {
            return timestamp.toLocaleDateString('pt-BR');
          }
          
          return '-';
        } catch (error) {
          console.error('Erro ao formatar data:', error, timestamp);
          return '-';
        }
      },
      visible: colunasVisiveis.data
    },
    cliente: {
      label: 'Cliente',
      format: (value) => value || '-',
      visible: colunasVisiveis.cliente
    },
    produto: {
      label: 'Produto/Serviço',
      format: (value) => value || '-',
      visible: colunasVisiveis.produto
    },
    quantidade: {
      label: 'Unidades',
      format: (value) => value?.toString() || '0',
      visible: colunasVisiveis.quantidade
    },
    valorTotal: {
      label: 'Valor (R$)',
      format: (value) => `R$ ${Number(value || 0).toFixed(2)}`,
      visible: colunasVisiveis.valor
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-3">
              <Button
                onClick={handleAddClick}
                className="bg-[#800020] hover:bg-[#600018] h-12 text-lg gap-2"
                disabled={loading}
              >
                <FaPlus />
                Adicionar Saída
              </Button>

              <ExportButton
                data={saidasFiltradas}
                columns={exportColumns}
                fileName="relatorio_saidas"
                title="Relatório de Saídas"
                disabled={loading}
                buttonLabel="Relatório"
                showIcon={true}
                className="h-12 text-lg bg-green-600 hover:bg-green-700"
                filterConfig={{
                  showFornecedor: false,
                  showCliente: true,
                  showProduto: true
                }}
                onExportStart={() => console.log('Iniciando exportação de saídas...')}
                onExportComplete={(success) => {
                  if (success) {
                    console.log('Exportação de saídas concluída com sucesso!');
                  }
                }}
              />
            </div>

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
                  checked={colunasVisiveis.produto}
                  onChange={() => toggleColuna('produto')}
                  className="w-4 h-4 text-[#800020] rounded focus:ring-[#800020] focus:ring-2"
                />
                <span className="text-sm text-gray-700">Produto/Serviço</span>
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

        {loading && saidas.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-xl">Carregando saídas...</p>
          </div>
        ) : (
          <div>
            <Table>
              <TableCaption className="text-gray-500 py-4">
                {saidasFiltradas.length === 0 
                  ? "Nenhuma saída encontrada" 
                  : `${saidasFiltradas.length} saída(s) encontrada(s)`}
              </TableCaption>
              <TableHeader className="items-center">
                <TableRow className="bg-gray-50">
                  {colunasVisiveis.data && (
                    <TableHead className="font-semibold">Data</TableHead>
                  )}
                  {colunasVisiveis.cliente && (
                    <TableHead className="font-semibold">Cliente</TableHead>
                  )}
                  {colunasVisiveis.produto && (
                    <TableHead className="font-semibold">Produto/Serviço</TableHead>
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
                {saidasFiltradas.map((row) => (
                  <TableRow key={row.id}>
                    {colunasVisiveis.data && (
                      <TableCell className="font-medium text-gray-700">
                        {formatarData(row.createdAt)}
                      </TableCell>
                    )}
                    {colunasVisiveis.cliente && (
                      <TableCell className="text-gray-700">
                        {row.cliente}
                      </TableCell>
                    )}
                    {colunasVisiveis.produto && (
                      <TableCell className="text-gray-700">
                        {row.produto}
                      </TableCell>
                    )}
                    {colunasVisiveis.quantidade && (
                      <TableCell className="text-gray-700">
                        {row.quantidade}
                      </TableCell>
                    )}
                    {colunasVisiveis.valor && (
                      <TableCell className="text-right text-gray-800 font-semibold">
                        R$ {row.valorTotal ? Number(row.valorTotal).toFixed(2) : '0.00'}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="flex items-center justify-center w-90 md:w-120 h-auto bg-white/20 backdrop-blur-md border border-white/30 rounded p-8">
          <DialogHeader className="w-full">
            <DialogTitle className="text-white font-bold text-3xl pb-5 text-center">
              {editingSaida ? 'Atualizar saída' : 'Adicionar saída'}
            </DialogTitle>

            <DialogDescription>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col items-center justify-center gap-5 text-white"
              >
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm text-gray-200">Cliente</label>
                  <select
                    {...register("Cliente", { required: true })}
                    className="text-base w-full p-5 rounded-lg bg-white/20 text-white 
                               border border-white/30 focus:outline-none focus:ring-2 
                               focus:ring-[#A04058] focus:border-transparent transition-all"
                    disabled={loading}
                  >
                    <option value="" className="text-gray-900">Selecione um cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.nome} className="text-gray-900">
                        {cliente.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm text-gray-200">Produto/Serviço</label>
                  <select
                    {...register("Produto", { required: true })}
                    onChange={(e) => {
                      const item = itensDisponiveis.find(
                        (item) => item.nome === e.target.value
                      );
                      if (item) {
                        setProdutoSelecionado(item);
                        setPrecoUnitario(item.preco);
                        setValue("Produto", item.nome);
                      }
                    }}
                    className="text-base w-full p-5 rounded-lg bg-white/20 text-white 
                               border border-white/30 focus:outline-none focus:ring-2 
                               focus:ring-[#A04058] focus:border-transparent transition-all"
                    disabled={loading}
                  >
                    <option value="" className="text-gray-900">Selecione um produto ou serviço</option>
                    
                    {/* Produtos */}
                    {produtosServicos.length > 0 && (
                      <optgroup label="📦 Produtos" className="text-gray-900 font-bold">
                        {produtosServicos.map((item) => (
                          <option key={item.id} value={item.nome} className="text-gray-900">
                            {item.nome} - Estoque: {item.estoque}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    
                    {/* Serviços */}
                    {servicos.length > 0 && (
                      <optgroup label="🛠️ Serviços" className="text-gray-900 font-bold">
                        {servicos.map((item) => (
                          <option key={item.id} value={item.nome} className="text-gray-900">
                            {item.nome}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm text-gray-200">Quantidade</label>
                  <input
                    type="number"
                    max={produtoSelecionado?.tipo === 'produto' ? produtoSelecionado?.estoque : 999999}
                    placeholder="Ex: 3"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value) || 1)}
                    className="text-base w-full p-5 rounded-lg bg-white/20 text-white placeholder-gray-200 
                               border border-white/30 focus:outline-none focus:ring-2 
                               focus:ring-[#A04058] focus:border-transparent transition-all"
                    disabled={loading}
                  />
                  {produtoSelecionado && produtoSelecionado.tipo === 'produto' && (
                    <span className="text-xs text-gray-300">
                      Disponível: {produtoSelecionado.estoque} unidades
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm text-gray-200">Valor unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={precoUnitario}
                    readOnly
                    className="text-base w-full p-5 rounded-lg bg-white/20 text-white placeholder-gray-200 
                               border border-white/30 focus:outline-none cursor-not-allowed opacity-70"
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm text-gray-200">Valor total (R$)</label>
                  <input
                    type="number"
                    readOnly
                    value={valorTotal.toFixed(2)}
                    className="text-base w-full p-5 rounded-lg bg-white/20 text-white 
                               border border-white/30 focus:outline-none cursor-not-allowed opacity-70"
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
                    {loading ? 'Salvando...' : editingSaida ? 'Atualizar' : 'Cadastrar'}
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