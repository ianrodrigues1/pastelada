import React, { useState } from 'react';
import {
  Clock,
  ChefHat,
  Truck,
  CheckCircle2,
  XCircle,
  Printer,
  Search,
  Volume2,
  VolumeX,
  Phone,
  Filter,
  AlertCircle
} from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { Order, OrderStatus } from '../../types';

interface AdminOrdersKanbanProps {
  onPrintOrder: (order: Order) => void;
  onViewOrderDetails: (order: Order) => void;
}

export const AdminOrdersKanban: React.FC<AdminOrdersKanbanProps> = ({
  onPrintOrder,
  onViewOrderDetails
}) => {
  const [orders, setOrders] = useState<Order[]>(StoreService.getOrders());
  const [search, setSearch] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const refreshOrders = () => {
    setOrders(StoreService.getOrders());
  };

  const handleUpdateStatus = (orderId: string, nextStatus: OrderStatus) => {
    StoreService.updateOrderStatus(orderId, nextStatus);
    refreshOrders();
  };

  const handleConfirmCancel = () => {
    if (!cancelModalOrder) return;
    StoreService.updateOrderStatus(
      cancelModalOrder.id,
      'cancelled',
      cancelReason.trim() || 'Cancelado pela administração'
    );
    setCancelModalOrder(null);
    setCancelReason('');
    refreshOrders();
  };

  // Filter orders by search
  const filtered = orders.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.code.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q)
    );
  });

  const columns: { status: OrderStatus; title: string; color: string; icon: React.ReactNode }[] = [
    {
      status: 'received',
      title: 'Novos / Recebidos',
      color: 'border-amber-500 bg-amber-50',
      icon: <Clock size={18} className="text-amber-700" />
    },
    {
      status: 'preparing',
      title: 'Em Preparo (Cozinha)',
      color: 'border-blue-500 bg-blue-50',
      icon: <ChefHat size={18} className="text-blue-700" />
    },
    {
      status: 'ready',
      title: 'Pronto / A Caminho',
      color: 'border-purple-500 bg-purple-50',
      icon: <Truck size={18} className="text-purple-700" />
    },
    {
      status: 'delivered',
      title: 'Entregues',
      color: 'border-emerald-500 bg-emerald-50',
      icon: <CheckCircle2 size={18} className="text-emerald-700" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#fffaf2] card-hard">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código (#SP-...) ou cliente..."
              className="w-full pl-9 pr-3 py-2 border-2 border-[#24352b] text-xs font-dm bg-white focus:outline-none"
            />
            <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 border-2 border-[#24352b] text-xs flex items-center gap-1.5 font-barlow font-bold uppercase cursor-pointer ${
              soundEnabled ? 'bg-[#e8874a] text-[#24352b]' : 'bg-zinc-200 text-zinc-600'
            }`}
            title="Alerta sonoro para novos pedidos"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="hidden sm:inline">{soundEnabled ? 'Som Ativo' : 'Som Mudo'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-dm text-zinc-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Tempo Real Ativo · Atualizações instantâneas</span>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colOrders = filtered.filter((o) => o.status === col.status);

          return (
            <div
              key={col.status}
              className="card-hard bg-[#fffaf2] flex flex-col max-h-[750px] overflow-hidden"
            >
              {/* Column Header */}
              <div
                className={`p-3 border-b-2 border-[#24352b] flex items-center justify-between ${col.color}`}
              >
                <div className="flex items-center gap-2">
                  {col.icon}
                  <h3 className="font-barlow font-black text-base uppercase text-[#24352b]">
                    {col.title}
                  </h3>
                </div>
                <span className="font-barlow font-black text-sm px-2 py-0.5 bg-[#24352b] text-white">
                  {colOrders.length}
                </span>
              </div>

              {/* Order Cards List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-zinc-50/50">
                {colOrders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-400 font-dm">
                    Nenhum pedido aqui
                  </div>
                ) : (
                  colOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 bg-white border-2 border-[#24352b] shadow-[2px_2px_0px_#24352b] flex flex-col justify-between hover:border-black transition"
                    >
                      <div>
                        {/* Header card */}
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-barlow font-black text-lg text-[#24352b] block leading-tight">
                              #{ord.code}
                            </span>
                            <span className="font-dm text-xs text-zinc-600 font-bold block">
                              {ord.customerName}
                            </span>
                          </div>
                          <span className="font-barlow font-black text-base text-[#24352b]">
                            R$ {ord.total.toFixed(2).replace('.', ',')}
                          </span>
                        </div>

                        {/* Order type & payment */}
                        <div className="flex items-center gap-2 text-[10px] font-dm text-zinc-600 mb-2">
                          <span className="font-bold uppercase px-1.5 py-0.5 bg-zinc-100 border border-zinc-300">
                            {ord.deliveryMethod === 'delivery' ? 'Entrega' : 'Retirada'}
                          </span>
                          <span className="uppercase">
                            {ord.paymentMethod.replace('_', ' ')}
                          </span>
                          {ord.paymentStatus === 'pending' && (
                            <span className="text-amber-700 font-bold">PIX Pendente</span>
                          )}
                        </div>

                        {/* Items list */}
                        <div className="text-xs font-dm text-zinc-800 space-y-1 my-2 py-2 border-y border-zinc-100">
                          {ord.items.map((it, i) => (
                            <div key={i} className="line-clamp-1">
                              <strong>{it.quantity}x</strong> {it.productName} ({it.sizeName})
                            </div>
                          ))}
                        </div>

                        {/* Notes */}
                        {ord.notes && (
                          <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 border border-amber-200 mb-2">
                            Obs: {ord.notes}
                          </div>
                        )}
                      </div>

                      {/* Card actions */}
                      <div className="mt-3 pt-2 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-1.5">
                        <div className="flex gap-1">
                          <button
                            onClick={() => onPrintOrder(ord)}
                            title="Imprimir Comanda"
                            className="p-1.5 border border-zinc-300 hover:border-black bg-white cursor-pointer"
                          >
                            <Printer size={14} />
                          </button>
                          <a
                            href={`https://wa.me/55${ord.customerPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="WhatsApp do Cliente"
                            className="p-1.5 border border-zinc-300 hover:border-black bg-white cursor-pointer text-emerald-700"
                          >
                            <Phone size={14} />
                          </a>
                        </div>

                        {/* Next status action */}
                        {col.status === 'received' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'preparing')}
                            className="px-2.5 py-1 bg-blue-600 text-white font-barlow font-bold text-xs uppercase hover:bg-blue-700 cursor-pointer"
                          >
                            Iniciar Preparo
                          </button>
                        )}
                        {col.status === 'preparing' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'ready')}
                            className="px-2.5 py-1 bg-purple-600 text-white font-barlow font-bold text-xs uppercase hover:bg-purple-700 cursor-pointer"
                          >
                            {ord.deliveryMethod === 'delivery' ? 'Despachar' : 'Pronto'}
                          </button>
                        )}
                        {col.status === 'ready' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'delivered')}
                            className="px-2.5 py-1 bg-emerald-600 text-white font-barlow font-bold text-xs uppercase hover:bg-emerald-700 cursor-pointer"
                          >
                            Concluir Entrega
                          </button>
                        )}
                        {col.status !== 'delivered' && (
                          <button
                            onClick={() => setCancelModalOrder(ord)}
                            className="text-[10px] text-red-600 hover:underline uppercase font-bold"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancel Order Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="bg-white card-hard p-6 max-w-md w-full space-y-4">
            <h3 className="font-barlow font-black text-xl uppercase text-red-700">
              Cancelar Pedido #{cancelModalOrder.code}
            </h3>
            <p className="font-dm text-xs text-zinc-600">
              Informe o motivo do cancelamento para registrar na auditoria e no histórico do
              cliente:
            </p>
            <input
              type="text"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Ex: Cliente solicitou, item esgotado, endereço fora de alcance..."
              className="w-full p-2.5 border-2 border-zinc-300 text-xs font-dm"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 border border-zinc-300 text-xs font-dm font-bold"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-700 text-white font-barlow font-bold text-sm uppercase hover:bg-red-800"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
