import React, { useState } from 'react';
import { Shield, Search, Filter } from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { AuditLog } from '../../types';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(StoreService.getAuditLogs());
  const [filterUser, setFilterUser] = useState('');

  const filtered = logs.filter((l) =>
    filterUser ? l.userName.toLowerCase().includes(filterUser.toLowerCase()) : true
  );

  return (
    <div className="space-y-6 font-dm text-xs">
      <div className="card-hard bg-[#fffaf2] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} className="text-[#24352b]" />
            <h3 className="font-barlow font-black text-2xl uppercase text-[#24352b]">
              Trilha de Auditoria Imutável (Seção 13.6)
            </h3>
          </div>
          <p className="text-zinc-600">
            Registro cronológico protegido contra alterações de todas as operações administrativas,
            alterações de preços, status de pedidos e chaves.
          </p>
        </div>

        <input
          type="text"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          placeholder="Filtrar por usuário..."
          className="p-2 border-2 border-[#24352b] bg-white text-xs w-60"
        />
      </div>

      <div className="card-hard bg-[#fffaf2] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-100 border-b-2 border-[#24352b] font-barlow font-black uppercase text-zinc-800">
                <th className="p-3">Data e Hora</th>
                <th className="p-3">Usuário</th>
                <th className="p-3">Ação Realizada</th>
                <th className="p-3">Entidade</th>
                <th className="p-3">Valor Anterior / Novo</th>
                <th className="p-3">IP Registrado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-amber-50/50">
                  <td className="p-3 font-mono text-zinc-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="p-3 font-bold text-zinc-900">
                    {log.userName}{' '}
                    <span className="text-[10px] text-zinc-500 font-normal">({log.userRole})</span>
                  </td>
                  <td className="p-3 font-semibold text-[#24352b]">{log.action}</td>
                  <td className="p-3 text-zinc-600">{log.entity}</td>
                  <td className="p-3 text-zinc-500 max-w-sm truncate">
                    {log.newValue ? log.newValue : log.previousValue || '—'}
                  </td>
                  <td className="p-3 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
