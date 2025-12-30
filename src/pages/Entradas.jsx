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
import { useEffect, useState } from 'react'
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
  darEntrada, 
  listarEntradas,
  atualizarEntrada,
  
} from "../services/firebase/entradas.js";
import { listarProdutos,atualizarProduto } from "../services/firebase/produtos.js";
import { ExportButton } from '@/components/ExportDocument';
import { serverTimestamp } from "firebase/firestore";



export default function Entradas() {
  const [produtosServicos, setProdutosServicos] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntrada, setEditingEntrada] = useState(null);
  const [filtroValor, setFiltroValor] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [colunasVisiveis, setColunasVisiveis] = useState({
    data: true,
    fornecedor: true,
    produto: true,
    quantidade: true,
    valor: true
  });

  const { register, handleSubmit, reset } = useForm();

  // Carrega produtos e entradas ao montar
  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        
        // Carrega produtos para o select
        const produtos = await listarProdutos();
        setProdutosServicos(produtos);
        
        // Carrega entradas
        const entradasFirebase = await listarEntradas();
        setEntradas(entradasFirebase);
        
        console.log("Produtos:", produtos);
        console.log("Entradas:", entradasFirebase);
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
    setEditingEntrada(null);
    setModalOpen(true);

    reset({
      Fornecedor: '',
      Produto: '',
      Quantidade: '',
      Valor: ''
    });
  };

