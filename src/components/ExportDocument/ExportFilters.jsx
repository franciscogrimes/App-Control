// components/ExportButton/ExportFilters.jsx
import { useState } from 'react';
import { Calendar } from 'lucide-react';

export function ExportFilters({
  data,
  onFiltersChange,
  initialFilters = {},
  filterConfig = {
    showFornecedor: true,   // Para Entradas
    showCliente: false,     // Para Saídas
    showProduto: true
  }
}) {
  const [filters, setFilters] = useState({
    dataInicio: initialFilters.dataInicio || '',
    dataFim: initialFilters.dataFim || '',
    fornecedor: initialFilters.fornecedor || '',
    cliente: initialFilters.cliente || '',
    produto: initialFilters.produto || ''
  });

  // Extrai fornecedores únicos dos dados (se mostrar fornecedor)
  const fornecedoresUnicos = filterConfig.showFornecedor 
    ? [...new Set(data
        .filter(item => item.fornecedor)
        .map(item => item.fornecedor)
      )].sort()
    : [];

  // Extrai clientes únicos dos dados (se mostrar cliente)
  const clientesUnicos = filterConfig.showCliente
    ? [...new Set(data
        .filter(item => item.cliente)
        .map(item => item.cliente)
      )].sort()
    : [];

  // Extrai produtos únicos dos dados
  const produtosUnicos = filterConfig.showProduto
    ? [...new Set(data
        .filter(item => item.produto)
        .map(item => item.produto)
      )].sort()
    : [];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      dataInicio: '',
      dataFim: '',
      fornecedor: '',
      cliente: '',
      produto: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filtro por Período */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Calendar className="inline-block w-4 h-4 mr-1" />
            Período
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={filters.dataInicio}
              onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <span className="self-center text-gray-500">até</span>
            <input
              type="date"
              value={filters.dataFim}
              onChange={(e) => handleFilterChange('dataFim', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        {/* Filtro por Fornecedor (somente se showFornecedor = true) */}
        {filterConfig.showFornecedor && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Fornecedor
            </label>
            <select
              value={filters.fornecedor}
              onChange={(e) => handleFilterChange('fornecedor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Todos os fornecedores</option>
              {fornecedoresUnicos.map((fornecedor) => (
                <option key={fornecedor} value={fornecedor}>
                  {fornecedor}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filtro por Cliente (somente se showCliente = true) */}
        {filterConfig.showCliente && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Cliente
            </label>
            <select
              value={filters.cliente}
              onChange={(e) => handleFilterChange('cliente', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Todos os clientes</option>
              {clientesUnicos.map((cliente) => (
                <option key={cliente} value={cliente}>
                  {cliente}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filtro por Produto (somente se showProduto = true) */}
        {filterConfig.showProduto && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Produto
            </label>
            <select
              value={filters.produto}
              onChange={(e) => handleFilterChange('produto', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Todos os produtos</option>
              {produtosUnicos.map((produto) => (
                <option key={produto} value={produto}>
                  {produto}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Botão Limpar Filtros */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 opacity-0">
            Limpar
          </label>
          <button
            type="button"
            onClick={clearFilters}
            className="w-full px-3 py-2 bg-gray-100 text-gray-700 border border-gray-300 
                     rounded-md text-sm hover:bg-gray-200 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
        <strong>Dados disponíveis:</strong> {data.length} registro(s)
        {filters.dataInicio && filters.dataFim && (
          <span className="ml-4">
            Período selecionado: {new Date(filters.dataInicio).toLocaleDateString('pt-BR')} à {new Date(filters.dataFim).toLocaleDateString('pt-BR')}
          </span>
        )}
        {filters.fornecedor && filterConfig.showFornecedor && (
          <span className="ml-4">Fornecedor: {filters.fornecedor}</span>
        )}
        {filters.cliente && filterConfig.showCliente && (
          <span className="ml-4">Cliente: {filters.cliente}</span>
        )}
        {filters.produto && filterConfig.showProduto && (
          <span className="ml-4">Produto: {filters.produto}</span>
        )}
      </div>
    </div>
  );
}