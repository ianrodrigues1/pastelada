import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  CreditCard,
  Mail,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { ApiErrorLog } from '../../types';

export const AdminApiErrorLogs: React.FC = () => {
  const [logs, setLogs] = useState<ApiErrorLog[]>(StoreService.getApiErrorLogs());
  const [serviceFilter, setServiceFilter] = useState<'all' | 'mercadopago' | 'resend' | 'other'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const refreshLogs = () => {
    setLogs(StoreService.getApiErrorLogs());
  };

  const handleResolve = (id: string) => {
    StoreService.resolveApiErrorLog(id, 'Proprietário');
    refreshLogs();
  };

  const handleDelete = (id: string) => {
    StoreService.deleteApiErrorLog(id, 'Proprietário');
    refreshLogs();
  };

  const handleClearResolved = () => {
    StoreService.clearResolvedApiErrorLogs('Proprietário');
    refreshLogs();
  };

  const handleSimulateError = (serviceType: 'mercadopago' | 'resend') => {
    const orders = StoreService.getOrders();
    const latestOrder = orders[0];

    if (serviceType === 'mercadopago') {
      StoreService.addApiErrorLog({
        service: 'mercadopago',
        serviceName: 'Mercado Pago (PIX)',
        action: 'Criação de Cobrança PIX',
        orderId: latestOrder?.id,
        orderCode: latestOrder?.code || 'SP-9999',
        customerName: latestOrder?.customerName || 'Cliente Teste',
        errorMessage: 'Token de Acesso rejeitado: [401 Unauthorized] Credencial inválida ou expirada.',
        errorCode: 'MP_AUTH_401',
        details: 'A chave configurada na aba Integrações não possui permissão para gerar cobrança ou expirou no painel do Mercado Pago.'
      });
    } else {
      StoreService.addApiErrorLog({
        service: 'resend',
        serviceName: 'Resend (E-mail Transacional)',
        action: 'Disparo de Confirmação de Pedido',
        orderId: latestOrder?.id,
        orderCode: latestOrder?.code || 'SP-9999',
        customerName: latestOrder?.customerName || 'Cliente Teste',
        errorMessage: 'Falha no envio: [403 Forbidden] O remetente informado não foi verificado na Resend.',
        errorCode: 'RESEND_SENDER_403',
        details: 'O e-mail configurado em EMAIL_FROM ainda não possui os apontamentos DNS SPF/DKIM validados no resend.com.'
      });
    }
    refreshLogs();
  };

  const unresolvedCount = logs.filter((l) => l.status === 'unresolved').length;

  const filteredLogs = logs.filter((log) => {
    const matchesService = serviceFilter === 'all' || log.service === serviceFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesSearch =
      searchTerm === '' ||
      log.errorMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.orderCode && log.orderCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.customerName && log.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.errorCode && String(log.errorCode).toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesService && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 font-dm text-xs">
      {/* Top Banner Alert if unresolved errors exist */}
      {unresolvedCount > 0 ? (
        <div className="card-hard bg-amber-50 border-l-8 border-l-red-600 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 border border-red-300 rounded text-red-700 shrink-0">
              <ShieldAlert size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-barlow font-black text-xl uppercase text-red-900 leading-tight">
                  Atenção: {unresolvedCount} falha(s) de API pendente(s) de revisão
                </h3>
                <span className="px-2 py-0.5 bg-red-600 text-white font-barlow font-bold text-[10px] uppercase rounded">
                  Requer Ação
                </span>
              </div>
              <p className="text-zinc-700 text-xs mt-1">
                Foram detectadas falhas em chamadas recentes do <strong>Mercado Pago</strong> ou <strong>Resend</strong>.
                Revise os detalhes abaixo para garantir que nenhum cliente fique sem confirmação de pagamento ou e-mail.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleClearResolved}
              className="px-3 py-2 bg-white hover:bg-zinc-100 text-zinc-800 border-2 border-[#24352b] font-barlow font-bold text-xs uppercase cursor-pointer"
            >
              Limpar Resolvidos
            </button>
          </div>
        </div>
      ) : (
        <div className="card-hard bg-emerald-50 border-l-8 border-l-emerald-600 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 border border-emerald-300 rounded text-emerald-800 shrink-0">
              <CheckCircle size={26} />
            </div>
            <div>
              <h3 className="font-barlow font-black text-xl uppercase text-emerald-900 leading-tight">
                Todas as integrações estão operando sem falhas
              </h3>
              <p className="text-emerald-700 text-xs mt-0.5">
                Não há registros de falhas ativas de Mercado Pago ou Resend no momento.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshLogs}
              className="p-2 bg-white hover:bg-emerald-100 text-emerald-900 border-2 border-[#24352b] font-barlow font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={14} /> Atualizar
            </button>
          </div>
        </div>
      )}

      {/* Control Bar: Filters & Action Buttons */}
      <div className="card-hard bg-[#fffaf2] p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código #SP, cliente, código de erro..."
              className="w-full pl-9 pr-3 py-2 border-2 border-[#24352b] bg-white text-xs"
            />
          </div>

          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value as typeof serviceFilter)}
            className="p-2 border-2 border-[#24352b] bg-white font-barlow font-bold text-xs uppercase cursor-pointer"
          >
            <option value="all">Todos os Serviços</option>
            <option value="mercadopago">Mercado Pago (PIX/Cartão)</option>
            <option value="resend">Resend (E-mails)</option>
            <option value="other">Outros</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="p-2 border-2 border-[#24352b] bg-white font-barlow font-bold text-xs uppercase cursor-pointer"
          >
            <option value="all">Todos os Status ({logs.length})</option>
            <option value="unresolved">Pendentes ({unresolvedCount})</option>
            <option value="resolved">Resolvidos ({logs.length - unresolvedCount})</option>
          </select>
        </div>

        {/* Test Simulator Buttons */}
        <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-zinc-200">
          <span className="text-[11px] text-zinc-500 font-bold uppercase hidden sm:inline">
            Testar Alertas:
          </span>
          <button
            onClick={() => handleSimulateError('mercadopago')}
            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-400 font-barlow font-bold text-[11px] uppercase flex items-center gap-1 cursor-pointer"
            title="Gera um registro simulado de falha de token no Mercado Pago para testar o painel"
          >
            <CreditCard size={13} /> + Simular Erro MP
          </button>
          <button
            onClick={() => handleSimulateError('resend')}
            className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-400 font-barlow font-bold text-[11px] uppercase flex items-center gap-1 cursor-pointer"
            title="Gera um registro simulado de falha de domínio no Resend para testar o painel"
          >
            <Mail size={13} /> + Simular Erro Resend
          </button>
        </div>
      </div>

      {/* Error Logs List */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="card-hard bg-[#fffaf2] p-12 text-center text-zinc-500">
            <Info size={32} className="mx-auto mb-2 text-zinc-400" />
            <p className="font-barlow font-bold text-base uppercase text-zinc-700">
              Nenhum registro encontrado para este filtro
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Altere os filtros acima ou utilize os botões de simulação para gerar um teste.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isUnresolved = log.status === 'unresolved';
            const isMercadoPago = log.service === 'mercadopago';
            const isResend = log.service === 'resend';

            return (
              <div
                key={log.id}
                className={`card-hard bg-[#fffaf2] p-5 transition border-l-8 ${
                  isUnresolved
                    ? 'border-l-red-600 bg-red-50/20'
                    : 'border-l-emerald-600 bg-zinc-50/50 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Service Badge */}
                    <span
                      className={`px-2.5 py-1 font-barlow font-bold text-[11px] uppercase rounded flex items-center gap-1.5 border ${
                        isMercadoPago
                          ? 'bg-blue-600 text-white border-blue-700'
                          : isResend
                          ? 'bg-purple-700 text-white border-purple-800'
                          : 'bg-zinc-800 text-white border-zinc-900'
                      }`}
                    >
                      {isMercadoPago && <CreditCard size={13} />}
                      {isResend && <Mail size={13} />}
                      {log.serviceName}
                    </span>

                    {/* Order Code Badge */}
                    {log.orderCode && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-barlow font-bold text-xs uppercase">
                        Pedido: {log.orderCode}
                      </span>
                    )}

                    {/* Error Code */}
                    {log.errorCode && (
                      <span className="font-mono text-[11px] bg-zinc-100 text-zinc-800 px-2 py-0.5 border border-zinc-300">
                        Código: {log.errorCode}
                      </span>
                    )}

                    {/* Resolution Status */}
                    {isUnresolved ? (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-300 font-barlow font-bold text-[10px] uppercase">
                        ⚠️ Não Resolvido
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-barlow font-bold text-[10px] uppercase flex items-center gap-1">
                        <CheckCircle size={11} /> Resolvido por {log.resolvedBy}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-zinc-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Body Details */}
                <div className="py-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-zinc-900 shrink-0">Ação:</span>
                    <span className="text-zinc-800 font-semibold">{log.action}</span>
                    {log.customerName && (
                      <span className="text-zinc-500">
                        (Cliente: <strong>{log.customerName}</strong>)
                      </span>
                    )}
                  </div>

                  <div className="p-3 bg-red-50 border border-red-200 text-red-900 font-medium rounded text-xs">
                    <strong>Mensagem de Erro:</strong> {log.errorMessage}
                  </div>

                  {log.details && (
                    <div className="text-zinc-600 text-xs bg-zinc-50 p-2.5 border border-zinc-200 rounded">
                      <strong className="text-zinc-800">Diagnóstico Técnico:</strong> {log.details}
                    </div>
                  )}

                  {/* Resolution Guidance Box for the Owner */}
                  <div className="bg-amber-50/80 border border-amber-300 p-3 rounded text-zinc-800 text-xs">
                    <strong className="text-amber-900 flex items-center gap-1 font-barlow font-bold uppercase mb-1">
                      <Info size={14} className="text-amber-700" />
                      Como o Dono deve Resolver:
                    </strong>
                    {isMercadoPago ? (
                      <p>
                        Acesse a aba <strong>&quot;Integrações (2FA)&quot;</strong> do painel e verifique se o{' '}
                        <strong>Access Token</strong> do Mercado Pago é válido. Se estiver em produção,
                        confirme que sua conta não possui pendências cadastrais em{' '}
                        <a
                          href="https://www.mercadopago.com.br/developers/panel/app"
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-700 underline font-bold"
                        >
                          mercadopago.com.br/developers
                        </a>
                        .
                      </p>
                    ) : isResend ? (
                      <p>
                        Verifique na aba <strong>&quot;Integrações&quot;</strong> se a chave{' '}
                        <code className="bg-white px-1 border border-amber-200 font-mono">re_...</code> do
                        Resend está correta e se o e-mail de envio{' '}
                        <code className="bg-white px-1 border border-amber-200 font-mono">pedidos@example.com</code>{' '}
                        foi cadastrado no{' '}
                        <a
                          href="https://resend.com/domains"
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-800 underline font-bold"
                        >
                          resend.com/domains
                        </a>
                        .
                      </p>
                    ) : (
                      <p>Verifique as configurações da integração correspondente no painel.</p>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-zinc-200 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-zinc-500 font-mono">
                    ID de Registro: <code className="bg-zinc-100 px-1 py-0.5 border border-zinc-300">{log.id}</code>
                  </div>

                  <div className="flex items-center gap-2">
                    {isUnresolved && (
                      <button
                        onClick={() => handleResolve(log.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-barlow font-bold text-xs uppercase flex items-center gap-1.5 border border-emerald-700 cursor-pointer"
                      >
                        <CheckCircle size={14} /> Marcar como Resolvido
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                      title="Excluir este registro"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
