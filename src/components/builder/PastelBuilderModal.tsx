import React, { useState, useMemo } from 'react';
import {
  X,
  Check,
  Flame,
  Plus,
  Minus,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Ruler,
  Scale
} from 'lucide-react';
import { StoreService } from '../../services/storeService';
import {
  CartCustomItemOption,
  CartItem,
  PastelSizeId,
  Product,
  ProductOption
} from '../../types';

interface PastelBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  initialSize?: PastelSizeId;
  product?: Product;
}

export const PastelBuilderModal: React.FC<PastelBuilderModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  initialSize = 'tubete',
  product
}) => {
  const sizes = StoreService.getSizes();
  const optionGroups = StoreService.getOptionGroups();

  const fillingsGroup = optionGroups.find((g) => g.type === 'filling') || optionGroups[0];
  const complementsGroup = optionGroups.find((g) => g.type === 'complement') || optionGroups[1];
  const extrasGroup = optionGroups.find((g) => g.type === 'extra') || optionGroups[2];

  // State
  const [selectedSize, setSelectedSize] = useState<PastelSizeId>(initialSize);
  const [selectedFilling, setSelectedFilling] = useState<ProductOption | null>(
    fillingsGroup?.options[0] || null
  );
  // Default to "Sem complemento" if available
  const [selectedComplements, setSelectedComplements] = useState<ProductOption[]>([
    complementsGroup?.options.find((o) => o.id === 'comp-none') || complementsGroup?.options[0]
  ].filter(Boolean) as ProductOption[]);
  const [selectedExtras, setSelectedExtras] = useState<ProductOption[]>([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Compute unit price
  const unitPrice = useMemo(() => {
    let price = 0;
    // Base filling price by chosen size
    if (selectedFilling) {
      price += selectedFilling.pricesBySize[selectedSize] || 19.9;
    }
    // Complements price
    selectedComplements.forEach((c) => {
      price += c.pricesBySize[selectedSize] || 0;
    });
    // Extras price
    selectedExtras.forEach((e) => {
      price += e.pricesBySize[selectedSize] || 0;
    });
    return price;
  }, [selectedSize, selectedFilling, selectedComplements, selectedExtras]);

  const totalPrice = unitPrice * quantity;

  // Handlers for complement toggle (1 to 2 options required)
  const handleToggleComplement = (option: ProductOption) => {
    setValidationError(null);
    if (option.id === 'comp-none') {
      // Selecting "None" clears other complements
      setSelectedComplements([option]);
      return;
    }

    // If "None" was previously selected, remove it
    const filtered = selectedComplements.filter((c) => c.id !== 'comp-none');
    const exists = filtered.some((c) => c.id === option.id);

    if (exists) {
      if (filtered.length === 1) {
        // Must maintain at least 1 complement; fallback to "Sem complemento"
        const noneOption = complementsGroup?.options.find((o) => o.id === 'comp-none');
        if (noneOption) setSelectedComplements([noneOption]);
        return;
      }
      setSelectedComplements(filtered.filter((c) => c.id !== option.id));
    } else {
      if (filtered.length >= 2) {
        setValidationError('Você pode escolher no máximo 2 complementos cremosos.');
        return;
      }
      setSelectedComplements([...filtered, option]);
    }
  };

  // Handlers for extra toggle (0 to 3 options allowed)
  const handleToggleExtra = (option: ProductOption) => {
    setValidationError(null);
    const exists = selectedExtras.some((e) => e.id === option.id);
    if (exists) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== option.id));
    } else {
      if (selectedExtras.length >= 3) {
        setValidationError('Você pode escolher no máximo 3 adicionais extras.');
        return;
      }
      setSelectedExtras([...selectedExtras, option]);
    }
  };

  const handleConfirmAddToCart = () => {
    if (!selectedFilling) {
      setValidationError('Por favor, selecione 1 recheio base.');
      return;
    }
    if (selectedComplements.length === 0) {
      setValidationError('Por favor, selecione ao menos 1 complemento (ou "Sem complemento").');
      return;
    }

    const currentSizeObj = sizes.find((s) => s.id === selectedSize);

    const formattedOptions: CartCustomItemOption[] = [
      {
        groupId: fillingsGroup.id,
        groupTitle: fillingsGroup.title,
        optionId: selectedFilling.id,
        optionName: selectedFilling.name,
        price: selectedFilling.pricesBySize[selectedSize]
      },
      ...selectedComplements.map((c) => ({
        groupId: complementsGroup.id,
        groupTitle: complementsGroup.title,
        optionId: c.id,
        optionName: c.name,
        price: c.pricesBySize[selectedSize]
      })),
      ...selectedExtras.map((e) => ({
        groupId: extrasGroup.id,
        groupTitle: extrasGroup.title,
        optionId: e.id,
        optionName: e.name,
        price: e.pricesBySize[selectedSize]
      }))
    ];

    const cartItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      productId: product?.id || 'prod-do-seu-jeito',
      productName: product?.name || `Pastel Do Seu Jeito (${selectedFilling.name})`,
      productImage: product?.imageUrl || '/src/assets/images/hero_pastel_feira_1791132272218.jpg',
      sizeId: selectedSize,
      sizeName: currentSizeObj?.name || 'Tubete',
      basePrice: selectedFilling.pricesBySize[selectedSize],
      selectedOptions: formattedOptions,
      notes: notes.trim() || undefined,
      unitPrice,
      quantity,
      totalPrice
    };

    onAddToCart(cartItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#fffaf2] card-hard-lg my-8 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#e8874a] border-b-[3px] border-[#24352b] shrink-0">
          <div className="flex items-center gap-2">
            <Flame size={24} className="text-[#24352b] fill-[#24352b]" />
            <div>
              <h2 className="font-barlow font-black text-2xl sm:text-3xl uppercase text-[#24352b] leading-none">
                Montador: Pastel Do Seu Jeito
              </h2>
              <span className="font-dm text-xs font-bold text-[#24352b]/80 uppercase tracking-wider">
                30 cm de puro recheio frito na hora
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-[#24352b] bg-[#fffaf2] hover:bg-zinc-100 shadow-[2px_2px_0px_#24352b] cursor-pointer"
            aria-label="Fechar montador"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#f8f1e7]/40">
          {/* Live Pastel Graphic Diagram */}
          <div className="p-4 bg-[#fffaf2] card-hard flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <span className="font-barlow font-black text-xs uppercase tracking-wider text-zinc-500 block mb-1">
                Visualização do Recheio Selecionado
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-barlow font-black text-2xl uppercase text-[#24352b]">
                  {selectedFilling?.name || 'Escolha um recheio'}
                </span>
                <span className="text-xs font-bold text-amber-600 font-dm">
                  ({selectedSize === 'tubete' ? '150 g de recheio' : '240 g de recheio'})
                </span>
              </div>

              {/* Tags of chosen options */}
              <div className="flex flex-wrap gap-1.5 mt-2 text-xs font-dm">
                {selectedComplements.map((c) => (
                  <span
                    key={c.id}
                    className="bg-[#e8874a] text-[#24352b] font-bold px-2 py-0.5 border border-[#24352b]"
                  >
                    + {c.name}
                  </span>
                ))}
                {selectedExtras.map((e) => (
                  <span
                    key={e.id}
                    className="bg-zinc-800 text-white font-medium px-2 py-0.5 border border-black"
                  >
                    + {e.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Price pill */}
            <div className="text-right shrink-0 bg-[#f8f1e7] p-3 border-2 border-[#24352b]">
              <span className="text-[11px] font-bold text-zinc-500 uppercase block">Total Unitário</span>
              <span className="font-barlow font-black text-3xl text-[#24352b]">
                R$ {unitPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="p-3 bg-red-100 border-2 border-red-700 text-red-900 text-sm font-dm flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0 text-red-700" />
              <span>{validationError}</span>
            </div>
          )}

          {/* ETAPA 1: ESCOLHA O TAMANHO */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-barlow font-black text-xl uppercase text-[#24352b] flex items-center gap-2">
                <span className="w-6 h-6 bg-[#24352b] text-[#e8874a] flex items-center justify-center text-xs">
                  1
                </span>
                Escolha o Tamanho do Pastel
              </h3>
              <span className="text-xs text-zinc-600 font-dm">Obrigatório (1 opção)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sizes
                .filter((s) => s.id === 'tubete' || s.id === 'convencional')
                .map((size) => {
                  const isSelected = selectedSize === size.id;
                  return (
                    <div
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`p-4 border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#24352b] bg-[#e8874a] shadow-[4px_4px_0px_#24352b]'
                          : 'border-zinc-300 bg-[#fffaf2] hover:border-zinc-500'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-barlow font-black text-2xl uppercase text-[#24352b] block">
                            {size.name}
                          </span>
                          <span className="font-dm text-xs font-bold text-zinc-800">
                            {size.dimensions} · {size.fillingWeight} de recheio
                          </span>
                        </div>
                        <div
                          className={`w-6 h-6 border-2 border-[#24352b] rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-[#24352b] text-[#e8874a]' : 'bg-white'
                          }`}
                        >
                          {isSelected && <Check size={14} />}
                        </div>
                      </div>
                      <p className="font-dm text-xs text-zinc-700 mt-2 leading-relaxed">
                        {size.description}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* ETAPA 2: RECHEIO BASE (ESCOLHA 1) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-barlow font-black text-xl uppercase text-[#24352b] flex items-center gap-2">
                <span className="w-6 h-6 bg-[#24352b] text-[#e8874a] flex items-center justify-center text-xs">
                  2
                </span>
                Recheio Base (O valor da massa já está incluso)
              </h3>
              <span className="text-xs font-bold text-red-700 font-dm">Escolha 1</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fillingsGroup?.options
                .filter((o) => o.isAvailable)
                .map((filling) => {
                  const isSelected = selectedFilling?.id === filling.id;
                  const currentPrice = filling.pricesBySize[selectedSize];

                  return (
                    <div
                      key={filling.id}
                      onClick={() => {
                        setSelectedFilling(filling);
                        setValidationError(null);
                      }}
                      className={`p-3.5 border-2 cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#24352b] bg-[#e8874a] shadow-[3px_3px_0px_#24352b]'
                          : 'border-zinc-300 bg-[#fffaf2] hover:border-zinc-400'
                      }`}
                    >
                      <div className="pr-3">
                        <span className="font-barlow font-bold text-lg uppercase text-[#24352b] block leading-tight">
                          {filling.name}
                        </span>
                        {filling.description && (
                          <span className="font-dm text-xs text-zinc-600 block mt-0.5 line-clamp-1">
                            {filling.description}
                          </span>
                        )}
                        {filling.needsConfirmation && (
                          <span className="text-[10px] text-amber-800 font-bold block mt-0.5">
                            * Preço promocional do dia
                          </span>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-barlow font-black text-lg text-[#24352b] block">
                          R$ {currentPrice.toFixed(2).replace('.', ',')}
                        </span>
                        <div
                          className={`w-5 h-5 ml-auto mt-1 border-2 border-[#24352b] rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-[#24352b] text-[#e8874a]' : 'bg-white'
                          }`}
                        >
                          {isSelected && <Check size={12} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* ETAPA 3: COMPLEMENTO / ACOMPANHAMENTO (OBRIGATÓRIO 1 A 2) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-barlow font-black text-xl uppercase text-[#24352b] flex items-center gap-2">
                <span className="w-6 h-6 bg-[#24352b] text-[#e8874a] flex items-center justify-center text-xs">
                  3
                </span>
                Complemento Cremoso (100g cada)
              </h3>
              <span className="text-xs text-zinc-600 font-dm">
                Obrigatório: 1 a 2 opções (ou &quot;Sem complemento&quot;)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {complementsGroup?.options
                .filter((o) => o.isAvailable)
                .map((comp) => {
                  const isSelected = selectedComplements.some((c) => c.id === comp.id);
                  const price = comp.pricesBySize[selectedSize] || 0;

                  return (
                    <div
                      key={comp.id}
                      onClick={() => handleToggleComplement(comp)}
                      className={`p-3.5 border-2 cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#24352b] bg-[#e8874a] shadow-[3px_3px_0px_#24352b]'
                          : 'border-zinc-300 bg-[#fffaf2] hover:border-zinc-400'
                      }`}
                    >
                      <div>
                        <span className="font-barlow font-bold text-lg uppercase text-[#24352b] block leading-tight">
                          {comp.name}
                        </span>
                        {comp.description && (
                          <span className="font-dm text-xs text-zinc-600 block mt-0.5">
                            {comp.description}
                          </span>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-barlow font-black text-base text-[#24352b] block">
                          {price === 0 ? 'Grátis' : `+ R$ ${price.toFixed(2).replace('.', ',')}`}
                        </span>
                        <div
                          className={`w-5 h-5 ml-auto mt-1 border-2 border-[#24352b] rounded flex items-center justify-center ${
                            isSelected ? 'bg-[#24352b] text-[#e8874a]' : 'bg-white'
                          }`}
                        >
                          {isSelected && <Check size={12} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* ETAPA 4: DEIXE AINDA MELHOR (ADICIONAIS 0 A 3) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-barlow font-black text-xl uppercase text-[#24352b] flex items-center gap-2">
                <span className="w-6 h-6 bg-[#24352b] text-[#e8874a] flex items-center justify-center text-xs">
                  4
                </span>
                Deixe Ainda Melhor — Adicionais Extras
              </h3>
              <span className="text-xs text-zinc-600 font-dm">
                Opcional: 0 a 3 escolhas ({selectedExtras.length}/3 selecionados)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {extrasGroup?.options
                .filter((o) => o.isAvailable)
                .map((extra) => {
                  const isSelected = selectedExtras.some((e) => e.id === extra.id);
                  const price = extra.pricesBySize[selectedSize] || 3.0;

                  return (
                    <div
                      key={extra.id}
                      onClick={() => handleToggleExtra(extra)}
                      className={`p-2.5 border-2 cursor-pointer flex flex-col justify-between text-left transition-all ${
                        isSelected
                          ? 'border-[#24352b] bg-[#e8874a] shadow-[2px_2px_0px_#24352b]'
                          : 'border-zinc-300 bg-[#fffaf2] hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-barlow font-bold text-sm uppercase text-[#24352b] leading-snug">
                          {extra.name}
                        </span>
                        <div
                          className={`w-4 h-4 shrink-0 border border-[#24352b] rounded flex items-center justify-center ${
                            isSelected ? 'bg-[#24352b] text-[#e8874a]' : 'bg-white'
                          }`}
                        >
                          {isSelected && <Check size={10} />}
                        </div>
                      </div>
                      <span className="font-barlow font-bold text-xs text-zinc-700 mt-2 block">
                        + R$ {price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* ETAPA 5: OBSERVAÇÕES */}
          <div>
            <h3 className="font-barlow font-black text-xl uppercase text-[#24352b] mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#24352b] text-[#e8874a] flex items-center justify-center text-xs">
                5
              </span>
              Observações Especiais
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: sem orégano, caprichar no alho frito, embalar separado..."
              rows={2}
              className="w-full p-3 border-2 border-[#24352b] bg-[#fffaf2] font-dm text-sm focus:outline-none focus:ring-2 focus:ring-[#e8874a]"
            />
          </div>
        </div>

        {/* Modal Footer (Sticky Summary & Add Button) */}
        <div className="px-6 py-4 bg-[#fffaf2] border-t-3 border-[#24352b] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          {/* Quantity selector */}
          <div className="flex items-center gap-3">
            <span className="font-barlow font-bold text-sm uppercase text-zinc-700">Qtd:</span>
            <div className="flex items-center border-2 border-[#24352b] bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-zinc-100 text-zinc-800 cursor-pointer"
                aria-label="Diminuir quantidade"
              >
                <Minus size={16} />
              </button>
              <span className="font-barlow font-black text-lg px-4 text-[#24352b]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-zinc-100 text-zinc-800 cursor-pointer"
                aria-label="Aumentar quantidade"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Total Price & Add to Cart Action */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <span className="font-dm text-xs text-zinc-500 block">Subtotal</span>
              <span className="font-barlow font-black text-3xl text-[#24352b]">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <button
              onClick={handleConfirmAddToCart}
              className="btn-hard bg-[#e8874a] text-[#24352b] px-6 py-3 text-lg flex items-center gap-2 cursor-pointer"
            >
              <Flame size={20} />
              Adicionar ao Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
