import React from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  Flame
} from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { CartItem } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onClearCart: () => void;
  onOpenCheckout: () => void;
  onOpenMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClearCart,
  onOpenCheckout,
  onOpenMenu
}) => {
  const settings = StoreService.getSettings();
  const storeStatus = StoreService.isStoreOpenNow();

  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const isBelowMinimum = subtotal < settings.minOrderValue && items.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fffaf2] border-l-[3px] border-[#24352b] shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 bg-[#e8874a] border-b-[3px] border-[#24352b] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag size={22} className="text-[#24352b]" />
              <h2 className="font-barlow font-black text-2xl uppercase tracking-tight text-[#24352b]">
                Seu Carrinho ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 border-2 border-[#24352b] bg-[#fffaf2] hover:bg-zinc-100 shadow-[2px_2px_0px_#24352b] cursor-pointer"
              aria-label="Fechar carrinho"
            >
              <X size={18} />
            </button>
          </div>

          {/* Store status notice if closed or paused */}
          {!storeStatus.isOpen && items.length > 0 && (
            <div className="p-3 bg-amber-100 border-b-2 border-amber-600 text-amber-950 text-xs font-dm flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-700 shrink-0" />
              <span>
                <strong>Atenção:</strong> {storeStatus.message}. Você pode montar seu pedido e
                agendar para o horário de abertura!
              </span>
            </div>
          )}

          {/* Items List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f8f1e7]/40">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag size={48} className="mx-auto text-zinc-400 mb-3" />
                <h3 className="font-barlow font-black text-2xl uppercase text-[#24352b]">
                  Seu carrinho está vazio
                </h3>
                <p className="font-dm text-xs text-zinc-600 max-w-xs mx-auto mt-1 mb-6">
                  Que tal experimentar um dos nossos pastéis artesanais sequinhos e crocantes?
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenMenu();
                  }}
                  className="btn-hard bg-[#e8874a] text-[#24352b] px-5 py-2.5 text-base cursor-pointer"
                >
                  Ver Cardápio
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-[#fffaf2] border-2 border-[#24352b] shadow-[3px_3px_0px_#24352b] flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-barlow font-bold text-lg uppercase text-[#24352b] leading-tight block">
                        {item.productName}
                      </span>
                      <span className="font-dm text-xs font-bold text-amber-800">
                        Tamanho: {item.sizeName}
                      </span>
                    </div>

                    <button
                      onClick={() => onUpdateQuantity(item.id, -item.quantity)}
                      className="text-zinc-400 hover:text-red-700 p-1 cursor-pointer"
                      title="Remover item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Options details (Fillings, complements, extras) */}
                  {item.selectedOptions.length > 0 && (
                    <div className="my-2.5 pl-2 border-l-2 border-amber-300 space-y-0.5 text-xs font-dm text-zinc-700">
                      {item.selectedOptions.map((opt, i) => (
                        <div key={i} className="flex justify-between">
                          <span>• {opt.optionName}</span>
                          {opt.price > 0 && (
                            <span className="text-zinc-500 font-medium">
                              + R$ {opt.price.toFixed(2).replace('.', ',')}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Customer notes */}
                  {item.notes && (
                    <div className="text-[11px] text-zinc-500 italic bg-amber-50 p-1.5 border border-amber-200 mt-1">
                      Obs: {item.notes}
                    </div>
                  )}

                  {/* Quantity and Price row */}
                  <div className="mt-3 pt-3 border-t border-zinc-200 flex items-center justify-between">
                    <div className="flex items-center border border-[#24352b] bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1 hover:bg-zinc-100 cursor-pointer"
                        aria-label="Diminuir"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-barlow font-bold text-sm px-2.5 text-[#24352b]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-1 hover:bg-zinc-100 cursor-pointer"
                        aria-label="Aumentar"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-barlow font-black text-lg text-[#24352b]">
                        R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer (Subtotal and Checkout Action) */}
          {items.length > 0 && (
            <div className="p-5 bg-[#fffaf2] border-t-3 border-[#24352b] space-y-3 shrink-0">
              {/* Minimum Order Warning */}
              {isBelowMinimum && (
                <div className="p-2.5 bg-amber-100 border border-amber-600 text-amber-950 text-xs font-dm">
                  Pedido mínimo da loja: R${' '}
                  {settings.minOrderValue.toFixed(2).replace('.', ',')}. Faltam R${' '}
                  {(settings.minOrderValue - subtotal).toFixed(2).replace('.', ',')}.
                </div>
              )}

              <div className="flex justify-between items-center text-sm font-dm">
                <span className="text-zinc-600">Subtotal dos itens:</span>
                <span className="font-barlow font-black text-2xl text-[#24352b]">
                  R$ {subtotal.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="text-[11px] text-zinc-500 font-dm">
                * A taxa de entrega será calculada no checkout de acordo com o seu bairro em
                Hortolândia.
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={onClearCart}
                  className="px-3 py-2 border-2 border-zinc-400 text-zinc-700 hover:bg-zinc-100 font-barlow text-xs uppercase font-bold cursor-pointer"
                >
                  Limpar
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenCheckout();
                  }}
                  disabled={isBelowMinimum}
                  className="flex-1 btn-hard bg-[#e8874a] text-[#24352b] py-3 text-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Finalizar Pedido</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
