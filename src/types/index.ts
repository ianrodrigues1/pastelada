/**
 * Core Type Definitions for Pastelada
 * Strict typing across Catalog, Orders, Auth, RBAC, Settings, Integrations, and LGPD
 */

export type UserRole = 'OWNER' | 'ADMIN' | 'STAFF' | 'CLIENTE' | 'SUPORTE';

export type StaffPermission =
  | 'pedidos.ver'
  | 'pedidos.alterar_status'
  | 'pedidos.cancelar'
  | 'cardapio.editar'
  | 'precos.editar'
  | 'ingredientes.editar'
  | 'conteudo_site.editar'
  | 'loja.configurar'
  | 'cupons.gerenciar'
  | 'relatorios.ver'
  | 'clientes.ver'
  | 'lgpd.atender'
  | 'equipe.gerenciar'
  | 'pagamentos.configurar'
  | 'integracoes.gerenciar';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: UserRole;
  permissions: StaffPermission[];
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  recoveryCodes?: string[];
  active: boolean;
  createdAt: string;
  lastLoginAt?: string;
  deletedAt?: string | null;
}

export interface StaffInvite {
  id: string;
  email: string;
  role: UserRole;
  permissions: StaffPermission[];
  presetTitle?: string; // 'Gerente' | 'Atendente' | 'Cozinha' | 'Marketing'
  createdAt: string;
  expiresAt: string;
  invitedBy: string;
}

export interface Address {
  id: string;
  userId?: string;
  label: string; // ex: 'Casa', 'Trabalho'
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  reference?: string;
  isDefault: boolean;
}

export type PastelSizeId = 'tubete' | 'convencional' | 'tubetinho' | 'especial';

export interface PastelSizeConfig {
  id: PastelSizeId;
  name: string;
  dimensions: string; // '30 x 6 cm' | '30 x 10 cm' | '30 x 20 cm'
  fillingWeight: string; // '150 g' | '240 g'
  description: string;
  minPrice: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  active: boolean;
  archivedAt?: string | null;
}

export interface ProductOption {
  id: string;
  name: string;
  description?: string;
  pricesBySize: Record<PastelSizeId, number>; // e.g. { tubete: 8, convencional: 8 }
  isAvailable: boolean;
  archivedAt?: string | null;
  needsConfirmation?: boolean; // For [CONFIRMAR] flagged items
}

export interface OptionGroup {
  id: string;
  title: string;
  description: string;
  type: 'filling' | 'complement' | 'extra';
  minSelections: number;
  maxSelections: number;
  required: boolean;
  options: ProductOption[];
  active: boolean;
  archivedAt?: string | null;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl?: string;
  availableSizes: PastelSizeId[];
  pricesBySize: Record<PastelSizeId, number>;
  isCustomizable: boolean; // Enables "Do seu jeito" builder
  optionGroupIds?: string[];
  isAlcoholic?: boolean;
  isFeatured?: boolean;
  isAvailable: boolean;
  archivedAt?: string | null;
  needsConfirmation?: boolean; // For [CONFIRMAR] items in initial seed
}

export interface CartCustomItemOption {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  sizeId: PastelSizeId;
  sizeName: string;
  basePrice: number;
  selectedOptions: CartCustomItemOption[];
  notes?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash_on_delivery' | 'card_on_delivery';
export type PaymentStatus = 'pending' | 'approved' | 'failed' | 'refunded';

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  sizeId: PastelSizeId;
  sizeName: string;
  filling?: string;
  complements?: string[];
  extras?: string[];
  unitPrice: number;
  quantity: number;
  subtotal: number;
  notes?: string;
}

export interface Order {
  id: string;
  code: string; // e.g. "SP-8492"
  trackingToken: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryMethod: 'delivery' | 'pickup' | 'dine_in';
  deliveryAddress?: Address;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  pixQrCodeUrl?: string;
  pixCopyPasteCode?: string;
  status: OrderStatus;
  cancellationReason?: string;
  notes?: string;
  items: OrderItemSnapshot[];
  timeline: {
    status: OrderStatus;
    timestamp: string;
    description: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt?: string;
}

export interface BusinessDayHours {
  open: string; // '17:00'
  close: string; // '22:45'
  isOpenToday: boolean;
}

export interface DeliveryZone {
  id: string;
  neighborhood: string;
  fee: number;
  estimatedMinutes: string;
  active: boolean;
}

export interface StoreSettings {
  name: string;
  segment: string;
  address: string;
  cep: string;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  whatsappUrl: string;
  instagramUrl: string;
  ticketMedio: string;
  services: string[];
  businessHours: Record<string, BusinessDayHours>; // 'seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'
  isPaused: boolean;
  pauseReason?: string;
  prepTimeMinutes: string; // '25-40 min'
  minOrderValue: number;
  freeDeliveryThreshold?: number;
  acceptedPaymentMethods: PaymentMethod[];
  featuredProductIds: string[]; // 3 IDs shown in "Os mais pedidos"
  brandColors: {
    yellow: string; // '#e8874a'
    black: string; // '#24352b'
    cream: string; // '#f8f1e7'
    white: string; // '#fffaf2'
  };
  dpoEmail: string;
  privacyVersion: string;
  allowGuestCheckout: boolean;
}

export interface IntegrationConfig {
  id: string;
  service: 'payment' | 'email' | 'google_oauth' | 'storage' | 'encryption';
  providerName: string;
  status: 'connected' | 'error' | 'not_configured';
  environment: 'sandbox' | 'production';
  apiKey: string; // The editable raw API key / access token
  maskedApiKey: string;
  publicKey?: string;
  webhookSecret?: string;
  pixKey?: string;
  senderEmail?: string;
  clientId?: string;
  clientSecret?: string;
  lastTestedAt?: string;
  lastTestSuccess?: boolean;
  lastErrorMessage?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId?: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
  ipAddress: string;
}

export interface ConsentRecord {
  id: string;
  userId?: string;
  ipAddress: string;
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  policyVersion: string;
  timestamp: string;
}

export interface LgpdDataRequest {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  requestType: 'export_data' | 'delete_account' | 'revoke_consent';
  status: 'pending' | 'completed' | 'rejected';
  requestedAt: string;
  completedAt?: string;
  adminNotes?: string;
}

export interface ApiErrorLog {
  id: string;
  service: 'mercadopago' | 'resend' | 'google' | 'other';
  serviceName: string;
  action: string;
  orderId?: string;
  orderCode?: string;
  customerName?: string;
  errorMessage: string;
  errorCode?: string | number;
  details?: string;
  timestamp: string;
  status: 'unresolved' | 'resolved';
  resolvedAt?: string;
  resolvedBy?: string;
}

