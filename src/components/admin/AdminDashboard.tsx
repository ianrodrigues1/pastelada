import React, { useState } from 'react';
import {
  ShoppingBag,
  UtensilsCrossed,
  Clock,
  Users,
  BarChart3,
  KeyRound,
  Shield,
  FileText,
  ArrowLeft,
  PauseCircle,
  PlayCircle,
  Printer,
  AlertTriangle,
  X
} from 'lucide-react';

import { StoreService } from '../../services/storeService';
import { Order, User } from '../../types';
import { AdminOrdersKanban } from './AdminOrdersKanban';
import { AdminMenuManager } from './AdminMenuManager';
import { AdminStoreSettings } from './AdminStoreSettings';
import { AdminTeamManager } from './AdminTeamManager';
import { AdminReports } from './AdminReports';
import { AdminIntegrations } from './AdminIntegrations';
import { AdminApiErrorLogs } from './AdminApiErrorLogs';
import { AdminAuditLogs } from './AdminAuditLogs';
import { AdminLgpdManager } from './AdminLgpdManager';
import { AdminDocsViewer } from './AdminDocsViewer';

interface AdminDashboardProps {
  onBackToSite: () => void;
  currentUser: User | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToSite,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'orders'
    | 'menu'
    | 'store'
    | 'team'
    | 'reports'
    | 'integrations'
    | 'api-errors'
    | 'audit'
    | 'lgpd'
    | 'docs'
  >('orders');

  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const settings = StoreService.getSettings();
  const unresolvedErrors = StoreService.getUnresolvedApiErrorCount();

