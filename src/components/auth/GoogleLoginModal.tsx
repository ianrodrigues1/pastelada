import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Check,
  AlertCircle,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { User, UserRole } from '../../types';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenPrivacy,
  onOpenTerms
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleAuth = (selectedEmail?: string, selectedName?: string) => {
    setErrorMsg(null);
    const targetEmail = (selectedEmail || email).trim().toLowerCase();
    const targetName = selectedName || name.trim() || targetEmail.split('@')[0];

    if (!targetEmail || !targetEmail.includes('@')) {
      setErrorMsg('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    if (!acceptedTerms) {
      setErrorMsg('É necessário aceitar os Termos de Uso e a Política de Privacidade para continuar.');
      return;
    }

    // Check if user is registered in staff/owner
    const existingUsers = StoreService.getUsers();
    const existing = existingUsers.find((u) => u.email.toLowerCase() === targetEmail);

    let userToAuth: User;

    if (existing) {
      userToAuth = {
        ...existing,
        lastLoginAt: new Date().toISOString()
      };
    } else {
      // Check invites
      const invites = StoreService.getInvites();
      const invite = invites.find((i) => i.email.toLowerCase() === targetEmail);

      let role: UserRole = 'CLIENTE';
      let permissions = invite ? invite.permissions : [];

      if (invite) {
        role = invite.role;
        // Revoke invite once accepted
        StoreService.revokeInvite(invite.id);
      } else if (targetEmail === 'ianfelipe051324@gmail.com') {
        // Owner default
        role = 'OWNER';
        permissions = [
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
          'lgpd.atender',
          'equipe.gerenciar',
          'pagamentos.configurar',
          'integracoes.gerenciar'
        ];
      }

      userToAuth = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: targetName,
        email: targetEmail,
        phone: phone || '(19) 98203-4637',
        role,
        permissions,
        twoFactorEnabled: role === 'OWNER' || role === 'ADMIN',
        active: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      StoreService.saveUser(userToAuth);
    }

    // If 2FA is required for Owner or Admin, prompt step-up code
    if (userToAuth.twoFactorEnabled && (userToAuth.role === 'OWNER' || userToAuth.role === 'ADMIN')) {
      setPendingUser(userToAuth);
      setTwoFactorStep(true);
      return;
    }

    StoreService.setCurrentUser(userToAuth);
    onLoginSuccess(userToAuth);
    onClose();
  };

  const handleVerify2Fa = () => {
    if (!pendingUser) return;
    if (!twoFactorCode || twoFactorCode.trim().length < 4) {
      setErrorMsg('Código 2FA inválido. Digite o código de 6 dígitos do app autenticador ou código de recuperação.');
      return;
    }

    StoreService.setCurrentUser(pendingUser);
    onLoginSuccess(pendingUser);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#fffaf2] card-hard-lg my-8 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#e8874a] border-b-[3px] border-[#24352b]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={24} className="text-[#24352b]" />
            <h2 className="font-barlow font-black text-2xl uppercase text-[#24352b]">
              {twoFactorStep ? 'Verificação em 2 Etapas' : 'Entrar na Sua Conta'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-[#24352b] bg-[#fffaf2] hover:bg-zinc-100 shadow-[2px_2px_0px_#24352b] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 bg-[#f8f1e7]/40 font-dm text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-100 border border-red-500 text-red-900 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!twoFactorStep ? (
            <>
              {/* Google Fast Sign-in Presets */}
              <div className="space-y-2">
                <span className="font-barlow font-bold text-sm uppercase text-zinc-700 block">
                  Escolha um Acesso Rápido ou Digite Seu E-mail:
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setAcceptedTerms(true);
                    handleGoogleAuth('ianfelipe051324@gmail.com', 'Ian Felipe (Proprietário)');
                  }}
                  className="w-full p-2.5 bg-white border-2 border-[#24352b] shadow-[2px_2px_0px_#24352b] flex items-center justify-between hover:bg-amber-50 cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#e8874a] text-[#24352b] font-barlow font-black flex items-center justify-center text-xs">
                      IF
                    </div>
                    <div>
                      <span className="font-bold text-zinc-900 block">
                        Ian Felipe (Proprietário)
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        ianfelipe051324@gmail.com · [OWNER]
                      </span>
                    </div>
                  </div>
                  <span className="font-barlow font-black text-xs uppercase px-2 py-0.5 bg-[#24352b] text-[#e8874a]">
                    Dono
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAcceptedTerms(true);
                    handleGoogleAuth('gerente@example.com', 'Carlos Oliveira (Gerente)');
                  }}
                  className="w-full p-2.5 bg-white border-2 border-[#24352b] shadow-[2px_2px_0px_#24352b] flex items-center justify-between hover:bg-amber-50 cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 text-white font-barlow font-black flex items-center justify-center text-xs">
                      CO
                    </div>
                    <div>
                      <span className="font-bold text-zinc-900 block">
                        Carlos Oliveira (Gerente)
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        gerente@example.com · [ADMIN]
                      </span>
                    </div>
                  </div>
                  <span className="font-barlow font-bold text-xs uppercase px-2 py-0.5 bg-zinc-800 text-white">
                    Equipe
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAcceptedTerms(true);
                    handleGoogleAuth('cliente.hortolandia@gmail.com', 'Mariana Santos (Cliente)');
                  }}
                  className="w-full p-2.5 bg-white border-2 border-zinc-300 flex items-center justify-between hover:border-black cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-800 font-barlow font-bold flex items-center justify-center text-xs">
                      MS
                    </div>
                    <div>
                      <span className="font-bold text-zinc-900 block">
                        Mariana Santos (Cliente)
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        cliente.hortolandia@gmail.com · [CLIENTE]
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500">Cliente</span>
                </button>
              </div>

              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-300"></div>
                </div>
                <span className="relative bg-[#f8f1e7] px-2 text-zinc-500 uppercase font-barlow font-bold">
                  ou entre com qualquer conta Google
                </span>
              </div>

              {/* Custom Input */}
              <div className="space-y-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">
                    Seu E-mail Google *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@gmail.com"
                    className="w-full p-2.5 bg-white border-2 border-zinc-300 focus:border-[#24352b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">
                    Seu Nome (opcional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Como quer ser chamado"
                    className="w-full p-2.5 bg-white border-2 border-zinc-300 focus:border-[#24352b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">
                    Telefone / WhatsApp (opcional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(19) 99999-9999"
                    className="w-full p-2.5 bg-white border-2 border-zinc-300 focus:border-[#24352b] focus:outline-none"
                  />
                </div>

                {/* LGPD Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2 cursor-pointer text-zinc-700">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 rounded text-[#e8874a] focus:ring-[#e8874a] w-4 h-4"
                    />
                    <span>
                      Li e concordo com os{' '}
                      <button
                        type="button"
                        onClick={onOpenTerms}
                        className="text-[#24352b] font-bold underline"
                      >
                        Termos de Uso
                      </button>{' '}
                      e a{' '}
                      <button
                        type="button"
                        onClick={onOpenPrivacy}
                        className="text-[#24352b] font-bold underline"
                      >
                        Política de Privacidade
                      </button>{' '}
                      conforme a LGPD (Lei 13.709/2018).
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleGoogleAuth()}
                className="w-full btn-hard bg-[#e8874a] text-[#24352b] py-3 text-base flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Continuar com Google</span>
                <ArrowRight size={18} />
              </button>
            </>
          ) : (
            /* 2FA Step */
            <div className="space-y-4">
              <div className="p-3 bg-amber-100 border border-amber-500 text-amber-950">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <KeyRound size={16} /> Verificação Obrigatória para Acesso Administrativo
                </div>
                <p className="text-[11px] leading-relaxed">
                  Esta conta possui privilégios de <strong>{pendingUser?.role}</strong>. Conforme
                  as diretrizes de segurança (Seção 13.1), digite o código de 6 dígitos gerado pelo
                  seu app autenticador TOTP (Google Authenticator) ou utilize um código de recuperação
                  (ex: <strong>8492-4109</strong>).
                </p>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">
                  Código de Autenticação (2FA / OTP) *
                </label>
                <input
                  type="text"
                  autoFocus
                  maxLength={10}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="000 000 ou 8492-4109"
                  className="w-full p-3 bg-white border-2 border-[#24352b] font-mono text-center text-lg tracking-widest focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleVerify2Fa}
                className="w-full btn-hard bg-[#e8874a] text-[#24352b] py-3 text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verificar e Acessar Painel</span>
                <Check size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
