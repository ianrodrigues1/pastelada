import React from 'react';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Download,
  Calendar,
  CreditCard
} from 'lucide-react';
import { StoreService } from '../../services/storeService';

export const AdminReports: React.FC = () => {
  const orders = StoreService.getOrders();

  const totalRevenue = orders.reduce(
    (acc, o) => (o.status !== 'cancelled' ? acc + o.total : acc),
    0
  );
  const validOrdersCount = orders.filter((o) => o.status !== 'cancelled').length;
  const avgTicket = validOrdersCount > 0 ? totalRevenue / validOrdersCount : 0;

  // Breakdown by payment
  const paymentBreakdown = orders.reduce((acc, o) => {
    acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + o.total;
    return acc;
  }, {} as Record<string, number>);

  const handleExportCsv = () => {
    const headers = ['Codigo', 'Data', 'Cliente', 'Telefone', 'Status', 'Metodo_Pagamento', 'Total'];
    const rows = orders.map((o) => [
      o.code,
      new Date(o.createdAt).toLocaleDateString('pt-BR'),
      `"${o.customerName.replace(/"/g, '""')}"`,
      o.customerPhone,
      o.status,
      o.paymentMethod,
      o.total.toFixed(2)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio-vendas-pastelada-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-dm text-xs">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card-hard bg-[#fffaf2] p-5">
          <div className="flex justify-between items-start text-zinc-500 mb-2">
            <span className="font-barlow font-bold text-sm uppercase">Faturamento Total</span>
            <DollarSign size={18} className="text-emerald-600" />
          </div>
          <span className="font-barlow font-black text-3xl sm:text-4xl text-[#24352b]">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[11px] text-zinc-500 block mt-1">
            {validOrdersCount} pedidos concluídos ou em andamento
          </span>
        </div>

        <div className="card-hard bg-[#fffaf2] p-5">
          <div className="flex justify-between items-start text-zinc-500 mb-2">
            <span className="font-barlow font-bold text-sm uppercase">Ticket Médio</span>
            <TrendingUp size={18} className="text-[#e8874a]" />
          </div>
          <span className="font-barlow font-black text-3xl sm:text-4xl text-[#24352b]">
            R$ {avgTicket.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[11px] text-zinc-500 block mt-1">
            Meta operacional: R$ 40,00 – R$ 60,00
          </span>
        </div>

        <div className="card-hard bg-[#fffaf2] p-5">
          <div className="flex justify-between items-start text-zinc-500 mb-2">
            <span className="font-barlow font-bold text-sm uppercase">Volume de Pedidos</span>
            <ShoppingBag size={18} className="text-blue-600" />
          </div>
          <span className="font-barlow font-black text-3xl sm:text-4xl text-[#24352b]">
            {orders.length}
          </span>
          <span className="text-[11px] text-zinc-500 block mt-1">
            {orders.filter((o) => o.status === 'cancelled').length} cancelados
          </span>
        </div>
      </div>

      {/* Reports Actions */}
      <div className="card-hard bg-[#fffaf2] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-barlow font-black text-xl uppercase text-[#24352b]">
            Exportação de Dados para Contabilidade
          </h4>
          <p className="text-zinc-600 mt-0.5">
            Faça download da planilha completa de vendas no formato CSV com todos os detalhes
            fiscais e de entrega.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="btn-hard bg-[#e8874a] text-[#24352b] px-4 py-2.5 text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Download size={16} /> Exportar Relatório CSV
        </button>
      </div>

      {/* Payment Methods breakdown */}
      <div className="card-hard bg-[#fffaf2] p-5 space-y-4">
        <h4 className="font-barlow font-black text-lg uppercase text-[#24352b]">
          Faturamento por Forma de Pagamento
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(paymentBreakdown).map(([method, val]) => (
            <div key={method} className="p-3 bg-zinc-50 border border-zinc-200">
              <span className="font-barlow font-bold uppercase text-xs text-zinc-600 block">
                {method.replace('_', ' ')}
              </span>
              <span className="font-barlow font-black text-xl text-[#24352b] block mt-1">
                R$ {val.toFixed(2).replace('.', ',')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
