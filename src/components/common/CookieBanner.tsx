import React, { useState, useEffect } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { StoreService } from '../../services/storeService';

interface CookieBannerProps {
  onOpenPrivacy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacy }) => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('pastelada_cookie_consent_v1');
    if (!hasConsented) {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    StoreService.recordConsent({
      essential: true,
      analytics: true,
      marketing: true
    });
    localStorage.setItem('pastelada_cookie_consent_v1', 'all');
    setVisible(false);
  };

  const handleSavePreferences = () => {
    StoreService.recordConsent({
      essential: true,
      analytics,
      marketing
    });
    localStorage.setItem(
      'pastelada_cookie_consent_v1',
      JSON.stringify({ essential: true, analytics, marketing })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-[#24352b]/95 backdrop-blur border-t-4 border-[#e8874a] text-[#fffaf2] shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck size={28} className="text-[#e8874a] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-barlow font-bold text-lg uppercase tracking-wide text-[#e8874a]">
                Sua Privacidade & Cookies (LGPD - Lei 13.709/2018)
              </h4>
              <p className="font-dm text-xs text-zinc-300 leading-relaxed max-w-3xl mt-0.5">
                Utilizamos cookies essenciais para o funcionamento do carrinho e checkout seguro.
                Você pode autorizar ou não cookies analíticos e de marketing conforme sua preferência.
                Nenhum dado sensível de pagamento trafega por cookies. Leia nossa{' '}
                <button
                  onClick={onOpenPrivacy}
                  className="text-[#e8874a] underline font-bold cursor-pointer"
                >
                  Política de Privacidade
                </button>
                .
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 px-2.5 py-1.5 border border-zinc-700 font-dm cursor-pointer"
            >
              {showDetails ? 'Ocultar Opções' : 'Personalizar'}
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <button
              onClick={handleSavePreferences}
              className="font-barlow font-bold uppercase text-xs px-4 py-2 bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700 cursor-pointer"
            >
              Salvar Seleção
            </button>

            <button
              onClick={handleAcceptAll}
              className="font-barlow font-extrabold uppercase text-xs px-5 py-2 bg-[#e8874a] text-[#24352b] border-2 border-[#fffaf2] shadow-[2px_2px_0px_#fffaf2] hover:bg-yellow-400 cursor-pointer"
            >
              Aceitar Todos
            </button>
          </div>
        </div>

        {/* Granular Preferences Box */}
        {showDetails && (
          <div className="pt-3 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-dm">
            <div className="p-3 bg-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#e8874a]">Essenciais (Obrigatório)</span>
                <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 text-zinc-400">Sempre Ativo</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-snug">
                Autenticação de sessão, itens do carrinho de compras e segurança do pedido.
              </p>
            </div>

            <div className="p-3 bg-zinc-900 border border-zinc-800">
              <label className="flex items-center justify-between mb-1 cursor-pointer">
                <span className="font-bold text-zinc-200">Analíticos</span>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="rounded text-[#e8874a] focus:ring-[#e8874a] w-4 h-4"
                />
              </label>
              <p className="text-zinc-400 text-[11px] leading-snug">
                Métricas anônimas de visualizações de páginas para melhoria de desempenho.
              </p>
            </div>

            <div className="p-3 bg-zinc-900 border border-zinc-800">
              <label className="flex items-center justify-between mb-1 cursor-pointer">
                <span className="font-bold text-zinc-200">Marketing & Ofertas</span>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="rounded text-[#e8874a] focus:ring-[#e8874a] w-4 h-4"
                />
              </label>
              <p className="text-zinc-400 text-[11px] leading-snug">
                Notificações de cupons e promoções do Pastelada.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
