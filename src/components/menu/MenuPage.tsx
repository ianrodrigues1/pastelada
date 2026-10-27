import React, { useState, useMemo } from 'react';
import {
  Search,
  Flame,
  Plus,
  Filter,
  Check,
  AlertTriangle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { Category, PastelSizeId, Product } from '../../types';

interface MenuPageProps {
  onBackToHome: () => void;
  onOpenBuilder: (product?: Product, size?: PastelSizeId) => void;
  onDirectAddProduct: (product: Product, sizeId: PastelSizeId) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  onBackToHome,
  onOpenBuilder,
  onDirectAddProduct
}) => {
  const categories = StoreService.getCategories();
  const products = StoreService.getProducts();
  const sizes = StoreService.getSizes();

  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizesByProduct, setSelectedSizesByProduct] = useState<Record<string, PastelSizeId>>({});

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.archivedAt) return false;
      if (!p.isAvailable) return false;

      // Category filter
      if (activeCategoryId !== 'all' && p.categoryId !== activeCategoryId) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        return matchesName || matchesDesc;
      }

      return true;
    });
  }, [products, activeCategoryId, searchQuery]);

  const handleSizeChange = (productId: string, size: PastelSizeId) => {
    setSelectedSizesByProduct((prev) => ({
      ...prev,
      [productId]: size
    }));
  };

  return (
    <div className="min-h-screen bg-[#f8f1e7] pb-24">
      {/* Menu Header Banner */}
      <div className="bg-[#24352b] text-[#fffaf2] border-b-4 border-[#e8874a] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#e8874a] font-barlow uppercase text-sm mb-4 cursor-pointer"
          >
            <ArrowLeft size={16} /> Voltar para a Página Inicial
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-barlow font-bold text-xs uppercase tracking-widest text-[#e8874a] block mb-1">
                CARDÁPIO COMPLETO · FRITO NA HORA
              </span>
              <h1 className="font-barlow font-black text-4xl sm:text-6xl uppercase tracking-tight text-white leading-none">
                Todos os Nossos Sabores
              </h1>
            </div>

            {/* Quick search input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por sabor ou ingrediente..."
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border-2 border-zinc-700 text-white font-dm text-sm focus:border-[#e8874a] focus:outline-none"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-8 pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCategoryId('all')}
              className={`px-4 py-2 font-barlow font-black uppercase text-base shrink-0 border-2 cursor-pointer transition ${
                activeCategoryId === 'all'
                  ? 'bg-[#e8874a] text-[#24352b] border-[#e8874a] shadow-[2px_2px_0px_#fffaf2]'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white'
              }`}
            >
              Todos ({products.length})
            </button>

            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id && !p.archivedAt).length;
              const isActive = activeCategoryId === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`px-4 py-2 font-barlow font-black uppercase text-base shrink-0 border-2 cursor-pointer transition ${
                    isActive
                      ? 'bg-[#e8874a] text-[#24352b] border-[#e8874a] shadow-[2px_2px_0px_#fffaf2]'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Banner for Custom Builder */}
        {activeCategoryId === 'all' || activeCategoryId === 'cat-do-seu-jeito' ? (
          <div className="mb-12 p-6 sm:p-8 bg-[#e8874a] card-hard-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-barlow font-bold text-[#24352b] uppercase tracking-wider mb-1">
                <Sparkles size={16} /> OPÇÃO MAIS PEDIDA DA CASA
              </div>
              <h2 className="font-barlow font-black text-3xl sm:text-5xl uppercase text-[#24352b] tracking-tight leading-none">
                Pastel Do Seu Jeito: Monte com Seus Ingredientes Favoritos
              </h2>
              <p className="font-dm text-sm text-[#24352b]/90 max-w-2xl mt-2 font-medium">
                Escolha o tamanho (Tubete ou Convencional), 1 recheio base de carne, palmito,
                camarão ou frango, complementos cremosos como Catupiry legítimo e adicionais
                crocantes.
              </p>
            </div>

            <button
              onClick={() => onOpenBuilder()}
              className="btn-hard bg-[#24352b] text-[#fffaf2] hover:bg-zinc-800 px-6 py-3.5 text-xl flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Flame size={20} className="text-[#e8874a] fill-[#e8874a]" />
              Abrir Montador
            </button>
          </div>
        ) : null}

        {/* Warning banner if viewing alcoholic beverages */}
        {activeCategoryId === 'cat-alcoolicas' && (
          <div className="mb-8 p-4 bg-amber-100 border-2 border-amber-600 text-amber-950 font-dm text-sm flex items-center gap-3">
            <AlertTriangle size={24} className="text-amber-700 shrink-0" />
            <div>
              <strong>Aviso Legal (Art. 243 do ECA - Lei 8.069/1990):</strong> É expressamente
              proibida a venda de bebidas alcoólicas a menores de 18 anos. No ato da entrega ou
              retirada, será exigida a apresentação de documento oficial de identidade com foto.
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#fffaf2] card-hard p-8">
            <Search size={40} className="mx-auto text-zinc-400 mb-3" />
            <h3 className="font-barlow font-black text-2xl uppercase text-[#24352b]">
              Nenhum item encontrado
            </h3>
            <p className="font-dm text-sm text-zinc-600 mt-1">
              Tente buscar com outros termos ou selecione outra categoria acima.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const currentSize: PastelSizeId =
                selectedSizesByProduct[product.id] ||
                product.availableSizes[0] ||
                'tubete';

              const price = product.pricesBySize[currentSize] || product.pricesBySize.tubete || 19.9;

              return (
                <div
                  key={product.id}
                  className="card-hard bg-[#fffaf2] flex flex-col justify-between overflow-hidden hover:-translate-y-1 transition duration-150"
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative h-48 bg-zinc-200 border-b-2 border-[#24352b] overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-amber-50 text-zinc-500">
                          <Flame size={32} className="text-[#e8874a] mb-1" />
                          <span className="font-barlow font-bold uppercase text-xs">
                            Pastelada
                          </span>
                        </div>
                      )}

                      {product.isCustomizable && (
                        <div className="absolute top-2 left-2 bg-[#e8874a] border-2 border-[#24352b] px-2 py-0.5 font-barlow font-black text-xs uppercase shadow-[2px_2px_0px_#24352b]">
                          Personalizável
                        </div>
                      )}

                      {product.isAlcoholic && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white font-barlow font-bold text-xs uppercase px-2 py-0.5 border border-black">
                          +18 Anos
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-barlow font-black text-2xl uppercase text-[#24352b] tracking-tight leading-snug">
                        {product.name}
                      </h3>
                      <p className="font-dm text-xs text-zinc-600 line-clamp-2 mt-1.5 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Size Selector for Products with multiple sizes */}
                      {product.availableSizes.length > 1 && (
                        <div className="mt-4 pt-3 border-t border-zinc-200">
                          <span className="font-dm text-[11px] font-bold text-zinc-500 uppercase block mb-1.5">
                            Escolha o Tamanho:
                          </span>
                          <div className="flex gap-1.5">
                            {product.availableSizes.map((sz) => {
                              const szConfig = sizes.find((s) => s.id === sz);
                              const isSelected = currentSize === sz;
                              return (
                                <button
                                  key={sz}
                                  onClick={() => handleSizeChange(product.id, sz)}
                                  className={`flex-1 py-1 px-1.5 border text-center cursor-pointer transition ${
                                    isSelected
                                      ? 'border-[#24352b] bg-[#e8874a] font-bold text-[#24352b]'
                                      : 'border-zinc-300 bg-zinc-50 text-zinc-600 hover:border-zinc-400'
                                  }`}
                                >
                                  <span className="font-barlow text-xs uppercase block font-black leading-tight">
                                    {szConfig?.name || sz}
                                  </span>
                                  <span className="font-dm text-[10px] block">
                                    R$ {(product.pricesBySize[sz] || 0).toFixed(2).replace('.', ',')}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom / Action */}
                  <div className="p-5 pt-0">
                    <div className="flex items-center justify-between pt-3 border-t-2 border-[#24352b]">
                      <div>
                        <span className="font-dm text-[11px] text-zinc-500 block">Preço</span>
                        <span className="font-barlow font-black text-2xl text-[#24352b]">
                          R$ {price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      {product.isCustomizable ? (
                        <button
                          onClick={() => onOpenBuilder(product, currentSize)}
                          className="btn-hard bg-[#e8874a] text-[#24352b] px-3.5 py-1.5 text-sm flex items-center gap-1 cursor-pointer"
                        >
                          <Flame size={16} /> Montar
                        </button>
                      ) : (
                        <button
                          onClick={() => onDirectAddProduct(product, currentSize)}
                          className="btn-hard bg-[#24352b] text-[#fffaf2] hover:bg-zinc-800 px-3.5 py-1.5 text-sm flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={16} /> Adicionar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
