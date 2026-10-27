import React, { useState } from 'react';
import {
  UserPlus,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  Mail,
  Check,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { StaffInvite, StaffPermission, User, UserRole } from '../../types';

export const AdminTeamManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>(StoreService.getUsers());
  const [invites, setInvites] = useState<StaffInvite[]>(StoreService.getInvites());

  // Invite modal state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('STAFF');
  const [selectedPermissions, setSelectedPermissions] = useState<StaffPermission[]>([
    'pedidos.ver',
    'pedidos.alterar_status'
  ]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const refreshData = () => {
    setUsers(StoreService.getUsers());
    setInvites(StoreService.getInvites());
  };

  const allPermissions: { key: StaffPermission; label: string; sensitive?: boolean }[] = [
    { key: 'pedidos.ver', label: 'Visualizar Pedidos' },
    { key: 'pedidos.alterar_status', label: 'Alterar Status do Pedido (Cozinha/Entrega)' },
    { key: 'pedidos.cancelar', label: 'Cancelar Pedidos' },
    { key: 'cardapio.editar', label: 'Editar Produtos do Cardápio' },
    { key: 'precos.editar', label: 'Alterar Preços dos Pastéis' },
    { key: 'ingredientes.editar', label: 'Editar Recheios e Adicionais' },
    { key: 'conteudo_site.editar', label: 'Editar Textos e Fotos (Modo Edição)' },
    { key: 'loja.configurar', label: 'Alterar Horários e Taxas de Entrega' },
    { key: 'cupons.gerenciar', label: 'Criar e Gerenciar Cupons' },
    { key: 'relatorios.ver', label: 'Visualizar Relatórios Financeiros' },
    { key: 'clientes.ver', label: 'Visualizar Base de Clientes' },
    { key: 'lgpd.atender', label: 'Atender Pedidos LGPD' },
    { key: 'equipe.gerenciar', label: 'Convidar e Alterar Equipe', sensitive: true },
    { key: 'pagamentos.configurar', label: 'Alterar Contas de Pagamento', sensitive: true },
    { key: 'integracoes.gerenciar', label: 'Alterar Chaves de Integração (2FA)', sensitive: true }
  ];

  const handleApplyPreset = (preset: 'Gerente' | 'Atendente' | 'Cozinha' | 'Marketing') => {
    if (preset === 'Gerente') {
      setInviteRole('ADMIN');
      setSelectedPermissions([
        'pedidos.ver',
        'pedidos.alterar_status',
        'pedidos.cancelar',
        'cardapio.editar',
        'precos.editar',
        'ingredientes.editar',
        'conteudo_site.editar',
        'loja.configurar',
        'cupons.gerenciar',
        'relatorios.ver',
        'clientes.ver',
        'lgpd.atender'
      ]);
    } else if (preset === 'Atendente') {
      setInviteRole('STAFF');
      setSelectedPermissions(['pedidos.ver', 'pedidos.alterar_status', 'clientes.ver']);
    } else if (preset === 'Cozinha') {
      setInviteRole('STAFF');
      setSelectedPermissions(['pedidos.ver', 'pedidos.alterar_status']);
    } else if (preset === 'Marketing') {
      setInviteRole('STAFF');
      setSelectedPermissions(['conteudo_site.editar', 'cupons.gerenciar', 'cardapio.editar']);
    }
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) return;

    StoreService.createInvite({
      email: inviteEmail.trim().toLowerCase(),
      role: inviteRole,
      permissions: selectedPermissions,
      invitedBy: 'Ian Felipe (Proprietário)'
    });

    setInviteEmail('');
    setShowInviteModal(false);
    refreshData();
    setNotice(`Convite enviado com sucesso para ${inviteEmail}!`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleDeactivate = (userId: string) => {
    if (window.confirm('Deseja realmente revogar o acesso deste funcionário imediatamente?')) {
      StoreService.deactivateUser(userId);
      refreshData();
      setNotice('Acesso do funcionário revogado com sucesso. Sessão derrubada.');
      setTimeout(() => setNotice(null), 4000);
    }
  };

  return (
    <div className="space-y-6 font-dm text-xs">
      {notice && (
        <div className="p-3 bg-emerald-100 border-2 border-emerald-600 text-emerald-950 flex items-center gap-2">
          <Check size={16} className="text-emerald-700 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Header and Invite Trigger */}
      <div className="card-hard bg-[#fffaf2] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-barlow font-black text-2xl uppercase text-[#24352b]">
            Gestão de Equipe & Permissões Granulares
          </h3>
          <p className="text-zinc-600 mt-0.5">
            Convide funcionários para operar pedidos, cozinha ou editar o cardápio sem expor
            finanças ou configurações sensíveis.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="btn-hard bg-[#e8874a] text-[#24352b] px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <UserPlus size={16} /> Convidar Funcionário
        </button>
      </div>

      {/* Active Team Members Table */}
      <div className="card-hard bg-[#fffaf2] overflow-hidden">
        <div className="p-3 bg-zinc-50 border-b-2 border-[#24352b] font-barlow font-bold uppercase text-zinc-700">
          Membros da Equipe Ativos
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-100 border-b-2 border-[#24352b] font-barlow font-black uppercase text-zinc-800">
                <th className="p-3">Nome / Usuário</th>
                <th className="p-3">E-mail</th>
                <th className="p-3">Papel (Role)</th>
                <th className="p-3">2FA</th>
                <th className="p-3">Permissões</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {users
                .filter((u) => u.role !== 'CLIENTE')
                .map((u) => (
                  <tr key={u.id} className="hover:bg-amber-50/50">
                    <td className="p-3 font-bold text-zinc-900">{u.name}</td>
                    <td className="p-3 text-zinc-600">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 font-barlow font-bold text-xs uppercase border ${
                          u.role === 'OWNER'
                            ? 'bg-[#24352b] text-[#e8874a] border-black'
                            : u.role === 'ADMIN'
                            ? 'bg-amber-200 text-amber-900 border-amber-400'
                            : 'bg-zinc-200 text-zinc-800 border-zinc-400'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      {u.twoFactorEnabled ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check size={14} /> Ativo
                        </span>
                      ) : (
                        <span className="text-zinc-400">Pendente</span>
                      )}
                    </td>
                    <td className="p-3 text-zinc-500 max-w-xs truncate">
                      {u.role === 'OWNER'
                        ? 'Controle Total (Todas as permissões)'
                        : `${u.permissions.length} permissões concedidas`}
                    </td>
                    <td className="p-3 text-right">
                      {u.role !== 'OWNER' && u.active ? (
                        <button
                          onClick={() => handleDeactivate(u.id)}
                          className="text-red-700 hover:underline font-bold"
                        >
                          Revogar Acesso
                        </button>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <form
            onSubmit={handleSendInvite}
            className="bg-white card-hard max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-barlow font-black text-xl uppercase text-[#24352b]">
                Convidar Novo Funcionário
              </h3>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="p-1 border border-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">
                  E-mail Google do Funcionário *
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="funcionario@gmail.com"
                  className="w-full p-2 border border-zinc-300"
                />
              </div>

              {/* Presets */}
              <div>
                <span className="font-bold text-zinc-700 block mb-1">Modelos Prontos de Função:</span>
                <div className="grid grid-cols-4 gap-2">
                  {(['Gerente', 'Atendente', 'Cozinha', 'Marketing'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className="p-1.5 border border-zinc-300 hover:border-black font-barlow font-bold text-xs uppercase text-center bg-zinc-50"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Granular Checkboxes */}
              <div>
                <span className="font-bold text-zinc-700 block mb-2">Permissões Selecionadas:</span>
                <div className="max-h-48 overflow-y-auto border p-2 space-y-1.5 bg-zinc-50">
                  {allPermissions.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.key);

                    return (
                      <label
                        key={perm.key}
                        className={`flex items-center gap-2 cursor-pointer p-1 rounded ${
                          perm.sensitive ? 'bg-amber-100/60 font-semibold' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPermissions([...selectedPermissions, perm.key]);
                            } else {
                              setSelectedPermissions(
                                selectedPermissions.filter((p) => p !== perm.key)
                              );
                            }
                          }}
                          className="rounded text-[#e8874a]"
                        />
                        <span className="text-[11px] text-zinc-800">
                          {perm.label}
                          {perm.sensitive && (
                            <span className="ml-1 text-[10px] text-red-700 font-bold">
                              [Sensível]
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 border text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-hard bg-[#e8874a] text-[#24352b] px-5 py-2 text-xs cursor-pointer"
              >
                Gerar Convite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
