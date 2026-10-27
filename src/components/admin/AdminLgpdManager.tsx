import React, { useState } from 'react';
import { ShieldCheck, Check, Clock, UserX, Download } from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { LgpdDataRequest } from '../../types';

export const AdminLgpdManager: React.FC = () => {
  const [requests, setRequests] = useState<LgpdDataRequest[]>(StoreService.getDataRequests());
  const consents = StoreService.getConsents();
  const settings = StoreService.getSettings();

  const handleCompleteRequest = (reqId: string) => {
    const list = StoreService.getDataRequests();
    const target = list.find((r) => r.id === reqId);
    if (target) {
      target.status = 'completed';
      target.completedAt = new Date().toISOString();
      localStorage.setItem('pastelada_data_requests_v1', JSON.stringify(list));
      setRequests([...list]);
    }
  };

  return (
    <div className="space-y-6 font-dm text-xs">
      <div className="card-hard bg-[#fffaf2] p-5">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={20} className="text-[#24352b]" />
          <h3 className="font-barlow font-black text-2xl uppercase text-[#24352b]">
            Painel do Encarregado de Dados (DPO) & LGPD
          </h3>
        </div>
        <p className="text-zinc-600">
          Atendimento a solicitações de titulares (Art. 18 da LGPD - Lei 13.709/2018). Canal oficial:{' '}
          <strong className="text-zinc-900">{settings.dpoEmail}</strong>.
        </p>
      </div>

      {/* Requests table */}
      <div className="card-hard bg-[#fffaf2] overflow-hidden">
        <div className="p-3 bg-zinc-50 border-b-2 border-[#24352b] font-barlow font-bold uppercase text-zinc-700">
          Solicitações de Titulares ({requests.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-100 border-b-2 border-[#24352b] font-barlow font-black uppercase text-zinc-800">
                <th className="p-3">Data</th>
                <th className="p-3">Titular</th>
                <th className="p-3">E-mail</th>
                <th className="p-3">Tipo de Solicitação</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-zinc-500">
                    Nenhuma solicitação pendente no momento.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id}>
                    <td className="p-3 font-mono text-zinc-500">
                      {new Date(r.requestedAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-3 font-bold text-zinc-900">{r.customerName}</td>
                    <td className="p-3 text-zinc-600">{r.customerEmail}</td>
                    <td className="p-3">
                      <span className="font-barlow font-bold uppercase px-2 py-0.5 bg-zinc-100 border border-zinc-300">
                        {r.requestType === 'export_data'
                          ? 'Exportação (Portabilidade)'
                          : r.requestType === 'delete_account'
                          ? 'Exclusão / Anonimização'
                          : 'Revogação de Consentimento'}
                      </span>
                    </td>
                    <td className="p-3">
                      {r.status === 'completed' ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check size={14} /> Atendida
                        </span>
                      ) : (
                        <span className="text-amber-700 font-bold flex items-center gap-1">
                          <Clock size={14} /> Pendente
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {r.status === 'pending' && (
                        <button
                          onClick={() => handleCompleteRequest(r.id)}
                          className="btn-hard bg-[#e8874a] text-[#24352b] px-3 py-1 text-xs cursor-pointer"
                        >
                          Concluir Atendimento
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consent registry stats */}
      <div className="card-hard bg-[#fffaf2] p-5">
        <h4 className="font-barlow font-black text-lg uppercase text-[#24352b] mb-2">
          Registro Geral de Consentimentos de Cookies
        </h4>
        <p className="text-zinc-600 mb-4">
          Total de registros de consentimento armazenados na tabela <code>consents</code>:{' '}
          <strong>{consents.length}</strong>
        </p>
      </div>
    </div>
  );
};
