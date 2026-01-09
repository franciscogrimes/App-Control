import { useState, useEffect } from 'react';
import { BsBoxSeam } from "react-icons/bs";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { TbPigMoney } from "react-icons/tb";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { listarProdutos } from "../services/firebase/produtos.js";
import { listarEntradas } from "../services/firebase/entradas.js";
import { listarSaidas } from "../services/firebase/saidas.js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [totalInvestimento, setTotalInvestimento] = useState(0);
  const [totalVendas, setTotalVendas] = useState(0);
  const [totalEstoque, setTotalEstoque] = useState(0);
  const [lucro, setLucro] = useState(0);
  const [ultimasSaidas, setUltimasSaidas] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);

        // Busca entradas (investimento)
        const entradas = await listarEntradas();
        const investimento = entradas.reduce((total, entrada) => {
          return total + Number(entrada.valorPago || 0);
        }, 0);
        setTotalInvestimento(investimento);

        // Busca saídas (vendas)
        const saidas = await listarSaidas();
        const vendas = saidas.reduce((total, saida) => {
          return total + Number(saida.valorTotal || 0);
        }, 0);
        setTotalVendas(vendas);

        // Últimas 5 saídas
        setUltimasSaidas(saidas.slice(0, 5));

        // Busca produtos (estoque total)
        const produtos = await listarProdutos();
        const estoque = produtos.reduce((total, produto) => {
          return total + Number(produto.estoque || 0);
        }, 0);
        setTotalEstoque(estoque);

        // Calcula lucro (vendas - investimento)
        setLucro(vendas - investimento);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  // Formata data do Firestore
  const formatarData = (timestamp) => {
    if (!timestamp) return ;
    try {
      return timestamp.toDate().toLocaleDateString('pt-BR');
    } catch (error) {
      return error;
    }
  };

  const cards = [
    {
      icon: <GiPayMoney className="text-4xl" />,
      title: "Investimento",
      value: totalInvestimento,
      color: "from-red-900 to-red-700",
      bgPattern: "bg-gradient-to-br",
    },
    {
      icon: <TbPigMoney className="text-4xl" />,
      title: "Vendas",
      value: totalVendas,
      color: "from-green-600 to-green-500",
      bgPattern: "bg-gradient-to-br",
    },
    {
      icon: <BsBoxSeam className="text-4xl" />,
      title: "Estoque",
      value: totalEstoque,
      suffix: " un.",
      color: "from-blue-600 to-blue-500",
      bgPattern: "bg-gradient-to-br",
    },
  ];

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#800020] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando dados...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Visão geral do seu negócio em tempo real
          </p>
        </div>

        <div className="mb-8">
          <div className={`relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl ${
            lucro >= 0 
              ? 'bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500' 
              : 'bg-gradient-to-br from-red-600 via-rose-500 to-pink-500'
          }`}>
            <div className="absolute top-0 right-0 opacity-10">
              {lucro >= 0 ? (
                <FiTrendingUp className="text-[200px]" />
              ) : (
                <FiTrendingDown className="text-[200px]" />
              )}
            </div>
            <div className="relative ">
              <div className="flex items-center gap-3 mb-4">
                {lucro >= 0 ? (
                  <GiReceiveMoney className="text-5xl" />
                ) : (
                  <GiPayMoney className="text-5xl" />
                )}
                <h2 className="text-3xl font-bold">
                  {lucro >= 0 ? 'Lucro Atual' : 'Prejuízo Atual'}
                </h2>
              </div>
              <p className="text-5xl font-black mb-2">
                R$ {Math.abs(lucro).toFixed(2).replace(".",",")}
              </p>
              <p className="text-lg opacity-90">
                {lucro >= 0 
                  ? '🎉 Seu negócio está lucrando!' 
                  : '⚠️ Atenção: investimento maior que vendas'}
              </p>
            </div>
          </div>
        </div>

