import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  MapPin,
  Clock,
  Shield,
  Download,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Plus
} from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { Address, CartItem, Order, User } from '../../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogout: () => void;
  onReorder: (order: Order) => void;
  onOpenPrivacy: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onReorder,
  onOpenPrivacy
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'lgpd'>('orders');
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const orders = StoreService.getOrders().filter(
    (o) =>
      (currentUser && o.userId === currentUser.id) ||
      (currentUser && o.customerEmail?.toLowerCase() === currentUser.email.toLowerCase())
  );

  const handleExportData = () => {
    if (!currentUser) return;
    const jsonStr = StoreService.exportUserData(currentUser.email);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meus-dados-pastelada-${currentUser.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice('Arquivo com todos os seus dados pessoais e histórico foi baixado com sucesso!');
    setTimeout(() => setExportNotice(null), 5000);
  };

  const handleAnonymizeAccount = () => {
    if (!currentUser) return;
    StoreService.anonymizeUserData(currentUser.email);
    StoreService.createDataRequest(currentUser.name, currentUser.email, 'delete_account');
    onLogout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#fffaf2] card-hard-lg my-8 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#e8874a] border-b-[3px] border-[#24352b] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#24352b] text-[#e8874a] flex items-center justify-center font-barlow font-black text-xl border-2 border-[#fffaf2]">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="font-barlow font-black text-2xl uppercase text-[#24352b] leading-none">
                {currentUser?.name || 'Minha Conta'}
              </h2>
              <span className="font-dm text-xs font-bold text-zinc-800">
                {currentUser?.email || 'Cliente'} · {currentUser?.role || 'CLIENTE'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border-2 border-[#24352b] bg-[#fffaf2] hover:bg-zinc-100 shadow-[2px_2px_0px_#24352b] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b-2 border-[#24352b] bg-[#f8f1e7] px-6 gap-2 shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 font-barlow font-bold uppercase text-sm border-b-3 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#24352b] text-[#24352b] bg-[#fffaf2]'
                : 'border-transparent text-zinc-600 hover:text-black'
            }`}
          >
            Meus Pedidos ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 font-barlow font-bold uppercase text-sm border-b-3 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#24352b] text-[#24352b] bg-[#fffaf2]'
                : 'border-transparent text-zinc-600 hover:text-black'
            }`}
          >
            Dados Pessoais
          </button>

          <button
            onClick={() => setActiveTab('lgpd')}
            className={`py-3 px-3 font-barlow font-bold uppercase text-sm border-b-3 cursor-pointer ${
              activeTab === 'lgpd'
                ? 'border-[#24352b] text-[#24352b] bg-[#fffaf2]'
                : 'border-transparent text-zinc-600 hover:text-black'
            }`}
          >
            Privacidade & LGPD
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f8f1e7]/40 space-y-6">
          {/* TAB 1: MEUS PEDIDOS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="font-barlow font-black text-xl uppercase text-[#24352b]">
                Histórico de Pedidos
              </h3>

              {orders.length === 0 ? (
                <div className="p-10 text-center bg-[#fffaf2] border-2 border-[#24352b]">
                  <Clock size={36} className="mx-auto text-zinc-400 mb-2" />
                  <p className="font-barlow font-bold text-xl uppercase text-zinc-700">
                    Você ainda não fez nenhum pedido
                  </p>
                  <p className="font-dm text-xs text-zinc-500 mt-1">
                    Seus pedidos feitos no site com esta conta aparecerão aqui para você acompanhar
                    ou pedir de novo com 1 clique!
                  </p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 bg-[#fffaf2] border-2 border-[#24352b] shadow-[3px_3px_0px_#24352b] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-barlow font-black text-xl text-[#24352b]">
                          #{ord.code}
                        </span>
                        <span className="text-[11px] font-bold font-dm px-2 py-0.5 border border-[#24352b] bg-[#e8874a]">
                          {ord.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-zinc-500 font-dm">
                          · {new Date(ord.createdAt).toLocaleDateString('pt-BR')} às{' '}
                          {new Date(ord.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <div className="text-xs font-dm text-zinc-700 space-y-0.5">
                        {ord.items.map((it, i) => (
                          <div key={i}>
                            • {it.quantity}x {it.productName} ({it.sizeName}){' '}
                            {it.filling && `- ${it.filling}`}
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 text-xs font-bold text-zinc-900">
                        Total Pago: R$ {ord.total.toFixed(2).replace('.', ',')} (
                        {ord.paymentMethod.toUpperCase()})
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onReorder(ord);
                          onClose();
                        }}
                        className="btn-hard bg-[#e8874a] text-[#24352b] px-4 py-2 text-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw size={16} /> Pedir de Novo
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === 'profile' && (
            <div className="p-6 bg-[#fffaf2] border-2 border-[#24352b] space-y-4">
              <h3 className="font-barlow font-black text-xl uppercase text-[#24352b]">
                Seus Dados Cadastrais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-dm">
                <div>
                  <span className="font-bold text-zinc-700 block">Nome:</span>
                  <div className="p-2.5 bg-zinc-50 border border-zinc-300 mt-1 font-medium">
                    {currentUser?.name || 'Não informado'}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-zinc-700 block">E-mail:</span>
                  <div className="p-2.5 bg-zinc-50 border border-zinc-300 mt-1 font-medium">
                    {currentUser?.email || 'Não informado'}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-zinc-700 block">Telefone / WhatsApp:</span>
                  <div className="p-2.5 bg-zinc-50 border border-zinc-300 mt-1 font-medium">
                    {currentUser?.phone || '(19) 98203-4637'}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-zinc-700 block">Cidade / Região:</span>
                  <div className="p-2.5 bg-zinc-50 border border-zinc-300 mt-1 font-medium">
                    Hortolândia - SP
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LGPD PRIVACY SELF SERVICE */}
          {activeTab === 'lgpd' && (
            <div className="space-y-6">
              {exportNotice && (
                <div className="p-3 bg-emerald-100 border-2 border-emerald-600 text-emerald-950 text-xs font-dm flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>{exportNotice}</span>
                </div>
              )}

              {/* Data Portability / Export */}
              <div className="p-6 bg-[#fffaf2] border-2 border-[#24352b] shadow-[3px_3px_0px_#24352b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-barlow font-black text-lg uppercase text-[#24352b] flex items-center gap-2">
                    <Download size={18} /> Direito à Portabilidade de Dados (Art. 18 LGPD)
                  </h4>
                  <p className="font-dm text-xs text-zinc-600 mt-1 max-w-xl">
                    Baixe uma cópia estruturada em JSON contendo todos os seus dados cadastrais,
                    pedidos realizados e registros de consentimento mantidos pelo Pastelada.
                  </p>
                </div>

                <button
                  onClick={handleExportData}
                  className="btn-hard bg-[#e8874a] text-[#24352b] px-4 py-2 text-sm shrink-0 cursor-pointer"
                >
                  Exportar Meus Dados (JSON)
                </button>
              </div>

              {/* Account Deletion & Anonymization */}
              <div className="p-6 bg-[#fffaf2] border-2 border-red-700 shadow-[3px_3px_0px_#b91c1c] space-y-4">
                <div>
                  <h4 className="font-barlow font-black text-lg uppercase text-red-700 flex items-center gap-2">
                    <Trash2 size={18} /> Direito de Eliminação & Anonimização (Art. 18, VI LGPD)
                  </h4>
                  <p className="font-dm text-xs text-zinc-600 mt-1 max-w-xl">
                    Ao solicitar a exclusão da sua conta, seus dados pessoais (nome, telefone,
                    e-mail e endereço) serão permanentemente anonimizados, mantendo apenas os
                    registros fiscais e contábeis estritamente exigidos pela legislação vigente.
                  </p>
                </div>

                {deleteConfirmation ? (
                  <div className="p-4 bg-red-50 border border-red-400 space-y-3">
                    <p className="text-xs font-bold text-red-900">
                      Tem certeza que deseja apagar sua conta? Essa ação não pode ser desfeita.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAnonymizeAccount}
                        className="bg-red-700 text-white font-barlow font-bold text-xs uppercase px-4 py-2 border border-black hover:bg-red-800"
                      >
                        Confirmar e Anonimizar Meus Dados
                      </button>
                      <button
                        onClick={() => setDeleteConfirmation(false)}
                        className="bg-zinc-200 text-zinc-800 font-barlow font-bold text-xs uppercase px-4 py-2"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmation(true)}
                    className="border-2 border-red-700 text-red-700 hover:bg-red-50 font-barlow font-bold text-xs uppercase px-4 py-2 cursor-pointer"
                  >
                    Solicitar Exclusão da Minha Conta
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#fffaf2] border-t-3 border-[#24352b] flex items-center justify-between shrink-0">
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs font-barlow uppercase font-bold text-red-700 hover:underline cursor-pointer"
          >
            <LogOut size={16} /> Encerrar Sessão
          </button>

          <button
            onClick={onClose}
            className="btn-hard bg-[#24352b] text-[#fffaf2] hover:bg-zinc-800 px-6 py-2 text-sm cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
