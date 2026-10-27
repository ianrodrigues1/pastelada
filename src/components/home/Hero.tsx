import React from 'react';
import { Flame, ArrowRight, Star, Award, Sparkles } from 'lucide-react';
import { StoreService } from '../../services/storeService';

interface HeroProps {
  onOpenBuilder: () => void;
  onOpenMenu: () => void;
  isEditMode?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBuilder,
  onOpenMenu,
  isEditMode
}) => {
  const settings = StoreService.getSettings();
  const products = StoreService.getProducts();
  const activeFlavorsCount = products.filter((p) => p.isAvailable && !p.archivedAt).length;

  return (
    <section className="relative overflow-hidden bg-[#e8874a] border-b-[3px] border-[#24352b] py-12 lg:py-20">
      {/* Decorative vintage background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#24352b_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Vintage pill-free kicker */}
            <div className="flex items-center gap-2 mb-3 text-xs font-bold font-barlow tracking-widest uppercase text-[#24352b]">
              <span className="w-2.5 h-2.5 bg-[#24352b]"></span>
              <span>PASTELARIA ARTESANAL EM HORTOLÂNDIA - SP</span>
              <span className="text-zinc-700">·</span>
              <span>DESDE A MASSA ATÉ O RECHEIO</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-barlow font-black text-5xl sm:text-6xl lg:text-7xl uppercase text-[#24352b] leading-[0.92] tracking-tighter mb-5">
              O Autêntico Pastel de Feira, <br />
              <span className="bg-[#24352b] text-[#e8874a] px-2 py-0.5 inline-block -rotate-1 mt-1 shadow-[4px_4px_0px_#fffaf2]">
                Crocante & Recheado
              </span>{' '}
              <br />
              de Ponta a Ponta.
            </h1>

            <p className="font-dm text-base sm:text-lg text-[#24352b]/90 max-w-xl font-medium leading-relaxed mb-8">
              Pastéis de verdade com 30 cm de puro recheio. Escolha entre o tamanho{' '}
              <strong>Tubete (150g)</strong> ou o <strong>Convencional (240g)</strong>, monte do
              seu jeito ou saboreie os tradicionais preparados na hora com óleo sempre novo.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onOpenBuilder}
                className="btn-hard bg-[#fffaf2] text-[#24352b] px-6 py-3.5 text-xl flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
              >
                <Flame size={22} className="text-orange-600 fill-orange-600" />
                Montar do Seu Jeito
                <ArrowRight size={20} />
              </button>

              <button
                onClick={onOpenMenu}
                className="btn-hard bg-[#24352b] text-[#fffaf2] hover:bg-zinc-800 px-6 py-3.5 text-xl flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
              >
                Ver Cardápio Completo
              </button>
            </div>

            {/* Quick Proof Highlights */}
            <div className="mt-10 pt-6 border-t-2 border-[#24352b]/20 grid grid-cols-3 gap-6 w-full max-w-lg">
              <div>
                <span className="font-barlow font-black text-3xl sm:text-4xl text-[#24352b] block leading-none">
                  30 CM
                </span>
                <span className="font-dm text-xs font-bold text-zinc-800 uppercase tracking-tight">
                  Tamanho Gigante
                </span>
              </div>

              <div>
                <span className="font-barlow font-black text-3xl sm:text-4xl text-[#24352b] block leading-none">
                  +{activeFlavorsCount}
                </span>
                <span className="font-dm text-xs font-bold text-zinc-800 uppercase tracking-tight">
                  Sabores Ativos
                </span>
              </div>

              <div>
                <span className="font-barlow font-black text-3xl sm:text-4xl text-[#24352b] block leading-none">
                  100%
                </span>
                <span className="font-dm text-xs font-bold text-zinc-800 uppercase tracking-tight">
                  Massa Artesanal
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Image with Vintage Stamp */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Offset Brutalist Backdrop Card */}
              <div className="absolute inset-0 bg-[#24352b] translate-x-3 translate-y-3"></div>

              {/* Main Image Frame */}
              <div className="relative border-4 border-[#24352b] bg-[#fffaf2] p-2.5">
                <img
                  src="/src/assets/images/hero_pastel_feira_1791132272218.jpg"
                  alt="Pastel de feira autêntico, crocante e sequinho do Pastelada"
                  className="w-full h-80 sm:h-96 object-cover border-2 border-[#24352b]"
                  referrerPolicy="no-referrer"
                />

                <div className="p-3 bg-[#f8f1e7] border-t-2 border-[#24352b] mt-2 flex items-center justify-between">
                  <div>
                    <span className="font-barlow font-black text-lg text-[#24352b] uppercase block">
                      Pastelaria Pastelada
                    </span>
                    <span className="font-dm text-xs text-zinc-700">
                      Rua Zacarias Costa Camargo, 221 — Hortolândia
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star size={16} className="fill-amber-500" />
                    <Star size={16} className="fill-amber-500" />
                    <Star size={16} className="fill-amber-500" />
                    <Star size={16} className="fill-amber-500" />
                    <Star size={16} className="fill-amber-500" />
                  </div>
                </div>
              </div>

              {/* Circular Badge Stamp */}
              <div className="absolute -top-6 -right-6 w-24 h-24 sm:w-28 sm:h-28 bg-[#fffaf2] border-3 border-[#24352b] rounded-full shadow-[4px_4px_0px_#24352b] flex flex-col items-center justify-center p-2 text-center rotate-12">
                <Sparkles size={16} className="text-amber-500" />
                <span className="font-barlow font-black text-xs sm:text-sm uppercase leading-tight text-[#24352b]">
                  Frito Na Hora
                </span>
                <span className="font-dm text-[9px] uppercase tracking-widest text-zinc-600 font-bold">
                  Óleo Sempre Novo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
