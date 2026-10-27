import React from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  ShieldCheck,
  FileText,
  Lock,
  ExternalLink
} from 'lucide-react';
import { StoreService } from '../../services/storeService';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenSecurityDocs: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenSecurityDocs
}) => {
  const settings = StoreService.getSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#24352b] text-[#fffaf2] border-t-4 border-[#e8874a] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-zinc-800">
          {/* Brand & Identity */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#e8874a] text-[#24352b] flex items-center justify-center font-barlow font-black text-2xl border-2 border-[#fffaf2]">
                SP
              </div>
              <span className="font-barlow font-black text-2xl uppercase tracking-wider text-[#e8874a]">
                {settings.name}
              </span>
            </div>
            <p className="font-dm text-sm text-zinc-300 leading-relaxed mb-4">
              O autêntico pastel artesanal de Hortolândia. Massa crocante, sequinha e recheio de
              ponta a ponta com ingredientes de altíssima procedência.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={settings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e8874a] text-[#24352b] font-barlow font-bold text-xs uppercase rounded-none border border-[#fffaf2] hover:bg-yellow-400 transition"
              >
                <Phone size={14} /> WhatsApp
              </a>
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-[#fffaf2] font-barlow font-bold text-xs uppercase border border-zinc-700 hover:bg-zinc-700 transition"
                >
                  <Instagram size={14} /> Instagram
                </a>
              )}
            </div>
          </div>

          {/* Location & Contact */}
          <div>
            <h4 className="font-barlow font-extrabold text-lg text-[#e8874a] uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin size={18} /> Endereço & Contato
            </h4>
            <address className="not-italic font-dm text-sm text-zinc-300 space-y-2 leading-snug">
              <p>{settings.address}</p>
              <p>
                {settings.city} — {settings.state}, CEP {settings.cep}
              </p>
              <p className="pt-2 text-[#e8874a] font-bold">
                WhatsApp: {settings.phone}
              </p>
              <p className="text-xs text-zinc-400">
                Ticket Médio: <span className="text-zinc-200">{settings.ticketMedio}</span>
              </p>
            </address>

            <div className="mt-4 pt-3 border-t border-zinc-800">
              <span className="text-xs text-zinc-400 uppercase font-barlow font-bold tracking-wider block mb-1">
                Serviços Oferecidos:
              </span>
              <ul className="text-xs text-zinc-300 space-y-0.5">
                {settings.services.map((svc, i) => (
                  <li key={i}>• {svc}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Business Hours Table */}
          <div>
            <h4 className="font-barlow font-extrabold text-lg text-[#e8874a] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock size={18} /> Horário de Funcionamento
            </h4>
            <div className="font-dm text-xs space-y-1.5 text-zinc-300">
              <div className="flex justify-between pb-1 border-b border-zinc-800/80">
                <span className="font-medium text-zinc-400">Segunda a Quinta</span>
                <span className="font-bold text-[#fffaf2]">
                  {settings.businessHours.seg?.open || '17:00'} – {settings.businessHours.seg?.close || '22:45'}
                </span>
              </div>
              <div className="flex justify-between pb-1 border-b border-zinc-800/80">
                <span className="font-medium text-zinc-400">Sexta-feira</span>
                <span className="font-bold text-[#fffaf2]">
                  {settings.businessHours.sex?.open || '17:00'} – {settings.businessHours.sex?.close || '23:45'}
                </span>
              </div>
              <div className="flex justify-between pb-1 border-b border-zinc-800/80">
                <span className="font-medium text-zinc-400">Sábado</span>
                <span className="font-bold text-[#fffaf2]">
                  {settings.businessHours.sab?.open || '17:00'} – {settings.businessHours.sab?.close || '23:45'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-zinc-400">Domingo</span>
                <span className="font-bold text-[#fffaf2]">
                  {settings.businessHours.dom?.open || '17:00'} – {settings.businessHours.dom?.close || '23:00'}
                </span>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-zinc-400 italic">
              * Pedidos online para entrega ou retirada são aceitos exclusivamente dentro dos
              horários de funcionamento.
            </p>
          </div>

          {/* LGPD, Security & Transparency */}
          <div>
            <h4 className="font-barlow font-extrabold text-lg text-[#e8874a] uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck size={18} /> Privacidade & LGPD
            </h4>
            <p className="font-dm text-xs text-zinc-300 leading-relaxed mb-3">
              Em total conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).
              Controlador: {settings.name}.
            </p>
            <div className="flex flex-col gap-2 font-dm text-xs">
              <button
                onClick={onOpenPrivacy}
                className="text-left text-zinc-300 hover:text-[#e8874a] flex items-center gap-1.5 cursor-pointer underline"
              >
                <FileText size={13} /> Política de Privacidade (v{settings.privacyVersion})
              </button>
              <button
                onClick={onOpenTerms}
                className="text-left text-zinc-300 hover:text-[#e8874a] flex items-center gap-1.5 cursor-pointer underline"
              >
                <FileText size={13} /> Termos de Uso do Serviço
              </button>
              <button
                onClick={onOpenSecurityDocs}
                className="text-left text-zinc-300 hover:text-[#e8874a] flex items-center gap-1.5 cursor-pointer underline"
              >
                <Lock size={13} /> Guia de Troca de Chaves & Segurança
              </button>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400">
              Canal do Encarregado de Dados (DPO):
              <a
                href={`mailto:${settings.dpoEmail}`}
                className="block text-[#e8874a] hover:underline truncate mt-0.5"
              >
                {settings.dpoEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-3">
          <p>© {currentYear} {settings.name}. Todos os direitos reservados. CNPJ sob consulta.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-zinc-400">
              Hortolândia - São Paulo
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
