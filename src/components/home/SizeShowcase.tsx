import React from 'react';
import { Ruler, Scale, Flame } from 'lucide-react';
import { StoreService } from '../../services/storeService';

interface SizeShowcaseProps {
  onOpenBuilderWithSize: (sizeId: 'tubete' | 'convencional') => void;
}

export const SizeShowcase: React.FC<SizeShowcaseProps> = ({ onOpenBuilderWithSize }) => {
  const sizes = StoreService.getSizes();

  return (
    <section className="py-14 sm:py-20 bg-[#fffaf2] border-b-[3px] border-[#24352b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-barlow font-bold text-xs uppercase tracking-widest text-zinc-600 block mb-1">
            TAMANHOS PADRONIZADOS COM BALANÇA DE PRECISÃO
          </span>
          <h2 className="font-barlow font-black text-4xl sm:text-5xl uppercase text-[#24352b] tracking-tight">
            Qual é a Sua Fome Hoje?
          </h2>
          <p className="font-dm text-sm text-zinc-600 mt-2">
            Aqui o recheio é pesado e colocado de ponta a ponta. Você nunca come vento no Sêo
            Pastel!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. Tubete */}
          <div className="card-hard bg-[#f8f1e7] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-[#e8874a] border-2 border-[#24352b] rounded-full flex items-center justify-center font-barlow font-black text-xs rotate-12 shadow-[2px_2px_0px_#24352b]">
              150g
            </div>

            <div>
              <span className="font-barlow font-black text-3xl uppercase text-[#24352b] block mb-1">
                Tubete
              </span>
              <div className="flex items-center gap-3 text-xs text-zinc-700 font-dm font-semibold mb-4">
                <span className="flex items-center gap-1">
                  <Ruler size={14} /> 30 cm × 6 cm
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Scale size={14} /> 150 g de recheio
                </span>
              </div>

              {/* Graphic Representation */}
              <div className="my-6 p-4 bg-[#fffaf2] border-2 border-[#24352b] flex flex-col items-center justify-center">
                <div className="w-full h-10 bg-amber-400 border-2 border-[#24352b] flex items-center justify-center shadow-inner relative">
                  <span className="font-barlow font-black text-xs uppercase tracking-wider text-[#24352b]">
                    30 CM COMPRIMENTO × 6 CM LARGURA
                  </span>
                </div>
                <span className="font-dm text-[11px] text-zinc-500 mt-2 text-center">
                  Formato alongado que permite morder recheio farto a cada centímetro.
                </span>
              </div>

              <p className="font-dm text-xs text-zinc-600 leading-relaxed mb-6">
                Ideal para uma refeição individual saborosa e sequinha. Recheado com 150 g de peso
                líquido garantido.
              </p>
            </div>

            <div>
              <div className="text-xs font-bold text-zinc-700 mb-2">A partir de R$ 15,00</div>
              <button
                onClick={() => onOpenBuilderWithSize('tubete')}
                className="w-full btn-hard bg-[#e8874a] text-[#24352b] py-2 text-sm flex items-center justify-center gap-1 cursor-pointer"
              >
                <Flame size={16} /> Montar Tubete
              </button>
            </div>
          </div>

          {/* 2. Convencional */}
          <div className="card-hard-lg bg-[#e8874a] p-6 flex flex-col justify-between relative overflow-hidden scale-100 md:-translate-y-2">
            <div className="absolute top-0 right-0 bg-[#24352b] text-[#e8874a] font-barlow font-black text-xs uppercase px-3 py-1 border-b-2 border-l-2 border-[#24352b]">
              Mais Escolhido
            </div>

            <div>
              <span className="font-barlow font-black text-3xl uppercase text-[#24352b] block mb-1">
                Convencional
              </span>
              <div className="flex items-center gap-3 text-xs text-zinc-900 font-dm font-bold mb-4">
                <span className="flex items-center gap-1">
                  <Ruler size={14} /> 30 cm × 10 cm
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Scale size={14} /> 240 g de recheio
                </span>
              </div>

              {/* Graphic Representation */}
              <div className="my-6 p-4 bg-[#fffaf2] border-2 border-[#24352b] flex flex-col items-center justify-center">
                <div className="w-full h-16 bg-amber-400 border-2 border-[#24352b] flex items-center justify-center shadow-inner relative">
                  <span className="font-barlow font-black text-xs uppercase tracking-wider text-[#24352b]">
                    30 CM COMPRIMENTO × 10 CM LARGURA
                  </span>
                </div>
                <span className="font-dm text-[11px] text-zinc-600 mt-2 text-center font-medium">
                  240 gramas de recheio farto e generoso do começo ao fim.
                </span>
              </div>

              <p className="font-dm text-xs text-[#24352b] font-medium leading-relaxed mb-6">
                Para quem tem fome de verdade! O tamanho clássico de feira com massa fininha e quase
                um quarto de quilo de recheio.
              </p>
            </div>

            <div>
              <div className="text-xs font-bold text-[#24352b] mb-2">A partir de R$ 23,50</div>
              <button
                onClick={() => onOpenBuilderWithSize('convencional')}
                className="w-full btn-hard bg-[#24352b] text-[#fffaf2] hover:bg-zinc-800 py-2.5 text-base flex items-center justify-center gap-1 cursor-pointer"
              >
                <Flame size={18} className="text-[#e8874a]" /> Montar Convencional
              </button>
            </div>
          </div>

          {/* 3. Especial Família */}
          <div className="card-hard bg-[#f8f1e7] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-[#24352b] text-[#e8874a] border-2 border-[#24352b] rounded-full flex items-center justify-center font-barlow font-black text-xs rotate-12">
              500g
            </div>

            <div>
              <span className="font-barlow font-black text-3xl uppercase text-[#24352b] block mb-1">
                Família Especial
              </span>
              <div className="flex items-center gap-3 text-xs text-zinc-700 font-dm font-semibold mb-4">
                <span className="flex items-center gap-1">
                  <Ruler size={14} /> 30 cm × 20 cm
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Scale size={14} /> Meio quilo
                </span>
              </div>

              {/* Graphic Representation */}
              <div className="my-6 p-4 bg-[#fffaf2] border-2 border-[#24352b] flex flex-col items-center justify-center">
                <div className="w-full h-24 bg-amber-400 border-2 border-[#24352b] flex items-center justify-center shadow-inner relative">
                  <span className="font-barlow font-black text-xs uppercase tracking-wider text-[#24352b]">
                    30 CM × 20 CM GIGANTE
                  </span>
                </div>
                <span className="font-dm text-[11px] text-zinc-500 mt-2 text-center">
                  Inclui 2 complementos e 2 adicionais no preço único.
                </span>
              </div>

              <p className="font-dm text-xs text-zinc-600 leading-relaxed mb-6">
                Feito para dividir entre 2 a 3 pessoas. Acompanha corte especial para consumo na
                mesa ou em casa.
              </p>
            </div>

            <div>
              <div className="text-xs font-bold text-zinc-700 mb-2">Preço Fixo: R$ 64,90</div>
              <button
                onClick={() => onOpenBuilderWithSize('convencional')}
                className="w-full btn-hard bg-[#e8874a] text-[#24352b] py-2 text-sm flex items-center justify-center gap-1 cursor-pointer"
              >
                Conhecer Especial
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
