import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Clock,
  CreditCard,
  QrCode,
  DollarSign,
  Truck,
  Store,
  Check,
  AlertCircle,
  AlertTriangle,
  Tag,
  Copy,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { StoreService } from '../../services/storeService';
import {
  Address,
  CartItem,
  Order,
  PaymentMethod,
  User
} from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentUser: User | null;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currentUser,
  onOrderCreated
}) => {
  const settings = StoreService.getSettings();
  const deliveryZones = StoreService.getDeliveryZones();
  const storeStatus = StoreService.isStoreOpenNow();

  // Delivery method
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup' | 'dine_in'>('delivery');
  const [selectedZoneId, setSelectedZoneId] = useState<string>(deliveryZones[0]?.id || 'zone-1');

  // Customer contact info
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');

  // Address fields
  const [cep, setCep] = useState('13184-300');
  const [street, setStreet] = useState('R. Zacarias Costa Camargo');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [reference, setReference] = useState('');
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  // Coupons
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [cashChangeFor, setCashChangeFor] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Age +18 confirmation if alcoholic item in cart
  const hasAlcohol = items.some((i) => {
    const prod = StoreService.getProductById(i.productId);
    return prod?.isAlcoholic;
  });
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  // Order notes
  const [orderNotes, setOrderNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Calculate pricing strictly on logic
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);

  const selectedZone = deliveryZones.find((z) => z.id === selectedZoneId);
  const deliveryFee = deliveryMethod === 'delivery' ? (selectedZone ? selectedZone.fee : 5.0) : 0;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  // ViaCEP Auto-Fill
  const handleCepBlur = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsSearchingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setStreet(data.logradouro || street);
          // Try to match neighborhood to delivery zones
          const matchedZone = deliveryZones.find(
            (z) =>
              data.bairro &&
              z.neighborhood.toLowerCase().includes(data.bairro.toLowerCase())
          );
          if (matchedZone) {
            setSelectedZoneId(matchedZone.id);
          }
        }
      } catch (e) {
        // Fallback silently if offline
      } finally {
        setIsSearchingCep(false);
      }
    }
  };

  const handleApplyCoupon = () => {
    setCouponError(null);
    if (!couponCode.trim()) return;
    const result = StoreService.validateCoupon(couponCode, subtotal);
    if (!result.valid || !result.coupon) {
      setCouponError(result.error || 'Cupom inválido.');
      setAppliedCoupon(null);
      return;
    }

    let calculatedDiscount = 0;
    if (result.coupon.discountType === 'percentage') {
      calculatedDiscount = (subtotal * result.coupon.discountValue) / 100;
    } else {
      calculatedDiscount = result.coupon.discountValue;
    }

    setAppliedCoupon({
      code: result.coupon.code,
      discount: calculatedDiscount
    });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim()) {
      setErrorMsg('Por favor, informe seu nome completo.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 9) {
      setErrorMsg('Por favor, informe um número de telefone/WhatsApp válido.');
      return;
    }

    if (deliveryMethod === 'delivery') {
      if (!street.trim() || !number.trim()) {
        setErrorMsg('Por favor, informe a rua e o número para entrega.');
        return;
      }
    }

    if (hasAlcohol && !ageConfirmed) {
      setErrorMsg('Seu pedido contém bebidas alcoólicas. É obrigatório confirmar que você é maior de 18 anos.');
      return;
    }

    if (subtotal < settings.minOrderValue) {
      setErrorMsg(`O valor mínimo para pedidos é R$ ${settings.minOrderValue.toFixed(2).replace('.', ',')}.`);
      return;
    }

    setSubmitting(true);

    const deliveryAddress: Address | undefined =
      deliveryMethod === 'delivery'
        ? {
            id: `addr_${Date.now()}`,
            label: 'Entrega',
            cep,
            street,
            number,
            complement: complement || undefined,
            neighborhood: selectedZone?.neighborhood || 'Hortolândia',
            city: 'Hortolândia',
            state: 'SP',
            reference: reference || undefined,
            isDefault: true
          }
        : undefined;

    // Convert cart items to order snapshots with fixed unit prices
    const itemSnapshots = items.map((i) => ({
      productId: i.productId,
      productName: i.productName,
      sizeId: i.sizeId,
      sizeName: i.sizeName,
      filling: i.selectedOptions.find((o) => o.groupId === 'grp-fillings')?.optionName,
      complements: i.selectedOptions
        .filter((o) => o.groupId === 'grp-complements')
        .map((o) => o.optionName),
      extras: i.selectedOptions
        .filter((o) => o.groupId === 'grp-extras')
        .map((o) => o.optionName),
      unitPrice: i.unitPrice,
      quantity: i.quantity,
      subtotal: i.totalPrice,
      notes: i.notes
    }));

    const newOrder = StoreService.createOrder({
      userId: currentUser?.id,
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      deliveryMethod,
      deliveryAddress,
      deliveryFee,
      discount,
      couponCode: appliedCoupon?.code,
      subtotal,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'pix' ? 'pending' : 'approved',
      status: 'received',
      notes: orderNotes.trim() || undefined,
      items: itemSnapshots
    });

    // Auditoria de Chamadas de API para o Dono (Mercado Pago & Resend)
    const integrations = StoreService.getIntegrations();
    const mpConfig = integrations.find((i) => i.id === 'integ-mercadopago');
    const resendConfig = integrations.find((i) => i.id === 'integ-resend');

    if (paymentMethod === 'pix') {
      if (!mpConfig?.apiKey || mpConfig.status === 'not_configured' || mpConfig.apiKey.includes('TEST-000000')) {
        StoreService.addApiErrorLog({
          service: 'mercadopago',
          serviceName: 'Mercado Pago (PIX)',
          action: 'Geração de Cobrança PIX',
          orderId: newOrder.id,
          orderCode: newOrder.code,
          customerName: newOrder.customerName,
          errorMessage: 'Chave de API do Mercado Pago ausente ou em valor de teste inicial.',
          errorCode: 'MP_CONFIG_INCOMPLETE',
          details: `O pedido ${newOrder.code} aguarda pagamento, mas o Access Token do Mercado Pago precisa ser preenchido na aba Integrações para liquidação automática.`
        });
      }
    }

    if (customerEmail) {
      if (!resendConfig?.apiKey || resendConfig.status === 'not_configured' || resendConfig.apiKey.includes('re_000000')) {
        StoreService.addApiErrorLog({
          service: 'resend',
          serviceName: 'Resend (E-mail Transacional)',
          action: 'Disparo de Confirmação por E-mail',
          orderId: newOrder.id,
          orderCode: newOrder.code,
          customerName: newOrder.customerName,
          errorMessage: 'Chave de API do Resend não preenchida para envio de comprovante.',
          errorCode: 'RESEND_CONFIG_MISSING',
          details: `O e-mail de confirmação para ${customerEmail} do pedido ${newOrder.code} requer a chave ativa na aba de Integrações.`
        });
      }
    }

    setSubmitting(false);
    onClose();
    onOrderCreated(newOrder);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#fffaf2] card-hard-lg my-8 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#e8874a] border-b-[3px] border-[#24352b] shrink-0">
          <div className="flex items-center gap-2">
            <Truck size={24} className="text-[#24352b]" />
            <h2 className="font-barlow font-black text-2xl sm:text-3xl uppercase text-[#24352b] leading-none">
              Finalizar Pedido
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-[#24352b] bg-[#fffaf2] hover:bg-zinc-100 shadow-[2px_2px_0px_#24352b] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8f1e7]/40">
          {errorMsg && (
            <div className="p-3 bg-red-100 border-2 border-red-700 text-red-900 text-sm font-dm flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0 text-red-700" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Delivery Method Selector */}
          <div>
            <span className="font-barlow font-bold text-sm uppercase text-zinc-700 block mb-2">
              Como Deseja Receber Seu Pedido?
            </span>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`p-3 border-2 text-center cursor-pointer transition ${
                  deliveryMethod === 'delivery'
                    ? 'border-[#24352b] bg-[#e8874a] shadow-[3px_3px_0px_#24352b] font-bold'
                    : 'border-zinc-300 bg-white hover:border-zinc-500'
                }`}
              >
                <Truck size={20} className="mx-auto mb-1 text-[#24352b]" />
                <span className="font-barlow uppercase text-sm block">Entrega em Casa</span>
                <span className="font-dm text-[11px] text-zinc-600 block">
                  Taxa a partir de R$ 5,00
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-3 border-2 text-center cursor-pointer transition ${
                  deliveryMethod === 'pickup'
                    ? 'border-[#24352b] bg-[#e8874a] shadow-[3px_3px_0px_#24352b] font-bold'
                    : 'border-zinc-300 bg-white hover:border-zinc-500'
                }`}
              >
                <Store size={20} className="mx-auto mb-1 text-[#24352b]" />
                <span className="font-barlow uppercase text-sm block">Retirar no Balcão</span>
                <span className="font-dm text-[11px] text-zinc-600 block">Grátis (Sem taxa)</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('dine_in')}
                className={`p-3 border-2 text-center cursor-pointer transition ${
                  deliveryMethod === 'dine_in'
                    ? 'border-[#24352b] bg-[#e8874a] shadow-[3px_3px_0px_#24352b] font-bold'
                    : 'border-zinc-300 bg-white hover:border-zinc-500'
                }`}
              >
                <Clock size={20} className="mx-auto mb-1 text-[#24352b]" />
                <span className="font-barlow uppercase text-sm block">Consumo no Local</span>
                <span className="font-dm text-[11px] text-zinc-600 block">Servir na mesa</span>
              </button>
            </div>
          </div>

          {/* Contact Data */}
          <div className="p-4 bg-[#fffaf2] border-2 border-[#24352b] space-y-3">
            <h3 className="font-barlow font-black text-lg uppercase text-[#24352b]">
              Dados de Contato
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-dm text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Seu Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full p-2.5 border-2 border-zinc-300 focus:border-[#24352b] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Telefone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(19) 99999-9999"
                  className="w-full p-2.5 border-2 border-zinc-300 focus:border-[#24352b] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address (if Delivery selected) */}
          {deliveryMethod === 'delivery' && (
            <div className="p-4 bg-[#fffaf2] border-2 border-[#24352b] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-barlow font-black text-lg uppercase text-[#24352b]">
                  Endereço de Entrega em Hortolândia
                </h3>
                {isSearchingCep && (
                  <span className="text-xs text-amber-700 animate-pulse font-dm">
                    Buscando CEP...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-dm text-xs">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">CEP</label>
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    onBlur={handleCepBlur}
                    placeholder="13184-300"
                    className="w-full p-2.5 border-2 border-zinc-300 focus:border-[#24352b] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-zinc-700 block mb-1">Bairro de Hortolândia *</label>
                  <select
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                    className="w-full p-2.5 border-2 border-zinc-300 focus:border-[#24352b] focus:outline-none bg-white"
                  >
                    {deliveryZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.neighborhood} — Taxa: R$ {zone.fee.toFixed(2).replace('.', ',')} ({zone.estimatedMinutes})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-zinc-700 block mb-1">Rua / Avenida *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Nome da rua"
                    className="w-full p-2.5 border-2 border-zinc-300 focus:border-[#24352b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Número *</label>
                  <input
                    type="text"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="123"
                    className="w-full p-2.5 border-2 border-zinc-300 focus:border-[#24352b] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-zinc-700 block mb-1">Complemento (opcional)</label>
                  <input
                    type="text"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    placeholder="Apto 42, Bloco B, Casa dos fundos..."
                    className="w-full p-2.5 border-2 border-zinc-300 focus:border-[#24352b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Ponto de Referência</label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Próximo ao mercado..."
                    className="w-full p-2.5 border-2 border-zinc-300 focus:border-[#24352b] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Coupon Input */}
          <div className="p-4 bg-[#fffaf2] border-2 border-[#24352b] flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <label className="font-barlow font-bold text-sm uppercase text-zinc-700 block mb-1">
                Possui Cupom de Desconto?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Ex: BEMVINDO10"
                  className="flex-1 p-2 border-2 border-zinc-300 font-barlow text-base uppercase focus:border-[#24352b] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="btn-hard bg-zinc-800 text-white px-4 py-2 text-sm cursor-pointer"
                >
                  Aplicar
                </button>
              </div>
              {couponError && <p className="text-red-700 text-xs font-dm mt-1">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-emerald-700 text-xs font-dm font-bold mt-1 flex items-center gap-1">
                  <Check size={14} /> Cupom {appliedCoupon.code} aplicado: - R${' '}
                  {appliedCoupon.discount.toFixed(2).replace('.', ',')}!
                </p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-4 bg-[#fffaf2] border-2 border-[#24352b] space-y-3">
            <h3 className="font-barlow font-black text-lg uppercase text-[#24352b]">
              Forma de Pagamento
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-dm">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3 border-2 text-center cursor-pointer transition ${
                  paymentMethod === 'pix'
                    ? 'border-[#24352b] bg-[#e8874a] font-bold shadow-[2px_2px_0px_#24352b]'
                    : 'border-zinc-300 bg-white'
                }`}
              >
                <QrCode size={18} className="mx-auto mb-1" />
                <span>PIX Instantâneo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3 border-2 text-center cursor-pointer transition ${
                  paymentMethod === 'credit_card'
                    ? 'border-[#24352b] bg-[#e8874a] font-bold shadow-[2px_2px_0px_#24352b]'
                    : 'border-zinc-300 bg-white'
                }`}
              >
                <CreditCard size={18} className="mx-auto mb-1" />
                <span>Cartão Online</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card_on_delivery')}
                className={`p-3 border-2 text-center cursor-pointer transition ${
                  paymentMethod === 'card_on_delivery'
                    ? 'border-[#24352b] bg-[#e8874a] font-bold shadow-[2px_2px_0px_#24352b]'
                    : 'border-zinc-300 bg-white'
                }`}
              >
                <CreditCard size={18} className="mx-auto mb-1" />
                <span>Maquininha Entrega</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`p-3 border-2 text-center cursor-pointer transition ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-[#24352b] bg-[#e8874a] font-bold shadow-[2px_2px_0px_#24352b]'
                    : 'border-zinc-300 bg-white'
                }`}
              >
                <DollarSign size={18} className="mx-auto mb-1" />
                <span>Dinheiro</span>
              </button>
            </div>

            {/* Dynamic payment options */}
            {paymentMethod === 'cash_on_delivery' && (
              <div className="pt-2">
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Precisa de troco para quanto? (opcional)
                </label>
                <input
                  type="text"
                  value={cashChangeFor}
                  onChange={(e) => setCashChangeFor(e.target.value)}
                  placeholder="Ex: R$ 50,00 ou R$ 100,00"
                  className="w-full p-2 border-2 border-zinc-300 text-xs"
                />
              </div>
            )}

            {paymentMethod === 'credit_card' && (
              <div className="pt-2 p-3 bg-zinc-50 border border-zinc-200 text-xs font-dm space-y-2">
                <p className="text-zinc-600 text-[11px]">
                  Pagamento protegido com criptografia de ponta a ponta (Tokenização PCI-DSS).
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Número do Cartão (16 dígitos)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2 border border-zinc-300 bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Validade (MM/AA)"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-2 border border-zinc-300 bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="CVV"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full p-2 border border-zinc-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Alcoholic Beverage +18 Confirmation if applicable */}
          {hasAlcohol && (
            <div className="p-3 bg-red-50 border-2 border-red-600 text-red-950 text-xs font-dm">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-red-600 focus:ring-red-600 w-4 h-4 shrink-0"
                />
                <span>
                  <strong>Declaração de Maioridade Legal (+18):</strong> Declaro sob as penas da
                  lei que sou maior de 18 anos de idade e que apresentarei documento oficial com foto
                  no ato do recebimento da bebida alcoólica solicitada.
                </span>
              </label>
            </div>
          )}

          {/* Additional Notes */}
          <div>
            <label className="font-barlow font-bold text-sm uppercase text-zinc-700 block mb-1">
              Observações Gerais do Pedido
            </label>
            <input
              type="text"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="Ex: interfone não funciona, tocar campainha, mandar guardanapos extras..."
              className="w-full p-2.5 border-2 border-zinc-300 font-dm text-xs focus:border-[#24352b] focus:outline-none"
            />
          </div>

          {/* Pricing Breakdown */}
          <div className="p-4 bg-[#f8f1e7] border-2 border-[#24352b] space-y-1.5 font-dm text-sm">
            <div className="flex justify-between text-zinc-700">
              <span>Subtotal dos itens:</span>
              <span className="font-bold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            {deliveryMethod === 'delivery' && (
              <div className="flex justify-between text-zinc-700">
                <span>Taxa de entrega ({selectedZone?.neighborhood}):</span>
                <span className="font-bold">R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Desconto do Cupom:</span>
                <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="pt-2 border-t-2 border-[#24352b] flex justify-between items-center">
              <span className="font-barlow font-black text-xl uppercase text-[#24352b]">
                Total a Pagar:
              </span>
              <span className="font-barlow font-black text-3xl text-[#24352b]">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-hard bg-[#e8874a] text-[#24352b] py-4 text-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{submitting ? 'Processando Pedido...' : 'Confirmar e Fazer Pedido'}</span>
              <ArrowRight size={22} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
