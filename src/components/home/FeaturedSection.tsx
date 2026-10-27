import React from 'react';
import { Plus, Flame, Sparkles } from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { Product } from '../../types';

interface FeaturedSectionProps {
  onSelectProduct: (product: Product) => void;
  onOpenBuilder: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  onSelectProduct,
  onOpenBuilder
}) => {
  const settings = StoreService.getSettings();
  const products = StoreService.getProducts();

  // Pick the 3 featured products based on storeSettings.featuredProductIds
  const featured = settings.featuredProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => !!p && p.isAvailable);

  return (
    <section className="py-14 sm:py-20 bg-[#f8f1e7] border-b-[3px] border-[#24352b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b-2 border-[#24352b]/20">
          <div>
            <span className="font-barlow font-bold text-xs uppercase tracking-widest text-zinc-600 block mb-1">
              SELEÇÃO DO CHEF · MAIS PEDIDOS EM HORTOLÂNDIA
            </span>
            <h2 className="font-barlow font-black text-4xl sm:text-5xl uppercase text-[#24352b] tracking-tight leading-none">
              Os Clássicos Imperdíveis
            </h2>
          </div>
          <p className="font-dm text-sm text-zinc-600 max-w-md mt-2 md:mt-0">
            Três das nossas receitas mais aclamadas. Massa esticada na medida, muito recheio e
            crocância que dura até a última mordida.
          </p>
        </div>

        {/* 3 Featured Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((item, idx) => {
            const tubetePrice = item.pricesBySize.tubete || 19.9;
            const convencionalPrice = item.pricesBySize.convencional || 27.0;

            return (
              <div
                key={item.id}
                className="card-hard bg-[#fffaf2] flex flex-col justify-between overflow-hidden group hover:-translate-y-1 transition duration-150"
              >
                <div>
                  {/* Image banner with badge */}
                  <div className="relative h-56 bg-zinc-200 border-b-2 border-[#24352b] overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#e8874a]/20 text-[#24352b] p-4 text-center">
                        <Flame size={32} className="text-[#e8874a] mb-1" />
                        <span className="font-barlow font-bold uppercase text-lg">
                          Pastel Quentinho
                        </span>
                      </div>
                    )}

                    <div className="absolute top-3 left-3 bg-[#e8874a] border-2 border-[#24352b] px-2 py-0.5 font-barlow font-black text-xs uppercase shadow-[2px_2px_0px_#24352b]">
                      Top #{idx + 1}
                    </div>

                    {item.needsConfirmation && (
                      <div className="absolute bottom-2 right-2 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 border border-black">
                        Preço Promocional
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="font-barlow font-black text-2xl uppercase text-[#24352b] tracking-tight leading-tight mb-2">
                      {item.name}
                    </h3>
                    <p className="font-dm text-sm text-zinc-600 line-clamp-3 leading-relaxed mb-6">
                      {item.description}
                    </p>

                    {/* Price by Size Indicator */}
                    <div className="p-3 bg-[#f8f1e7] border-2 border-[#24352b] space-y-1 text-xs font-dm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-zinc-700">Tamanho Tubete (150g):</span>
                        <span className="font-bold font-barlow text-base text-[#24352b]">
                          R$ {tubetePrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-zinc-700">Tamanho Convencional (240g):</span>
                        <span className="font-bold font-barlow text-base text-[#24352b]">
                          R$ {convencionalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card CTA Action */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => onSelectProduct(item)}
                    className="w-full btn-hard bg-[#e8874a] text-[#24352b] py-2.5 text-base flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={18} />
                    Pedir Este Pastel
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom banner below */}
        <div className="mt-12 p-6 sm:p-8 bg-[#24352b] text-[#fffaf2] border-3 border-[#24352b] shadow-[6px_6px_0px_#e8874a] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-barlow font-bold text-[#e8874a] uppercase tracking-widest mb-1">
              <Sparkles size={14} /> EXCLUSIVIDADE PASTELADA
            </div>
            <h3 className="font-barlow font-black text-3xl sm:text-4xl uppercase text-white tracking-tight">
              Quer criar sua própria combinação?
            </h3>
            <p className="font-dm text-sm text-zinc-300 max-w-xl mt-1">
              No montador <strong>Do Seu Jeito</strong> você escolhe tamanho, recheio base
              (carne, palmito, camarão, queijo, etc.), catupiry original e adicionais frescos.
            </p>
          </div>

          <button
            onClick={onOpenBuilder}
            className="btn-hard bg-[#e8874a] text-[#24352b] px-6 py-3 text-lg shrink-0 cursor-pointer"
          >
            Abrir Montador Interativo
          </button>
        </div>
      </div>
    </section>
  );
};
