import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  ChefHat,
  Truck,
  Copy,
  Printer,
  Phone,
  QrCode,
  Flame,
  ArrowRight
} from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { Order, OrderStatus } from '../../types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onStatusUpdated?: (updatedOrder: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  order: initialOrder,
  onStatusUpdated
}) => {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [copiedPix, setCopiedPix] = useState(false);
  const settings = StoreService.getSettings();

  // Status step configuration
  const steps: { key: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      key: 'received',
      label: 'Recebido',
      icon: <Clock size={20} />,
      desc: 'Confirmado pela loja'
    },
    {
      key: 'preparing',
      label: 'Na Cozinha',
      icon: <ChefHat size={20} />,
      desc: 'Massa aberta e fritando'
    },
    {
      key: 'ready',
      label: order.deliveryMethod === 'delivery' ? 'A Caminho' : 'Pronto',
      icon: <Truck size={20} />,
      desc: order.deliveryMethod === 'delivery' ? 'Com o motoboy' : 'No balcão'
    },
    {
      key: 'delivered',
      label: 'Entregue',
      icon: <CheckCircle2 size={20} />,
      desc: 'Bom apetite!'
    }
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);

  const handleCopyPix = () => {
    if (order.pixCopyPasteCode) {
      navigator.clipboard.writeText(order.pixCopyPasteCode);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // WhatsApp quick contact URL with order reference
  const whatsappOrderUrl = `https://wa.me/5519982034637?text=${encodeURIComponent(
    `Olá! Gostaria de informações sobre o meu pedido #${order.code} no Pastelada.`
  )}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#fffaf2] card-hard-lg my-8 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#e8874a] border-b-[3px] border-[#24352b] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-barlow font-black text-xs uppercase px-2 py-0.5 bg-[#24352b] text-[#e8874a]">
                Pedido Realizado
              </span>
              <span className="font-barlow font-black text-2xl sm:text-3xl text-[#24352b]">
                #{order.code}
              </span>
            </div>
            <span className="font-dm text-xs text-zinc-800">
              Acompanhamento ao vivo · Tempo estimado: {settings.prepTimeMinutes}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border-2 border-[#24352b] bg-[#fffaf2] hover:bg-zinc-100 shadow-[2px_2px_0px_#24352b] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8f1e7]/40">
          {/* Status Progress Bar */}
          <div className="p-6 bg-[#fffaf2] border-2 border-[#24352b] shadow-[3px_3px_0px_#24352b]">
            <div className="grid grid-cols-4 gap-2 relative">
              {steps.map((st, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={st.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 border-2 border-[#24352b] rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#e8874a] text-[#24352b] shadow-[3px_3px_0px_#24352b] scale-110'
                          : isPassed
                          ? 'bg-[#24352b] text-[#fffaf2]'
                          : 'bg-zinc-100 text-zinc-400 border-zinc-300'
                      }`}
                    >
                      {st.icon}
                    </div>
                    <span
                      className={`font-barlow font-bold uppercase text-xs sm:text-sm mt-2 block ${
                        isPassed ? 'text-[#24352b]' : 'text-zinc-400'
                      }`}
                    >
                      {st.label}
                    </span>
                    <span className="font-dm text-[10px] text-zinc-500 hidden sm:block">
                      {st.desc}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Current status description banner */}
            <div className="mt-6 p-3 bg-amber-50 border-2 border-[#24352b] text-center">
              <span className="font-dm text-xs font-bold text-[#24352b]">
                {order.timeline[order.timeline.length - 1]?.description ||
                  'Seu pedido está sendo preparado pela equipe do Pastelada.'}
              </span>
            </div>
          </div>

          {/* PIX Payment Section if pending */}
          {order.paymentMethod === 'pix' && order.paymentStatus === 'pending' && (
            <div className="p-6 bg-[#fffaf2] border-2 border-[#24352b] shadow-[3px_3px_0px_#24352b] text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <QrCode size={24} className="text-[#24352b]" />
                <h3 className="font-barlow font-black text-xl uppercase text-[#24352b]">
                  Pague com PIX para liberar o preparo
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {/* QR Code image */}
                <div className="p-2 bg-white border-2 border-[#24352b] inline-block shadow-[2px_2px_0px_#24352b]">
                  <img
                    src={order.pixQrCodeUrl}
                    alt="QR Code do PIX"
                    className="w-44 h-44 object-contain"
                  />
                </div>

                <div className="text-left max-w-sm space-y-2">
                  <p className="font-dm text-xs text-zinc-700 leading-relaxed">
                    1. Abra o app do seu banco ou carteira digital. <br />
                    2. Escolha pagar via PIX e escaneie o QR Code ao lado. <br />
                    3. Ou clique abaixo para copiar o código Copia e Cola.
                  </p>

                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="w-full btn-hard bg-[#e8874a] text-[#24352b] py-2 px-4 text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Copy size={16} />
                    {copiedPix ? 'Código Pix Copiado!' : 'Copiar Chave Copia e Cola'}
                  </button>

                  <span className="font-dm text-[11px] text-zinc-500 block text-center">
                    Valor a transferir: R$ {order.total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Order Snapshot Items List */}
          <div className="p-6 bg-[#fffaf2] border-2 border-[#24352b] space-y-3">
            <h3 className="font-barlow font-black text-lg uppercase text-[#24352b] pb-2 border-b border-zinc-200">
              Itens do Pedido ({order.items.length})
            </h3>

            <div className="divide-y divide-zinc-200">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between items-start text-xs font-dm">
                  <div>
                    <span className="font-bold text-sm text-[#24352b] block">
                      {item.quantity}x {item.productName} ({item.sizeName})
                    </span>
                    {item.filling && (
                      <span className="text-zinc-700 block">• Recheio: {item.filling}</span>
                    )}
                    {item.complements && item.complements.length > 0 && (
                      <span className="text-zinc-600 block">
                        • Complementos: {item.complements.join(', ')}
                      </span>
                    )}
                    {item.extras && item.extras.length > 0 && (
                      <span className="text-zinc-600 block">
                        • Adicionais: {item.extras.join(', ')}
                      </span>
                    )}
                    {item.notes && (
                      <span className="text-zinc-500 italic block mt-0.5">
                        Obs: {item.notes}
                      </span>
                    )}
                  </div>
                  <span className="font-barlow font-black text-base text-[#24352b]">
                    R$ {item.subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-3 border-t-2 border-[#24352b] space-y-1 text-xs font-dm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal:</span>
                <span>R$ {order.subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-zinc-600">
                  <span>Taxa de Entrega:</span>
                  <span>R$ {order.deliveryFee.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Desconto:</span>
                  <span>- R$ {order.discount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="pt-2 flex justify-between font-barlow font-black text-2xl text-[#24352b]">
                <span>Total:</span>
                <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="p-4 bg-zinc-100 border-2 border-zinc-300 text-xs font-dm space-y-1 text-zinc-700">
            <span className="font-bold text-zinc-900 block mb-1">
              Destinatário & Local de Entrega:
            </span>
            <p>
              <strong>Cliente:</strong> {order.customerName} ({order.customerPhone})
            </p>
            {order.deliveryAddress ? (
              <p>
                <strong>Endereço:</strong> {order.deliveryAddress.street},{' '}
                {order.deliveryAddress.number} {order.deliveryAddress.complement} —{' '}
                {order.deliveryAddress.neighborhood}, Hortolândia - SP
              </p>
            ) : (
              <p>
                <strong>Método:</strong>{' '}
                {order.deliveryMethod === 'pickup' ? 'Retirada no Balcão' : 'Consumo no Local'}
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-[#fffaf2] border-t-3 border-[#24352b] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={handlePrintReceipt}
              className="p-2.5 border-2 border-[#24352b] bg-white hover:bg-zinc-100 flex items-center gap-1.5 font-barlow text-xs uppercase font-bold cursor-pointer"
            >
              <Printer size={16} /> Imprimir Comanda
            </button>

            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 border-2 border-[#24352b] bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 font-barlow text-xs uppercase font-bold cursor-pointer"
            >
              <Phone size={16} /> Falar no WhatsApp
            </a>
          </div>

          <button
            onClick={onClose}
            className="btn-hard bg-[#e8874a] text-[#24352b] px-6 py-2.5 text-base cursor-pointer"
          >
            Fechar
          </button>
        </div>

        {/* Printable Thermal Receipt (Visible only when printing) */}
        <div id="printable-receipt" className="hidden print:block">
          <div className="text-center pb-2 border-b border-black">
            <h2 className="text-base font-bold uppercase">{settings.name}</h2>
            <p className="text-[10px]">{settings.address}</p>
            <p className="text-[10px]">Hortolândia - SP · Tel: {settings.phone}</p>
            <p className="text-xs font-bold mt-1">COMANDA #{order.code}</p>
            <p className="text-[10px]">{new Date(order.createdAt).toLocaleString('pt-BR')}</p>
          </div>

          <div className="py-2 border-b border-black text-xs">
            <p><strong>Cliente:</strong> {order.customerName}</p>
            <p><strong>Tel:</strong> {order.customerPhone}</p>
            <p><strong>Tipo:</strong> {order.deliveryMethod.toUpperCase()}</p>
            {order.deliveryAddress && (
              <p>
                <strong>Endereço:</strong> {order.deliveryAddress.street}, {order.deliveryAddress.number}
                <br />Bairro: {order.deliveryAddress.neighborhood}
              </p>
            )}
          </div>

          <div className="py-2 border-b border-black">
            <p className="text-xs font-bold uppercase mb-1">Itens:</p>
            {order.items.map((item, idx) => (
              <div key={idx} className="text-[11px] mb-1">
                <div className="flex justify-between">
                  <span>{item.quantity}x {item.productName} ({item.sizeName})</span>
                  <span>R$ {item.subtotal.toFixed(2)}</span>
                </div>
                {item.filling && <div className="pl-2">- Recheio: {item.filling}</div>}
                {item.complements && item.complements.length > 0 && (
                  <div className="pl-2">- Comp: {item.complements.join(', ')}</div>
                )}
                {item.extras && item.extras.length > 0 && (
                  <div className="pl-2">- Ext: {item.extras.join(', ')}</div>
                )}
                {item.notes && <div className="pl-2 font-bold">- Obs: {item.notes}</div>}
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>R$ {order.subtotal.toFixed(2)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span>Taxa Entrega:</span>
                <span>R$ {order.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span>Desconto:</span>
                <span>- R$ {order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm pt-1 border-t border-black">
              <span>TOTAL:</span>
              <span>R$ {order.total.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-center mt-2">Pagamento: {order.paymentMethod.toUpperCase()}</p>
            <p className="text-[10px] text-center italic mt-1">Obrigado pela preferência!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
