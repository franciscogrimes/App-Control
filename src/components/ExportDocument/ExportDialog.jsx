// components/ExportButton/ExportDialog.jsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Table as TableIcon, Filter } from "lucide-react";
import { ExportFilters } from './ExportFilters';

export function ExportDialog({
  open,
  onOpenChange,
  onExport,
  data,
  title = "Exportar Relatório",
  description = "Configure os filtros e escolha o formato",
  filterConfig = {}
}) {
  const [step, setStep] = useState('filters'); // 'filters' ou 'format'
  const [filters, setFilters] = useState({});

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFormatSelect = (format) => {
    onExport(format, filters);
    setStep('filters');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 'filters' ? (
              <>
                <Filter className="h-5 w-5" />
                {title}
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                Escolher Formato
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === 'filters' 
              ? description
              : `Pronto para exportar os dados filtrados`}
          </DialogDescription>
        </DialogHeader>

        {step === 'filters' ? (
          <>
            <div className="py-4">
              <ExportFilters
                data={data}
                onFiltersChange={handleFiltersChange}
                filterConfig={filterConfig}
              />
            </div>
            
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => setStep('format')}
                disabled={data.length === 0}
              >
                Continuar
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="py-4">
              <div className="space-y-3">
                <Button
                  onClick={() => handleFormatSelect("excel")}
                  className="flex items-center justify-start gap-3 h-14 px-4 w-full"
                  variant="outline"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg">
                    <TableIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-gray-900">Excel (.xlsx)</p>
                    <p className="text-sm text-gray-500">Ideal para planilhas e análises</p>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handleFormatSelect("pdf")}
                  className="flex items-center justify-start gap-3 h-14 px-4 w-full"
                  variant="outline"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-red-50 rounded-lg">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-gray-900">PDF (.pdf)</p>
                    <p className="text-sm text-gray-500">Perfeito para impressão</p>
                  </div>
                </Button>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStep('filters')}
              >
                Voltar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}