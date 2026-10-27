import React, { useState } from 'react';
import {
  CreditCard,
  Mail,
  KeyRound,
  ShieldCheck,
  HardDrive,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Copy,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { IntegrationConfig } from '../../types';

export const AdminIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>(
    StoreService.getIntegrations()
  );
  const [showKeyMap, setShowKeyMap] = useState<Record<string, boolean>>({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const refreshData = () => {
    setIntegrations(StoreService.getIntegrations());
  };

  const toggleShowKey = (id: string) => {
    setShowKeyMap((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleFieldChange = (id: string, field: keyof IntegrationConfig, value: string) => {
    setIntegrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveItem = (item: IntegrationConfig) => {
    StoreService.saveIntegration(item, 'Ian Felipe (Proprietário)');
    refreshData();
    setNotice(`Chaves de "${item.providerName}" salvas com sucesso!`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleSaveAll = () => {
    integrations.forEach((item) => {
      StoreService.saveIntegration(item, 'Ian Felipe (Proprietário)');
    });
    refreshData();
    setNotice('Todas as chaves e integrações foram salvas com sucesso!');
    setTimeout(() => setNotice(null), 4000);
  };

  const handleTestConnection = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      const res = StoreService.testIntegration(id);
      setTestingId(null);
      refreshData();
      setNotice(res.message);
      setTimeout(() => setNotice(null), 4000);
    }, 500);
  };

  const handlePreFillSandbox = () => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === 'int-payment') {
          return {
            ...item,
            environment: 'sandbox',
            apiKey: '',
            publicKey: '',
            webhookSecret: '',
            pixKey: '+5519982034637'
          };
        }
        if (item.id === 'int-email') {
          return {
            ...item,
            apiKey: '',
            senderEmail: 'pedidos@example.com'
          };
        }
        if (item.id === 'int-google') {
          return {
            ...item,
            clientId: '',
            clientSecret: ''
          };
        }
        return item;
      })
    );
    setNotice('Chaves de Sandbox/Teste preenchidas! Clique em "Salvar Todas" para ativar.');
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="space-y-6 font-dm text-xs">
      {notice && (
        <div className="p-3 bg-emerald-100 border-2 border-emerald-600 text-emerald-950 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Top Banner & Quick Actions */}
      <div className="card-hard bg-[#fffaf2] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <KeyRound size={20} className="text-[#24352b]" />
            <h3 className="font-barlow font-black text-2xl uppercase text-[#24352b]">
              Chaves de API & Credenciais do Negócio
            </h3>
          </div>
          <p className="text-zinc-600">
            Preencha e edite diretamente as credenciais do <strong>Mercado Pago</strong> (para o dinheiro cair na sua conta),
            do <strong>Resend</strong> (para e-mails) e do <strong>Google Cloud</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePreFillSandbox}
            className="btn-hard bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-3.5 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} className="text-amber-600" />
            Preencher Chaves de Teste
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="btn-hard bg-[#e8874a] text-[#24352b] px-5 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save size={16} /> Salvar Todas as Chaves
          </button>
        </div>
      </div>

      {/* Direct Editing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((item) => {
          const isRevealed = !!showKeyMap[item.id];

          return (
            <div
              key={item.id}
              className="card-hard bg-[#fffaf2] p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Card Title & Status */}
                <div className="flex items-start justify-between pb-3 border-b border-zinc-200">
                  <div>
                    <h4 className="font-barlow font-black text-xl uppercase text-[#24352b]">
                      {item.providerName}
                    </h4>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                      Serviço: {item.service}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.environment && (
                      <select
                        value={item.environment}
                        onChange={(e) =>
                          handleFieldChange(item.id, 'environment', e.target.value as 'sandbox' | 'production')
                        }
                        className={`text-[10px] font-bold uppercase p-1 border font-barlow ${
                          item.environment === 'production'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                            : 'bg-amber-100 text-amber-900 border-amber-400'
                        }`}
                      >
                        <option value="sandbox">Sandbox (Teste)</option>
                        <option value="production">Produção (Real)</option>
                      </select>
                    )}

                    <span
                      className={`px-2 py-0.5 font-barlow font-bold text-xs uppercase border ${
                        item.status === 'connected'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-red-100 text-red-900 border-red-300'
                      }`}
                    >
                      {item.status === 'connected' ? 'Conectado' : 'Pendente'}
                    </span>
                  </div>
                </div>

                {/* Editable Inputs for this integration */}
                <div className="pt-3 space-y-3">
                  {/* MERCADO PAGO FIELDS */}
                  {item.service === 'payment' && (
                    <>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-bold text-zinc-800">
                            Access Token (Chave de Liquidação do PIX e Cartão) *
                          </label>
                          <button
                            type="button"
                            onClick={() => toggleShowKey(item.id)}
                            className="text-zinc-500 hover:text-black flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                            {isRevealed ? 'Ocultar' : 'Visualizar'}
                          </button>
                        </div>
                        <input
                          type={isRevealed ? 'text' : 'password'}
                          value={item.apiKey || ''}
                          onChange={(e) => handleFieldChange(item.id, 'apiKey', e.target.value)}
                          placeholder="APP_USR-0000000000000000 ou TEST-..."
                          className="w-full p-2 border-2 border-zinc-300 font-mono text-xs focus:border-[#24352b] focus:outline-none bg-white"
                        />
                        <span className="text-[10px] text-zinc-500 mt-0.5 block">
                          Obtenha no painel do Mercado Pago em: Seu Negócio &gt; Configurações &gt; Credenciais.
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-zinc-800 block mb-1">
                            Public Key (Chave Pública do Checkout)
                          </label>
                          <input
                            type="text"
                            value={item.publicKey || ''}
                            onChange={(e) => handleFieldChange(item.id, 'publicKey', e.target.value)}
                            placeholder="APP_USR-00000000-0000-0000..."
                            className="w-full p-2 border-2 border-zinc-300 font-mono text-xs focus:border-[#24352b] focus:outline-none bg-white"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-zinc-800 block mb-1">
                            Chave PIX Oficial da Pastelaria
                          </label>
                          <input
                            type="text"
                            value={item.pixKey || '+5519982034637'}
                            onChange={(e) => handleFieldChange(item.id, 'pixKey', e.target.value)}
                            placeholder="+5519982034637 ou CNPJ"
                            className="w-full p-2 border-2 border-zinc-300 font-mono text-xs focus:border-[#24352b] focus:outline-none bg-white font-bold text-[#24352b]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-zinc-800 block mb-1">
                          Webhook Secret (Assinatura de Confirmação Automática)
                        </label>
                        <input
                          type={isRevealed ? 'text' : 'password'}
                          value={item.webhookSecret || ''}
                          onChange={(e) => handleFieldChange(item.id, 'webhookSecret', e.target.value)}
                          placeholder="whsec_00000000000000000000000000000000"
                          className="w-full p-2 border-2 border-zinc-300 font-mono text-xs focus:border-[#24352b] focus:outline-none bg-white"
                        />
                      </div>
                    </>
                  )}

                  {/* RESEND EMAIL FIELDS */}
                  {item.service === 'email' && (
                    <>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-bold text-zinc-800">
                            API Key do Resend (E-mail Transacional) *
                          </label>
                          <button
                            type="button"
                            onClick={() => toggleShowKey(item.id)}
                            className="text-zinc-500 hover:text-black flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                            {isRevealed ? 'Ocultar' : 'Visualizar'}
                          </button>
                        </div>
                        <input
                          type={isRevealed ? 'text' : 'password'}
                          value={item.apiKey || ''}
                          onChange={(e) => handleFieldChange(item.id, 'apiKey', e.target.value)}
                          placeholder="re_00000000_000000000000000000000000"
                          className="w-full p-2 border-2 border-zinc-300 font-mono text-xs focus:border-[#24352b] focus:outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-zinc-800 block mb-1">
                          E-mail do Remetente (De:)
                        </label>
                        <input
                          type="email"
                          value={item.senderEmail || 'pedidos@example.com'}
                          onChange={(e) => handleFieldChange(item.id, 'senderEmail', e.target.value)}
                          placeholder="pedidos@example.com"
                          className="w-full p-2 border-2 border-zinc-300 font-mono text-xs focus:border-[#24352b] focus:outline-none bg-white"
                        />
                      </div>
                    </>
                  )}

                  {/* GOOGLE CLOUD OAUTH FIELDS */}
                  {item.service === 'google_oauth' && (
                    <>
                      <div>
                        <label className="font-bold text-zinc-800 block mb-1">
                          Google Client ID *
                        </label>
                        <input
                          type="text"
                          value={item.clientId || item.apiKey || ''}
                          onChange={(e) => {
                            handleFieldChange(item.id, 'clientId', e.target.value);
                            handleFieldChange(item.id, 'apiKey', e.target.value);
                          }}
                          placeholder="client-id.apps.googleusercontent.com"
                          className="w-full p-2 border-2 border-zinc-300 font-mono text-xs focus:border-[#24352b] focus:outline-none bg-white"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-bold text-zinc-800">Google Client Secret *</label>
                          <button
                            type="button"
                            onClick={() => toggleShowKey(item.id)}
                            className="text-zinc-500 hover:text-black flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                            {isRevealed ? 'Ocultar' : 'Visualizar'}
                          </button>
                        </div>
                        <input
                          type={isRevealed ? 'text' : 'password'}
                          value={item.clientSecret || ''}
                          onChange={(e) => handleFieldChange(item.id, 'clientSecret', e.target.value)}
                          placeholder="Cole o client secret do Google"
                          className="w-full p-2 border-2 border-zinc-300 font-mono text-xs focus:border-[#24352b] focus:outline-none bg-white"
                        />
                      </div>
                    </>
                  )}

                  {/* STORAGE / ENCRYPTION FIELDS */}
                  {(item.service === 'storage' || item.service === 'encryption') && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-bold text-zinc-800">
                          {item.service === 'encryption'
                            ? 'Chave Mestra AES-256-GCM (Servidor)'
                            : 'Token / Access Key'}
                        </label>
                        <button
                          type="button"
                          onClick={() => toggleShowKey(item.id)}
                          className="text-zinc-500 hover:text-black flex items-center gap-1 text-[11px] cursor-pointer"
                        >
                          {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                          {isRevealed ? 'Ocultar' : 'Visualizar'}
                        </button>
                      </div>
                      <input
                        type={isRevealed ? 'text' : 'password'}
                        value={item.apiKey || ''}
                        onChange={(e) => handleFieldChange(item.id, 'apiKey', e.target.value)}
                        placeholder="Chave 256 bits..."
                        className="w-full p-2 border-2 border-zinc-300 font-mono text-xs focus:border-[#24352b] focus:outline-none bg-white"
                      />
                    </div>
                  )}

                  {/* Last tested info */}
                  {item.lastTestedAt && (
                    <div className="text-[10px] text-zinc-500 pt-1">
                      Último teste validado: {new Date(item.lastTestedAt).toLocaleString('pt-BR')}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons for this card */}
              <div className="flex items-center gap-2 pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => handleTestConnection(item.id)}
                  disabled={testingId === item.id}
                  className="flex-1 p-2 border-2 border-zinc-300 hover:border-black font-barlow font-bold uppercase text-xs flex items-center justify-center gap-1 bg-white cursor-pointer"
                >
                  <RefreshCw size={14} className={testingId === item.id ? 'animate-spin' : ''} />
                  {testingId === item.id ? 'Testando Conexão...' : 'Testar Conexão'}
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveItem(item)}
                  className="btn-hard bg-[#e8874a] text-[#24352b] px-5 py-2 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Save size={14} /> Salvar Chave
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
