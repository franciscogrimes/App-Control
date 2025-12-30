// components/ExportButton/exportUtils.js
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Exporta dados para Excel (.xlsx)
 */
export const exportToExcel = (data, config = {}) => {
  try {
    const { fileName = 'relatorio', sheetName = 'Dados' } = config;
    
    // Cria workbook e worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    // Gera arquivo Excel
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Salva o arquivo
    saveAs(blob, `${fileName}.xlsx`);
    return true;
  } catch (error) {
    console.error("Erro ao exportar Excel:", error);
    throw error;
  }
};

/**
 * Exporta dados para PDF (.pdf)
 */
export const exportToPDF = (data, headers, config = {}) => {
  try {
    const { 
      fileName = 'relatorio', 
      title = 'Relatório',
      filters = {},
      totalValor = 0 
    } = config;
    
    // Configura o PDF
    const doc = new jsPDF();
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    // Título
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    
    // Data de emissão
    doc.setFontSize(10);
    doc.text(`Emitido em: ${dataAtual}`, 14, 25);
    
    // Filtros aplicados
    let yPosition = 32;
    
    if (filters.dataInicio && filters.dataFim) {
      doc.text(`Período: ${formatarDataParaExibicao(filters.dataInicio)} à ${formatarDataParaExibicao(filters.dataFim)}`, 14, yPosition);
      yPosition += 7;
    }
    
    if (filters.fornecedor) {
      doc.text(`Fornecedor: ${filters.fornecedor}`, 14, yPosition);
      yPosition += 7;
    }
    
    if (filters.produto) {
      doc.text(`Produto: ${filters.produto}`, 14, yPosition);
      yPosition += 7;
    }
    
    const body = data.map(item =>
      headers.map(h => item[h] ?? '')
    );
    
    // Adiciona a tabela
    autoTable(doc, {
      head: [headers],
      body: body,
      startY: yPosition + 5,
      styles: { fontSize: 9 },
      headStyles: { 
        fillColor: [128, 0, 32], // #800020
        textColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
    });
    
    // Total de registros
    const finalY = doc.lastAutoTable.finalY || yPosition;
    doc.setFontSize(10);
    doc.text(
      `Total de registros: ${data.length}`,
      14,
      finalY + 10
    );
    
    // Total valor (se aplicável)
    if (totalValor > 0) {
      doc.text(
        `Valor Total: R$ ${totalValor.toFixed(2)}`,
        14,
        finalY + 17
      );
    }
    
    // Salva o PDF
    doc.save(`${fileName}.pdf`);
    return true;
  } catch (error) {
    console.error("Erro ao exportar PDF:", error);
    throw error;
  }
};

/**
 * Formata dados para exportação
 */
export const formatDataForExport = (data, columnMap) => {
  return data.map(item => {
    const formatted = {};
    
    Object.entries(columnMap).forEach(([key, config]) => {
      if (item[key] !== undefined && config.visible) {
        formatted[config.label] = config.format 
          ? config.format(item[key]) 
          : item[key];
      }
    });
    
    return formatted;
  });
};

export const filterData = (data, filters, options = {}) => {
  return data.filter(item => {
    if (!item.createdAt) return true; // Não descarta se não tiver data

    // Filtro por data
    if (filters.dataInicio || filters.dataFim) {
      try {
        const dataItem = item.createdAt?.toDate 
          ? item.createdAt.toDate()
          : new Date(item.createdAt);
        
        // Data início
        if (filters.dataInicio) {
          const inicio = new Date(filters.dataInicio + "T00:00:00");
          if (dataItem < inicio) return false;
        }
        
        // Data fim
        if (filters.dataFim) {
          const fim = new Date(filters.dataFim + "T23:59:59");
          if (dataItem > fim) return false;
        }
      } catch (error) {
        console.error('Erro ao filtrar por data:', error);
        return true; // Se erro, mantém o item
      }
    }

    // Filtro por cliente (somente se habilitado)
    if (options.enableCliente && filters.cliente && item.cliente) {
      if (item.cliente.toLowerCase() !== filters.cliente.toLowerCase()) {
        return false;
      }
    }

    // Filtro por fornecedor (somente se habilitado)
    if (options.enableFornecedor && filters.fornecedor && item.fornecedor) {
      if (item.fornecedor.toLowerCase() !== filters.fornecedor.toLowerCase()) {
        return false;
      }
    }

    // Filtro por produto
    if (filters.produto && item.produto) {
      if (item.produto.toLowerCase() !== filters.produto.toLowerCase()) {
        return false;
      }
    }

    return true;
  });
};




/**
 * Formata data para exibição (dd/mm/yyyy)
 */
const formatarDataParaExibicao = (dataString) => {
  if (!dataString) return '';
  const date = new Date(dataString);
  return date.toLocaleDateString('pt-BR');
};

/**
 * Calcula o total de valores
 */
export const calcularTotalValor = (data) => {
  return data.reduce((total, item) => {
    return total + (Number(item.valorPago) || 0);
  }, 0);
};