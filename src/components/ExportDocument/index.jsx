// components/ExportButton/index.jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ExportDialog } from './ExportDialog';
import { exportToExcel, exportToPDF, formatDataForExport, filterData } from './exportUtils';

export function ExportButton({
  data,
  columns,
  fileName = 'relatorio',
  title = 'Relatório',
  disabled = false,
  onExportStart,
  onExportComplete,
  className = '',
  buttonLabel = 'Exportar',
  showIcon = true,
  filterConfig = {
    showFornecedor: true,
    showCliente: false,
    showProduto: true
  }
}) {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format, filters) => {
    try {
      setExporting(true);
      if (onExportStart) onExportStart();
      
      // Aplica filtros aos dados
      const dataFiltrada = filterData(data, filters, {
        enableCliente: filterConfig.showCliente,
        enableFornecedor: filterConfig.showFornecedor
      });
      
      if (dataFiltrada.length === 0) {
        alert('Nenhum dado encontrado com os filtros aplicados!');
        return;
      }
      
      // Formata dados para exportação
      const formattedData = formatDataForExport(dataFiltrada, columns);
      
      // Obtém cabeçalhos para PDF
      const headers = Object.values(columns)
        .filter(col => col.visible)
        .map(col => col.label);

      // Calcula total de valores (ajusta para cliente ou fornecedor)
      const valorField = filterConfig.showCliente ? 'valorTotal' : 'valorPago';
      const totalValor = dataFiltrada.reduce((total, item) => {
        return total + (Number(item[valorField]) || 0);
      }, 0);

      // Formata datas para exibição
      const filtersFormatados = {
        ...filters,
        dataInicio: filters.dataInicio ? new Date(filters.dataInicio).toLocaleDateString('pt-BR') : '',
        dataFim: filters.dataFim ? new Date(filters.dataFim).toLocaleDateString('pt-BR') : ''
      };

      const config = {
        fileName: `${fileName}_${new Date().toISOString().split('T')[0]}`,
        title,
        filters: filtersFormatados,
        totalValor,
        filterConfig // Passa a configuração para o PDF
      };

      let success = false;
      
      if (format === 'excel') {
        success = exportToExcel(formattedData, config);
      } else if (format === 'pdf') {
        success = exportToPDF(formattedData, headers, config);
      }

      if (onExportComplete) onExportComplete(success);
      
      if (!success) {
        throw new Error(`Falha ao exportar para ${format}`);
      }
      
      setExportDialogOpen(false);
    } catch (error) {
      console.error('Erro na exportação:', error);
      if (onExportComplete) onExportComplete(false);
      alert(`Erro ao exportar: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleClick = () => {
    if (data.length === 0) {
      alert('Não há dados para exportar!');
      return;
    }
    setExportDialogOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={disabled || exporting || data.length === 0}
        className={`bg-green-600 hover:bg-green-700 gap-2 ${className}`}
        variant="default"
      >
        {showIcon && <Download className="h-4 w-4" />}
        {exporting ? 'Exportando...' : buttonLabel}
      </Button>

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        onExport={handleExport}
        data={data}
        title={`Exportar ${title}`}
        description={`Configure os filtros para o relatório`}
        filterConfig={filterConfig}
      />
    </>
  );
}