  const handlePrint = (order: Order) => {
    setPrintOrder(order);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#f8f1e7] flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-[#24352b] text-[#fffaf2] border-b-4 border-[#e8874a] py-4 px-4 sm:px-8 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded border border-zinc-700 flex items-center gap-1.5 font-barlow font-bold text-xs uppercase cursor-pointer"
            >
              <ArrowLeft size={16} /> Ver Site do Cliente
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-barlow font-black text-2xl uppercase tracking-wider text-[#e8874a]">
                  Painel de Gestão
                </span>
                <span className="font-barlow font-bold text-xs uppercase px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {currentUser?.role || 'ADMIN'}
                </span>
              </div>
              <span className="font-dm text-xs text-zinc-400">
                Logado como: <strong>{currentUser?.name}</strong> ({currentUser?.email})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {unresolvedErrors > 0 && (
              <button
                onClick={() => setActiveTab('api-errors')}
                className="bg-red-600 hover:bg-red-500 text-white font-barlow font-black uppercase text-xs px-3 py-1.5 border border-black flex items-center gap-1.5 animate-pulse cursor-pointer shadow-sm"
                title="Clique para revisar falhas de chamadas às APIs de pagamento e e-mail"
              >
                <AlertTriangle size={15} />
                <span>{unresolvedErrors} Falha(s) de API</span>
              </button>
            )}

            {settings.isPaused && (
              <span className="bg-red-600 text-white font-barlow font-black uppercase text-xs px-3 py-1 animate-pulse border border-black">
                Loja Pausada para Pedidos
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Admin Tab Navigation Bar */}
      <div className="bg-[#fffaf2] border-b-2 border-[#24352b] shadow-xs px-4 sm:px-8 shrink-0 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1">
          {[
            { id: 'orders', label: 'Pedidos ao Vivo', icon: <ShoppingBag size={16} /> },
            { id: 'menu', label: 'Cardápio & Preços', icon: <UtensilsCrossed size={16} /> },
            { id: 'store', label: 'Loja & Horários', icon: <Clock size={16} /> },
            { id: 'team', label: 'Equipe & Permissões', icon: <Users size={16} /> },
            { id: 'reports', label: 'Relatórios de Vendas', icon: <BarChart3 size={16} /> },
            { id: 'integrations', label: 'Integrações (2FA)', icon: <KeyRound size={16} /> },
            {
              id: 'api-errors',
              label: 'Falhas de APIs',
              icon: <AlertTriangle size={16} className={unresolvedErrors > 0 ? 'text-red-600' : ''} />,
              badge: unresolvedErrors > 0 ? unresolvedErrors : undefined
            },
            { id: 'audit', label: 'Trilha de Auditoria', icon: <Shield size={16} /> },
            { id: 'lgpd', label: 'LGPD & Titulares', icon: <FileText size={16} /> },
            { id: 'docs', label: 'Documentação / Guias', icon: <FileText size={16} /> }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-3 px-3.5 font-barlow font-bold text-xs uppercase flex items-center gap-1.5 shrink-0 border-b-3 transition cursor-pointer relative ${
                  isActive
                    ? 'border-[#e8874a] text-[#24352b] bg-amber-50/80 font-black'
                    : 'border-transparent text-zinc-600 hover:text-black hover:bg-zinc-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[10px] font-black leading-tight">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {activeTab === 'orders' && (
          <AdminOrdersKanban
            onPrintOrder={handlePrint}
            onViewOrderDetails={(ord) => setPrintOrder(ord)}
          />
        )}
        {activeTab === 'menu' && <AdminMenuManager />}
        {activeTab === 'store' && <AdminStoreSettings />}
        {activeTab === 'team' && <AdminTeamManager />}
        {activeTab === 'reports' && <AdminReports />}
        {activeTab === 'integrations' && <AdminIntegrations />}
        {activeTab === 'api-errors' && <AdminApiErrorLogs />}
        {activeTab === 'audit' && <AdminAuditLogs />}
        {activeTab === 'lgpd' && <AdminLgpdManager />}
        {activeTab === 'docs' && <AdminDocsViewer />}
      </main>


      {/* Hidden Printable Receipt for Thermal Printing */}
      {printOrder && (
        <div id="printable-receipt" className="hidden print:block">
          <div className="text-center pb-2 border-b border-black">
            <h2 className="text-base font-bold uppercase">{settings.name}</h2>
            <p className="text-[10px]">{settings.address}</p>
            <p className="text-[10px]">Hortolândia - SP · Tel: {settings.phone}</p>
            <p className="text-xs font-bold mt-1">COMANDA #{printOrder.code}</p>
            <p className="text-[10px]">
              {new Date(printOrder.createdAt).toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="py-2 border-b border-black text-xs">
            <p><strong>Cliente:</strong> {printOrder.customerName}</p>
            <p><strong>Tel:</strong> {printOrder.customerPhone}</p>
            <p><strong>Tipo:</strong> {printOrder.deliveryMethod.toUpperCase()}</p>
            {printOrder.deliveryAddress && (
              <p>
                <strong>Endereço:</strong> {printOrder.deliveryAddress.street},{' '}
                {printOrder.deliveryAddress.number}
                <br />Bairro: {printOrder.deliveryAddress.neighborhood}
              </p>
            )}
          </div>

          <div className="py-2 border-b border-black">
            <p className="text-xs font-bold uppercase mb-1">Itens:</p>
            {printOrder.items.map((item, idx) => (
              <div key={idx} className="text-[11px] mb-1">
                <div className="flex justify-between">
                  <span>{item.quantity}x {item.productName} ({item.sizeName})</span>
                  <span>R$ {item.subtotal.toFixed(2)}</span>
                </div>
                {item.filling && <div className="pl-2">- Recheio: {item.filling}</div>}
                {item.complements && item.complements.length > 0 && (
                  <div className="pl-2">- Comp: {item.complements.join(', ')}</div>
                )}
                {item.extras && item.extras.length > 0 && (
                  <div className="pl-2">- Ext: {item.extras.join(', ')}</div>
                )}
                {item.notes && <div className="pl-2 font-bold">- Obs: {item.notes}</div>}
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>R$ {printOrder.subtotal.toFixed(2)}</span>
            </div>
            {printOrder.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span>Taxa Entrega:</span>
                <span>R$ {printOrder.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            {printOrder.discount > 0 && (
              <div className="flex justify-between">
                <span>Desconto:</span>
                <span>- R$ {printOrder.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm pt-1 border-t border-black">
              <span>TOTAL:</span>
              <span>R$ {printOrder.total.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-center mt-2">
              Pagamento: {printOrder.paymentMethod.toUpperCase()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