const onSubmit = async (data) => {
  try {
    setLoading(true);
    
    if (editingEntrada) {
      // ATUALIZAR ENTRADA EXISTENTE
      const produtoSelecionado = produtosServicos.find(p => p.nome === data.Produto);
      
      if (produtoSelecionado) {
        // Calcula a diferença entre a nova quantidade e a quantidade anterior
        const diferencaQuantidade = Number(data.Quantidade) - Number(editingEntrada.quantidade);
        
        // Ajusta o estoque baseado na diferença
        await atualizarProduto(produtoSelecionado.id, {
          estoque: Number(produtoSelecionado.estoque || 0) + diferencaQuantidade
        });
      }

      // Atualiza a entrada no Firebase
      await atualizarEntrada(editingEntrada.id, {
        fornecedor: data.Fornecedor,
        produto: data.Produto,
        quantidade: Number(data.Quantidade),
        valorPago: Number(data.Valor),
      });
      
      // Atualiza o estado local
      setEntradas(entradas.map(entrada =>
        entrada.id === editingEntrada.id
          ? {
              ...entrada,
              fornecedor: data.Fornecedor,
              produto: data.Produto,
              quantidade: Number(data.Quantidade),
              valorPago: Number(data.Valor),
            }
          : entrada
      ));
      
      // Recarrega produtos para ter dados atualizados
      const produtosAtualizados = await listarProdutos();
      setProdutosServicos(produtosAtualizados);
      
      alert('Entrada atualizada com sucesso!');
      
    } else {
 
      await darEntrada({
        fornecedor: data.Fornecedor,
        produto: data.Produto,
        estoque: Number(data.Quantidade),
        valorPago: Number(data.Valor),
        createdAt: serverTimestamp()
      });
      
      // Atualiza o estoque do produto
      const produtoSelecionado = produtosServicos.find(p => p.nome === data.Produto);
      if (produtoSelecionado) {
        await atualizarProduto(produtoSelecionado.id, {
          estoque: Number(produtoSelecionado.estoque || 0) + Number(data.Quantidade)
        });
      }
      
      // Recarrega produtos atualizados
      const produtosAtualizados = await listarProdutos();
      setProdutosServicos(produtosAtualizados);
      
      // Recarrega entradas
      const entradasAtualizadas = await listarEntradas();
      setEntradas(entradasAtualizadas);
      
      alert('Entrada cadastrada com sucesso!');
    }
    
    setModalOpen(false);
    reset();
    
  } catch (error) {
    console.error("Erro ao salvar entrada:", error);
    alert("Erro ao salvar entrada: " + error.message);
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
  const entradasFiltradas = entradas.filter((entrada) => {
    if (!filtroValor) return true;
    
    const valorBusca = filtroValor.toLowerCase();
    const dataFormatada = entrada.createdAt?.toDate 
      ? new Date(entrada.createdAt.toDate()).toLocaleDateString('pt-BR')
      : '';
    
    return (
      dataFormatada.includes(valorBusca) ||
      entrada.fornecedor?.toLowerCase().includes(valorBusca) ||
      entrada.produto?.toLowerCase().includes(valorBusca) ||
      entrada.quantidade?.toString().includes(valorBusca) ||
      entrada.valorPago?.toString().includes(valorBusca)
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
    data: {
      label: 'Data',
      format: (timestamp) => formatarData(timestamp),
      visible: colunasVisiveis.data
    },
    fornecedor: {
      label: 'Fornecedor',
      format: (value) => value || '-',
      visible: colunasVisiveis.fornecedor
    },
    produto: {
      label: 'Produto',
      format: (value) => value || '-',
      visible: colunasVisiveis.produto
    },
    quantidade: {
      label: 'Unidades',
      format: (value) => value?.toString() || '0',
      visible: colunasVisiveis.quantidade
    },
    valorPago: {
      label: 'Valor (R$)',
      format: (value) => `R$ ${Number(value || 0).toFixed(2)}`,
      visible: colunasVisiveis.valor
    },


  createdAt: {  // ⚠️ Certifique-se que este é o nome correto do campo
    label: 'Data',
    format: (timestamp) => {
      // Verifique se timestamp existe
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
              Adicionar entrada
            </Button>

               <ExportButton
                data={entradasFiltradas}
                columns={exportColumns}
                fileName="relatorio_entradas"
                title="Relatório de Entradas"
                disabled={loading}
                buttonLabel="Relatório"
                showIcon={true}
                className="h-12 text-lg"
                onExportStart={() => console.log('Iniciando exportação...')}
                onExportComplete={(success) => {
                  if (success) {
                    console.log('Exportação concluída com sucesso!');
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
                  checked={colunasVisiveis.fornecedor}
                  onChange={() => toggleColuna('fornecedor')}
                  className="w-4 h-4 text-[#800020] rounded focus:ring-[#800020] focus:ring-2"
                />
                <span className="text-sm text-gray-700">Fornecedor</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={colunasVisiveis.produto}
                  onChange={() => toggleColuna('produto')}
                  className="w-4 h-4 text-[#800020] rounded focus:ring-[#800020] focus:ring-2"
                />
                <span className="text-sm text-gray-700">Produto</span>
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

        {loading && entradas.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-xl">Carregando entradas...</p>
          </div>
        ) : (
          <div>
            <Table>
              <TableCaption className="text-gray-500 py-4">
                {entradasFiltradas.length === 0 
                  ? "Nenhuma entrada encontrada" 
                  : `${entradasFiltradas.length} entrada(s) encontrada(s)`}
              </TableCaption>
              <TableHeader className="items-center">
                <TableRow className="bg-gray-50">
                  {colunasVisiveis.data && (
                    <TableHead className="font-semibold">Data</TableHead>
                  )}
                  {colunasVisiveis.fornecedor && (
                    <TableHead className="font-semibold">Fornecedor</TableHead>
                  )}
                  {colunasVisiveis.produto && (
                    <TableHead className="font-semibold">Produto</TableHead>
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
                {entradasFiltradas.map((row) => (
                  <TableRow key={row.id}>
                    {colunasVisiveis.data && (
                      <TableCell className="font-medium text-gray-700">
                        {formatarData(row.createdAt)}
                      </TableCell>
                    )}
                    {colunasVisiveis.fornecedor && (
                      <TableCell className="text-gray-700">
                        {row.fornecedor}
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
                        R$ {row.valorPago ? Number(row.valorPago).toFixed(2) : '0.00'}
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
              {editingEntrada ? 'Atualizar entrada' : 'Adicionar entrada'}
            </DialogTitle>

            <DialogDescription>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col items-center justify-center gap-5 text-white"
              >
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm text-gray-200">Fornecedor</label>
                  <input
                    placeholder="Nome do fornecedor"
                    type="text"
                    {...register("Fornecedor", { required: true })}
                    className="text-base w-full p-5 rounded-lg bg-white/20 text-white placeholder-gray-200 
                               border border-white/30 focus:outline-none focus:ring-2 
                               focus:ring-[#A04058] focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm text-gray-200">Produto</label>
                  <select
                    {...register("Produto", { required: true })}
                    className="text-base w-full p-5 rounded-lg bg-white/20 text-white 
                               border border-white/30 focus:outline-none focus:ring-2 
                               focus:ring-[#A04058] focus:border-transparent transition-all"
                    disabled={loading}
                  >
                    <option value="" className="text-gray-900">Selecione um produto</option>
                    {produtosServicos.map((item) => (
                      <option key={item.id} value={item.nome} className="text-gray-900">
                        {item.nome}
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
                    {...register("Quantidade", { required: true })}
                    className="text-base w-full p-5 rounded-lg bg-white/20 text-white placeholder-gray-200 
                               border border-white/30 focus:outline-none focus:ring-2 
                               focus:ring-[#A04058] focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm text-gray-200">Valor total pago (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ex: 150.00"
                    {...register("Valor", { required: true })}
                    className="text-base w-full p-5 rounded-lg bg-white/20 text-white placeholder-gray-200
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
                    {loading ? 'Salvando...' : editingEntrada ? 'Atualizar' : 'Cadastrar'}
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