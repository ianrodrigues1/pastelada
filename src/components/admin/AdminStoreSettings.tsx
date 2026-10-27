import React, { useState } from 'react';
import {
  Save,
  Clock,
  MapPin,
  PauseCircle,
  PlayCircle,
  LogOut,
  Palette,
  Check,
  AlertTriangle,
  Building,
  Phone,
  Instagram
} from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { DeliveryZone, StoreSettings } from '../../types';

export const AdminStoreSettings: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>(StoreService.getSettings());
  const [zones, setZones] = useState<DeliveryZone[]>(StoreService.getDeliveryZones());
  const [notice, setNotice] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StoreService.updateSettings(settings);
    StoreService.saveDeliveryZones(zones);
    setNotice('Configurações da loja e horários salvos com sucesso!');
    setTimeout(() => setNotice(null), 4000);
  };

  const handleToggleStorePause = () => {
    const updated = StoreService.toggleStorePause(
      !settings.isPaused,
      !settings.isPaused ? 'Pausa temporária de pedidos pela cozinha' : undefined
    );
    setSettings(updated);
    setNotice(
      updated.isPaused
        ? 'Loja PAUSADA com sucesso! Novos pedidos no site foram bloqueados.'
        : 'Loja REABERTA! Pedidos online liberados novamente.'
    );
    setTimeout(() => setNotice(null), 5000);
  };

  const handleTerminateAllSessions = () => {
    if (
      window.confirm(
        'Tem certeza que deseja encerrar todas as sessões ativas? Todos os funcionários e administradores precisarão fazer login novamente.'
      )
    ) {
      StoreService.terminateAllSessions();
      setNotice('Todas as sessões ativas foram encerradas.');
      setTimeout(() => setNotice(null), 4000);
    }
  };

  return (
    <form onSubmit={handleSaveSettings} className="space-y-8 font-dm text-xs">
      {notice && (
        <div className="p-3 bg-emerald-100 border-2 border-emerald-600 text-emerald-950 flex items-center gap-2">
          <Check size={16} className="text-emerald-700 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Emergency Center (Seção 13.6) */}
      <div className="card-hard bg-[#fffaf2] p-6 border-l-8 border-l-red-600 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={22} className="text-red-600" />
          <h3 className="font-barlow font-black text-2xl uppercase text-[#24352b]">
            Botões de Emergência Operacional
          </h3>
        </div>
        <p className="text-zinc-600">
          Controles rápidos para pausas de cozinha em dias de alto movimento ou incidentes de
          segurança.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            type="button"
            onClick={handleToggleStorePause}
            className={`btn-hard px-5 py-3 text-sm flex items-center gap-2 cursor-pointer ${
              settings.isPaused
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {settings.isPaused ? (
              <>
                <PlayCircle size={18} /> Reabrir Loja (Retomar Pedidos)
              </>
            ) : (
              <>
                <PauseCircle size={18} /> Pausar Loja Agora (Bloquear Pedidos)
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleTerminateAllSessions}
            className="btn-hard bg-zinc-800 text-white hover:bg-black px-5 py-3 text-sm flex items-center gap-2 cursor-pointer"
          >
            <LogOut size={18} /> Encerrar Todas as Sessões Ativas
          </button>
        </div>
      </div>

      {/* General Store Details */}
      <div className="card-hard bg-[#fffaf2] p-6 space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Building size={20} className="text-[#24352b]" />
          <h3 className="font-barlow font-black text-xl uppercase text-[#24352b]">
            Identidade do Estabelecimento (White-Label)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="font-bold text-zinc-700 block mb-1">Nome do Restaurante *</label>
            <input
              type="text"
              required
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full p-2 border border-zinc-300"
            />
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">Segmento / Especialidade</label>
            <input
              type="text"
              value={settings.segment}
              onChange={(e) => setSettings({ ...settings, segment: e.target.value })}
              className="w-full p-2 border border-zinc-300"
            />
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">Telefone / WhatsApp *</label>
            <input
              type="text"
              required
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full p-2 border border-zinc-300"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-zinc-700 block mb-1">Endereço Completo *</label>
            <input
              type="text"
              required
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full p-2 border border-zinc-300"
            />
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">CEP e Cidade</label>
            <input
              type="text"
              value={`${settings.cep} — ${settings.city}/${settings.state}`}
              disabled
              className="w-full p-2 border border-zinc-200 bg-zinc-50"
            />
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">Link do Instagram</label>
            <input
              type="text"
              value={settings.instagramUrl}
              onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
              className="w-full p-2 border border-zinc-300"
            />
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">E-mail do DPO (LGPD)</label>
            <input
              type="email"
              value={settings.dpoEmail}
              onChange={(e) => setSettings({ ...settings, dpoEmail: e.target.value })}
              className="w-full p-2 border border-zinc-300"
            />
          </div>

          <div>
            <label className="font-bold text-zinc-700 block mb-1">Tempo Médio de Preparo</label>
            <input
              type="text"
              value={settings.prepTimeMinutes}
              onChange={(e) => setSettings({ ...settings, prepTimeMinutes: e.target.value })}
              placeholder="25-40 min"
              className="w-full p-2 border border-zinc-300"
            />
          </div>
        </div>
      </div>

      {/* Business Hours Configuration (Horários de Funcionamento) */}
      <div className="card-hard bg-[#fffaf2] p-6 space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Clock size={20} className="text-[#24352b]" />
          <h3 className="font-barlow font-black text-xl uppercase text-[#24352b]">
            Horários de Funcionamento & Pedidos Online
          </h3>
        </div>
        <p className="text-zinc-600">
          O sistema de checkout online respeita rigorosamente esses horários.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: 'seg', label: 'Segunda a Quinta' },
            { key: 'sex', label: 'Sexta-feira' },
            { key: 'sab', label: 'Sábado' },
            { key: 'dom', label: 'Domingo' }
          ].map((day) => {
            const current = settings.businessHours[day.key] || {
              open: '17:00',
              close: '22:45',
              isOpenToday: true
            };

            return (
              <div key={day.key} className="p-3 border-2 border-zinc-200 bg-zinc-50 space-y-2">
                <span className="font-barlow font-bold text-sm uppercase block text-zinc-900">
                  {day.label}
                </span>

                <div className="flex items-center gap-2">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Abre:</span>
                    <input
                      type="text"
                      value={current.open}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          businessHours: {
                            ...settings.businessHours,
                            [day.key]: { ...current, open: e.target.value }
                          }
                        })
                      }
                      className="w-full p-1.5 border border-zinc-300 text-center font-mono font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 block">Fecha:</span>
                    <input
                      type="text"
                      value={current.close}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          businessHours: {
                            ...settings.businessHours,
                            [day.key]: { ...current, close: e.target.value }
                          }
                        })
                      }
                      className="w-full p-1.5 border border-zinc-300 text-center font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Zones in Hortolândia */}
      <div className="card-hard bg-[#fffaf2] p-6 space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <MapPin size={20} className="text-[#24352b]" />
          <h3 className="font-barlow font-black text-xl uppercase text-[#24352b]">
            Taxas de Entrega por Bairro (Hortolândia-SP)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {zones.map((zone, idx) => (
            <div key={zone.id} className="p-3 border-2 border-zinc-200 bg-zinc-50 space-y-1.5">
              <span className="font-bold text-zinc-900 block">{zone.neighborhood}</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-600">Taxa (R$):</span>
                <input
                  type="number"
                  step="0.5"
                  value={zone.fee}
                  onChange={(e) => {
                    const newZones = [...zones];
                    newZones[idx].fee = Number(e.target.value);
                    setZones(newZones);
                  }}
                  className="w-24 p-1 border border-zinc-300 text-center font-bold"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-hard bg-[#e8874a] text-[#24352b] px-8 py-3 text-base flex items-center gap-2 cursor-pointer"
        >
          <Save size={18} /> Salvar Todas as Configurações
        </button>
      </div>
    </form>
  );
};