<div className="mb-12">
  <div className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
    {cards.map((card, i) => (
      <div
        key={i}
        className={`min-w-[85%] snap-center relative overflow-hidden rounded-2xl p-6 text-white shadow-xl 
        ${card.bgPattern} ${card.color} transition-all duration-300`}
      >
        <div className="absolute top-0 right-0 opacity-20">
          <div className="text-8xl">{card.icon}</div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            {card.icon}
            <h3 className="text-xl font-semibold">{card.title}</h3>
          </div>

          <div className="mt-8">
            <p className="text-5xl font-bold">
              {card.suffix ? (
                <>
                  {card.value}
                  <span className="text-2xl ml-1">{card.suffix}</span>
                </>
              ) : (
                `R$ ${Number(card.value).toFixed(2).replace(".",",")}`
              )}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Desktop → Grid */}
  <div className="hidden md:grid grid-cols-3 gap-6">
    {cards.map((card, i) => (
      <div
        key={i}
        className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-xl 
        ${card.bgPattern} ${card.color} transition-all duration-300 hover:scale-105`}
      >
        <div className="absolute top-0 right-0 opacity-20">
          <div className="text-8xl">{card.icon}</div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            {card.icon}
            <h3 className="text-xl font-semibold">{card.title}</h3>
          </div>

          <div className="mt-8">
            <p className="text-5xl font-bold">
              {card.suffix ? (
                <>
                  {card.value}
                  <span className="text-2xl ml-1">{card.suffix}</span>
                </>
              ) : (
                `R$ ${Number(card.value).toFixed(2).replace(".",",")}`
              )}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


        {/* Tabela de Últimas Vendas */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
          <div className="bg-gradient-to-r from-[#800020] to-[#A04058] p-6">
            <h2 className="text-2xl font-bold text-white">
              Últimas Vendas Realizadas
            </h2>
            <p className="text-gray-100 text-sm mt-1">
              Acompanhe suas transações mais recentes
            </p>
          </div>
          
          <div className="p-3">
            {ultimasSaidas.length === 0 ? (
              <div className="text-center py-12">
                <BsBoxSeam className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Nenhuma venda realizada ainda
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  As vendas aparecerão aqui quando forem registradas
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-bold text-gray-700">Data</TableHead>
                    <TableHead className="font-bold text-gray-700">Cliente</TableHead>
                    <TableHead className="font-bold text-gray-700">Produto</TableHead>
                    <TableHead className="font-bold text-gray-700">Unidades</TableHead>
                    <TableHead className="font-bold text-gray-700 text-center">Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ultimasSaidas.map((saida) => (
                    <TableRow key={saida.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-gray-700">
                        {formatarData(saida.createdAt)}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {saida.cliente}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {saida.produto}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {saida.quantidade}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-bold text-green-600">
                        R$ {Number(saida.valorTotal || 0).toFixed(2).replace(".",",")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption className="text-gray-500 py-4">
                  Mostrando as {ultimasSaidas.length} vendas mais recentes
                </TableCaption>
              </Table>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              📊 Resumo Financeiro
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Investido:</span>
                <span className="font-bold text-red-600">
                  R$ {totalInvestimento.toFixed(2).replace(".",",")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total em Vendas:</span>
                <span className="font-bold text-green-600">
                  R$ {totalVendas.toFixed(2).replace(".",",")}
                </span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Resultado:</span>
                <span className={`font-bold text-lg ${lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {lucro >= 0 ? '+' : ''} R$ {lucro.toFixed(2).replace(".",",")}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              📦 Informações de Estoque
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Unidades Totais:</span>
                <span className="font-bold text-blue-600 text-center">
                  {totalEstoque} un.
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  totalEstoque > 50 
                    ? 'bg-green-100 text-green-800' 
                    : totalEstoque > 10 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {totalEstoque > 50 ? '✓ Estoque Alto' : totalEstoque > 10 ? '⚠ Estoque Médio' : '⚠ Estoque Baixo'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}