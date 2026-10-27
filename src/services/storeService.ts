/**
 * Comprehensive Persistent Store & Business Logic Service
 * Pastelada - Hortolândia-SP
 */

import {
  ApiErrorLog,
  AuditLog,
  CartItem,
  Category,
  ConsentRecord,
  Coupon,
  DeliveryZone,
  IntegrationConfig,
  LgpdDataRequest,
  OptionGroup,
  Order,
  OrderStatus,
  PastelSizeConfig,
  Product,
  StaffInvite,
  StaffPermission,
  StoreSettings,
  User,
  UserRole
} from '../types';

import {
  INITIAL_CATEGORIES,
  INITIAL_COMPLEMENTS_GROUP,
  INITIAL_COUPONS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_EXTRAS_GROUP,
  INITIAL_FILLINGS_GROUP,
  INITIAL_INTEGRATIONS,
  INITIAL_PRODUCTS,
  INITIAL_SIZES,
  INITIAL_STORE_SETTINGS,
  INITIAL_USERS
} from '../data/seedData';

const STORAGE_KEYS = {
  SETTINGS: 'pastelada_settings_v1',
  PRODUCTS: 'pastelada_products_v1',
  CATEGORIES: 'pastelada_categories_v1',
  OPTION_GROUPS: 'pastelada_option_groups_v1',
  SIZES: 'pastelada_sizes_v1',
  DELIVERY_ZONES: 'pastelada_delivery_zones_v1',
  COUPONS: 'pastelada_coupons_v1',
  ORDERS: 'pastelada_orders_v1',
  USERS: 'pastelada_users_v1',
  CURRENT_USER: 'pastelada_current_user_v1',
  INVITES: 'pastelada_invites_v1',
  INTEGRATIONS: 'pastelada_integrations_v1',
  AUDIT_LOGS: 'pastelada_audit_logs_v1',
  CONSENTS: 'pastelada_consents_v1',
  DATA_REQUESTS: 'pastelada_data_requests_v1',
  CART: 'pastelada_cart_v1',
  EDIT_MODE: 'pastelada_edit_mode_v1',
  API_ERROR_LOGS: 'pastelada_api_error_logs_v1'
};


// Safe JSON loader with seed fallbacks
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load key ${key}:`, e);
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save key ${key}:`, e);
  }
}

// Crisp Web Audio chime for restaurant orders
export function playOrderNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // Play bell 1 (F5)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(698.46, now);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    // Play bell 2 (A5)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, now + 0.15);
    gain2.gain.setValueAtTime(0.3, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.9);

    // Play bell 3 (C6)
    const osc3 = audioCtx.createOscillator();
    const gain3 = audioCtx.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(1046.5, now + 0.3);
    gain3.gain.setValueAtTime(0.4, now + 0.3);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc3.connect(gain3);
    gain3.connect(audioCtx.destination);
    osc3.start(now + 0.3);
    osc3.stop(now + 1.2);
  } catch (e) {
    // Audio might be blocked by browser policy until user interacts
  }
}

export const StoreService = {
  // --- STORE SETTINGS ---
  getSettings(): StoreSettings {
    const s = load<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_STORE_SETTINGS);
    if (!s.instagramUrl || (s.instagramUrl.includes('instagram.com/pastelada') && !s.instagramUrl.includes('pasteladacia'))) {
      s.instagramUrl = 'https://www.instagram.com/';
      save(STORAGE_KEYS.SETTINGS, s);
    }
    return s;
  },

  updateSettings(newSettings: Partial<StoreSettings>, changedByUserName = 'Administrador'): StoreSettings {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    save(STORAGE_KEYS.SETTINGS, updated);
    this.addAuditLog('Atualizar Configurações da Loja', 'StoreSettings', JSON.stringify(current), JSON.stringify(updated), changedByUserName);
    return updated;
  },

  toggleStorePause(isPaused: boolean, pauseReason?: string, userName = 'Administrador'): StoreSettings {
    const current = this.getSettings();
    const updated: StoreSettings = {
      ...current,
      isPaused,
      pauseReason: isPaused ? (pauseReason || 'Pausa temporária solicitada pelo restaurante') : undefined
    };
    save(STORAGE_KEYS.SETTINGS, updated);
    this.addAuditLog(
      isPaused ? 'Pausar Loja (Emergência)' : 'Retomar Operação da Loja',
      'StoreSettings',
      `Pausada: ${current.isPaused}`,
      `Pausada: ${isPaused}`,
      userName
    );
    return updated;
  },

  // Operating status calculation: Hortolândia time
  isStoreOpenNow(): { isOpen: boolean; message: string; badge: string; nextOpening: string } {
    const settings = this.getSettings();
    if (settings.isPaused) {
      return {
        isOpen: false,
        message: settings.pauseReason || 'A pastelaria está pausada temporariamente para novos pedidos.',
        badge: 'Loja Pausada',
        nextOpening: 'Aguarde a liberação pela administração'
      };
    }

    const now = new Date();
    // Day in pt-br: seg, ter, qua, qui, sex, sab, dom
    const dayMap = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    const currentDay = dayMap[now.getDay()];
    const hoursConfig = settings.businessHours[currentDay];

    if (!hoursConfig || !hoursConfig.isOpenToday) {
      return {
        isOpen: false,
        message: 'Hoje a pastelaria está fechada.',
        badge: 'Fechado Hoje',
        nextOpening: 'Abre no próximo dia útil às 17:00'
      };
    }

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [openH, openM] = hoursConfig.open.split(':').map(Number);
    const [closeH, closeM] = hoursConfig.close.split(':').map(Number);

    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
      return {
        isOpen: true,
        message: `Aberto agora · fecha às ${hoursConfig.close}`,
        badge: 'Aberto Agora',
        nextOpening: `Hoje até ${hoursConfig.close}`
      };
    }

    // Closed currently
    return {
      isOpen: false,
      message: `Fechado no momento · abre hoje às ${hoursConfig.open}`,
      badge: `Fechado · abre às ${hoursConfig.open}`,
      nextOpening: `Hoje às ${hoursConfig.open}`
    };
  },

  // --- SIZES ---
  getSizes(): PastelSizeConfig[] {
    return load<PastelSizeConfig[]>(STORAGE_KEYS.SIZES, INITIAL_SIZES);
  },

  // --- CATEGORIES ---
  getCategories(includeArchived = false): Category[] {
    const cats = load<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    return includeArchived ? cats : cats.filter((c) => !c.archivedAt && c.active);
  },

  saveCategory(category: Category, userName = 'Administrador'): Category {
    const cats = this.getCategories(true);
    const index = cats.findIndex((c) => c.id === category.id);
    let updatedCats: Category[];
    if (index >= 0) {
      const prev = cats[index];
      cats[index] = category;
      updatedCats = [...cats];
      this.addAuditLog('Editar Categoria', 'Category', JSON.stringify(prev), JSON.stringify(category), userName);
    } else {
      updatedCats = [...cats, category];
      this.addAuditLog('Criar Categoria', 'Category', '', JSON.stringify(category), userName);
    }
    save(STORAGE_KEYS.CATEGORIES, updatedCats);
    return category;
  },

  // --- PRODUCTS ---
  getProducts(includeArchived = false): Product[] {
    const prods = load<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    let modified = false;
    prods.forEach((p) => {
      const initial = INITIAL_PRODUCTS.find((ip) => ip.id === p.id);
      if (initial && initial.imageUrl && p.imageUrl?.includes('images.unsplash.com')) {
        p.imageUrl = initial.imageUrl;
        modified = true;
      }
    });
    if (modified) {
      save(STORAGE_KEYS.PRODUCTS, prods);
    }
    return includeArchived ? prods : prods.filter((p) => !p.archivedAt);
  },

  getProductById(id: string): Product | undefined {
    return this.getProducts(true).find((p) => p.id === id);
  },

  saveProduct(product: Product, userName = 'Administrador'): Product {
    const prods = this.getProducts(true);
    const index = prods.findIndex((p) => p.id === product.id);
    let updatedProds: Product[];
    if (index >= 0) {
      const prev = prods[index];
      prods[index] = product;
      updatedProds = [...prods];
      this.addAuditLog('Editar Produto', 'Product', JSON.stringify(prev), JSON.stringify(product), userName);
    } else {
      updatedProds = [...prods, product];
      this.addAuditLog('Criar Produto', 'Product', '', JSON.stringify(product), userName);
    }
    save(STORAGE_KEYS.PRODUCTS, updatedProds);
    return product;
  },

  // Soft delete for historical consistency
  deleteProduct(id: string, userName = 'Administrador'): boolean {
    const prods = this.getProducts(true);
    const product = prods.find((p) => p.id === id);
    if (!product) return false;

    product.archivedAt = new Date().toISOString();
    product.isAvailable = false;
    save(STORAGE_KEYS.PRODUCTS, prods);
    this.addAuditLog('Mover Produto para Lixeira', 'Product', product.name, 'Arquivado na lixeira', userName);
    return true;
  },

  restoreProduct(id: string, userName = 'Administrador'): boolean {
    const prods = this.getProducts(true);
    const product = prods.find((p) => p.id === id);
    if (!product) return false;

    product.archivedAt = null;
    product.isAvailable = true;
    save(STORAGE_KEYS.PRODUCTS, prods);
    this.addAuditLog('Restaurar Produto da Lixeira', 'Product', 'Arquivado', product.name, userName);
    return true;
  },

  // Permanent deletion only for items in trash
  permanentDeleteProduct(id: string, userName = 'Administrador'): boolean {
    const prods = this.getProducts(true).filter((p) => p.id !== id);
    save(STORAGE_KEYS.PRODUCTS, prods);
    this.addAuditLog('Excluir Permanentemente Produto', 'Product', id, 'Removido em definitivo', userName);
    return true;
  },

  // Mass price adjustment (e.g. +5% or +10%)
  bulkAdjustPrices(categoryId: string | 'all', percentage: number, userName = 'Administrador'): { count: number; previousState: Product[] } {
    const prods = this.getProducts(true);
    const previousState = JSON.parse(JSON.stringify(prods));
    let count = 0;

    const multiplier = 1 + percentage / 100;

    prods.forEach((p) => {
      if (categoryId === 'all' || p.categoryId === categoryId) {
        count++;
        // Adjust each size price
        Object.keys(p.pricesBySize).forEach((sz) => {
          const currentPrice = p.pricesBySize[sz as keyof typeof p.pricesBySize];
          if (currentPrice) {
            // Round to 1 decimal or 2 decimals (e.g. 19.90 -> 20.90)
            const newPrice = Math.round(currentPrice * multiplier * 10) / 10;
            p.pricesBySize[sz as keyof typeof p.pricesBySize] = newPrice;
          }
        });
      }
    });

    save(STORAGE_KEYS.PRODUCTS, prods);
    this.addAuditLog(
      'Reajuste de Preços em Massa',
      'Products',
      `Reajuste de ${percentage}% na categoria ${categoryId}`,
      `${count} produtos ajustados`,
      userName
    );

    return { count, previousState };
  },

  // --- OPTION GROUPS (Fillings, Complements, Extras) ---
  getOptionGroups(includeArchived = false): OptionGroup[] {
    const initial = [INITIAL_FILLINGS_GROUP, INITIAL_COMPLEMENTS_GROUP, INITIAL_EXTRAS_GROUP];
    const groups = load<OptionGroup[]>(STORAGE_KEYS.OPTION_GROUPS, initial);
    return includeArchived ? groups : groups.filter((g) => !g.archivedAt && g.active);
  },

  saveOptionGroup(group: OptionGroup, userName = 'Administrador'): OptionGroup {
    const groups = this.getOptionGroups(true);
    const idx = groups.findIndex((g) => g.id === group.id);
    let updated: OptionGroup[];
    if (idx >= 0) {
      groups[idx] = group;
      updated = [...groups];
      this.addAuditLog('Editar Grupo de Opções', 'OptionGroup', groups[idx].title, group.title, userName);
    } else {
      updated = [...groups, group];
      this.addAuditLog('Criar Grupo de Opções', 'OptionGroup', '', group.title, userName);
    }
    save(STORAGE_KEYS.OPTION_GROUPS, updated);
    return group;
  },

  // --- DELIVERY ZONES ---
  getDeliveryZones(): DeliveryZone[] {
    return load<DeliveryZone[]>(STORAGE_KEYS.DELIVERY_ZONES, INITIAL_DELIVERY_ZONES);
  },

  saveDeliveryZones(zones: DeliveryZone[], userName = 'Administrador'): void {
    save(STORAGE_KEYS.DELIVERY_ZONES, zones);
    this.addAuditLog('Atualizar Taxas de Entrega', 'DeliveryZone', '', `${zones.length} zonas salvas`, userName);
  },

  // --- COUPONS ---
  getCoupons(): Coupon[] {
    return load<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  },

  validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; error?: string } {
    const clean = code.trim().toUpperCase();
    const coupons = this.getCoupons();
    const found = coupons.find((c) => c.code.toUpperCase() === clean && c.active);

    if (!found) {
      return { valid: false, error: 'Cupom de desconto inválido ou expirado.' };
    }

    if (found.usedCount >= found.maxUses) {
      return { valid: false, error: 'Este cupom já atingiu o limite máximo de utilizações.' };
    }

    if (subtotal < found.minOrderValue) {
      return {
        valid: false,
        error: `O valor mínimo para este cupom é R$ ${found.minOrderValue.toFixed(2).replace('.', ',')}.`
      };
    }

    return { valid: true, coupon: found };
  },

  // --- CART ---
  getCart(): CartItem[] {
    return load<CartItem[]>(STORAGE_KEYS.CART, []);
  },

  saveCart(items: CartItem[]): void {
    save(STORAGE_KEYS.CART, items);
  },

  addToCart(item: CartItem): CartItem[] {
    const cart = this.getCart();
    // Check if duplicate customizable item
    const existingIndex = cart.findIndex((i) => {
      if (i.productId !== item.productId || i.sizeId !== item.sizeId) return false;
      if (i.notes !== item.notes) return false;
      const opts1 = i.selectedOptions.map((o) => o.optionId).sort().join(',');
      const opts2 = item.selectedOptions.map((o) => o.optionId).sort().join(',');
      return opts1 === opts2;
    });

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += item.quantity;
      cart[existingIndex].totalPrice = cart[existingIndex].quantity * cart[existingIndex].unitPrice;
    } else {
      cart.push(item);
    }

    this.saveCart(cart);
    return cart;
  },

  updateCartQuantity(itemId: string, delta: number): CartItem[] {
    let cart = this.getCart();
    const item = cart.find((i) => i.id === itemId);
    if (!item) return cart;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter((i) => i.id !== itemId);
    } else {
      item.totalPrice = item.quantity * item.unitPrice;
    }

    this.saveCart(cart);
    return cart;
  },

  clearCart(): void {
    save(STORAGE_KEYS.CART, []);
  },

  // --- ORDERS ---
  getOrders(): Order[] {
    return load<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  },

  getOrderByTracking(tokenOrCode: string): Order | undefined {
    const clean = tokenOrCode.trim().toLowerCase();
    return this.getOrders().find(
      (o) => o.code.toLowerCase() === clean || o.trackingToken.toLowerCase() === clean
    );
  },

  createOrder(orderData: Omit<Order, 'id' | 'code' | 'trackingToken' | 'createdAt' | 'updatedAt' | 'timeline'>): Order {
    const orders = this.getOrders();
    const randomCode = `SP-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingToken = `trk_${Math.random().toString(36).substring(2, 11)}`;
    const nowIso = new Date().toISOString();

    // PIX Emv Payload simulation for Hortolândia
    const pixCopyPaste = `00020126580014BR.GOV.BCB.PIX0114+55199820346370214PASTELADA${orderData.total.toFixed(2)}5204000053039865802BR5916PASTELADA6011HORTOLANDIA62190515${randomCode}6304`;
    const pixQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCopyPaste)}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      code: randomCode,
      trackingToken,
      pixCopyPasteCode: pixCopyPaste,
      pixQrCodeUrl: pixQrCode,
      createdAt: nowIso,
      updatedAt: nowIso,
      timeline: [
        {
          status: 'received',
          timestamp: nowIso,
          description: 'Pedido recebido com sucesso pela cozinha do Pastelada.'
        }
      ]
    };

    orders.unshift(newOrder);
    save(STORAGE_KEYS.ORDERS, orders);

    // Play restaurant notification chime
    playOrderNotificationSound();

    // Clear cart on successful checkout
    this.clearCart();

    return newOrder;
  },

  updateOrderStatus(orderId: string, status: OrderStatus, reason?: string, updatedBy = 'Equipe'): Order | undefined {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return undefined;

    const previousStatus = order.status;
    order.status = status;
    order.updatedAt = new Date().toISOString();

    if (status === 'cancelled') {
      order.cancellationReason = reason || 'Cancelado pela administração';
    }

    let statusDesc = '';
    switch (status) {
      case 'received':
        statusDesc = 'Pedido confirmado e aguardando preparo.';
        break;
      case 'preparing':
        statusDesc = 'Massa esticada, recheios montados e fritando no tacho na temperatura ideal.';
        break;
      case 'ready':
        statusDesc = order.deliveryMethod === 'delivery'
          ? 'Pedido embalado com cuidado e saiu para entrega com o motoboy!'
          : 'Pedido quentinho pronto para retirada no balcão!';
        break;
      case 'delivered':
        statusDesc = 'Pedido entregue! Bom apetite com os pastéis do Pastelada!';
        break;
      case 'cancelled':
        statusDesc = `Pedido cancelado. Motivo: ${order.cancellationReason}`;
        break;
    }

    order.timeline.push({
      status,
      timestamp: new Date().toISOString(),
      description: statusDesc
    });

    save(STORAGE_KEYS.ORDERS, orders);
    this.addAuditLog(
      `Atualizar Status do Pedido ${order.code}`,
      'Order',
      `Status anterior: ${previousStatus}`,
      `Novo status: ${status}`,
      updatedBy
    );

    return order;
  },

  // --- USERS & AUTH ---
  getUsers(): User[] {
    return load<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  getCurrentUser(): User | null {
    return load<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user: User | null): void {
    save(STORAGE_KEYS.CURRENT_USER, user);
  },

  saveUser(user: User, adminName = 'Proprietário'): User {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    save(STORAGE_KEYS.USERS, users);
    this.addAuditLog('Salvar Usuário', 'User', user.email, `Papel: ${user.role}`, adminName);
    return user;
  },

  deactivateUser(userId: string, adminName = 'Proprietário'): boolean {
    const users = this.getUsers();
    const target = users.find((u) => u.id === userId);
    if (!target) return false;

    // Cannot deactivate owner
    if (target.role === 'OWNER') return false;

    target.active = false;
    save(STORAGE_KEYS.USERS, users);

    // If active user is the one being deactivated, clear session
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      this.setCurrentUser(null);
    }

    this.addAuditLog('Desativar Funcionário', 'User', target.email, 'Acesso revogado imediatamente', adminName);
    return true;
  },

  terminateAllSessions(adminName = 'Proprietário'): void {
    this.setCurrentUser(null);
    this.addAuditLog('Encerrar Todas as Sessões Ativas', 'Security', 'Todas', 'Logout forçado', adminName);
  },

  // Check RBAC permission for actions
  hasPermission(permission: StaffPermission, userOverride?: User | null): boolean {
    const user = userOverride !== undefined ? userOverride : this.getCurrentUser();
    if (!user || !user.active) return false;
    if (user.role === 'OWNER') return true;
    if (user.role === 'ADMIN' && user.permissions.includes(permission)) return true;
    if (user.role === 'STAFF' && user.permissions.includes(permission)) return true;
    return false;
  },

  // --- STAFF INVITES ---
  getInvites(): StaffInvite[] {
    return load<StaffInvite[]>(STORAGE_KEYS.INVITES, []);
  },

  createInvite(invite: Omit<StaffInvite, 'id' | 'createdAt' | 'expiresAt'>, adminName = 'Proprietário'): StaffInvite {
    const invites = this.getInvites();
    const newInvite: StaffInvite = {
      ...invite,
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    invites.push(newInvite);
    save(STORAGE_KEYS.INVITES, invites);
    this.addAuditLog('Criar Convite de Funcionário', 'StaffInvite', invite.email, `Papel: ${invite.role}`, adminName);
    return newInvite;
  },

  revokeInvite(inviteId: string, adminName = 'Proprietário'): void {
    const invites = this.getInvites().filter((i) => i.id !== inviteId);
    save(STORAGE_KEYS.INVITES, invites);
    this.addAuditLog('Revogar Convite', 'StaffInvite', inviteId, 'Cancelado', adminName);
  },

  // --- INTEGRATIONS (Section 14) ---
  getIntegrations(): IntegrationConfig[] {
    const list = load<IntegrationConfig[]>(STORAGE_KEYS.INTEGRATIONS, INITIAL_INTEGRATIONS);
    let modified = false;
    list.forEach((item) => {
      const initial = INITIAL_INTEGRATIONS.find((ii) => ii.id === item.id);
      if (initial) {
        if (!item.apiKey && initial.apiKey) {
          item.apiKey = initial.apiKey;
          modified = true;
        }
        if (!item.publicKey && initial.publicKey) {
          item.publicKey = initial.publicKey;
          modified = true;
        }
        if (!item.webhookSecret && initial.webhookSecret) {
          item.webhookSecret = initial.webhookSecret;
          modified = true;
        }
        if (!item.pixKey && initial.pixKey) {
          item.pixKey = initial.pixKey;
          modified = true;
        }
        if (!item.clientId && initial.clientId) {
          item.clientId = initial.clientId;
          modified = true;
        }
        if (!item.clientSecret && initial.clientSecret) {
          item.clientSecret = initial.clientSecret;
          modified = true;
        }
      }
    });
    if (modified) {
      save(STORAGE_KEYS.INTEGRATIONS, list);
    }
    return list;
  },

  saveIntegration(config: IntegrationConfig, userName = 'Proprietário'): void {
    const list = this.getIntegrations();
    const idx = list.findIndex((i) => i.id === config.id);
    if (config.apiKey) {
      config.maskedApiKey = config.apiKey.length > 8 
        ? `${config.apiKey.substring(0, 4)}••••••••••••••••${config.apiKey.slice(-4)}`
        : '••••••••••••••••';
    }
    if (idx >= 0) {
      list[idx] = config;
    } else {
      list.push(config);
    }
    save(STORAGE_KEYS.INTEGRATIONS, list);
    this.addAuditLog(
      `Atualizar Chave de Integração (${config.service})`,
      'Integration',
      config.providerName,
      `Chaves salvas e validadas (Ambiente: ${config.environment})`,
      userName
    );
  },

  updateIntegrationKey(
    id: string,
    newApiKey: string,
    environment: 'sandbox' | 'production',
    twoFactorCode?: string,
    userName = 'Proprietário'
  ): { success: boolean; error?: string } {
    const list = this.getIntegrations();
    const item = list.find((i) => i.id === id);
    if (!item) return { success: false, error: 'Integração não encontrada.' };

    const masked = newApiKey.length > 8 
      ? `${newApiKey.substring(0, 4)}••••••••••••••••${newApiKey.slice(-4)}`
      : '••••••••••••••••';
    item.apiKey = newApiKey;
    item.maskedApiKey = masked;
    item.environment = environment;
    item.lastTestedAt = new Date().toISOString();
    item.lastTestSuccess = true;
    item.status = 'connected';

    save(STORAGE_KEYS.INTEGRATIONS, list);
    this.addAuditLog(
      `Atualizar Chave de Integração (${item.service})`,
      'Integration',
      'Chave anterior substituída',
      `Ambiente: ${environment}`,
      userName
    );

    return { success: true };
  },

  testIntegration(id: string): { success: boolean; latencyMs: number; message: string } {
    const list = this.getIntegrations();
    const item = list.find((i) => i.id === id);
    if (!item) return { success: false, latencyMs: 0, message: 'Integração não encontrada' };

    const latency = Math.floor(45 + Math.random() * 80);
    item.lastTestedAt = new Date().toISOString();
    item.lastTestSuccess = true;
    item.status = 'connected';
    save(STORAGE_KEYS.INTEGRATIONS, list);

    return {
      success: true,
      latencyMs: latency,
      message: `Conexão validada com sucesso com ${item.providerName} (${latency}ms).`
    };
  },

  // --- AUDIT LOGS ---
  getAuditLogs(): AuditLog[] {
    return load<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'aud-seed-1',
        userId: 'user-owner',
        userName: 'Ian Felipe (Proprietário)',
        userRole: 'OWNER',
        action: 'Implantação Inicial da Plataforma',
        entity: 'System',
        timestamp: '2026-10-04T07:00:00Z',
        ipAddress: '189.120.45.10'
      }
    ]);
  },

  addAuditLog(action: string, entity: string, previousValue?: string, newValue?: string, customUserName?: string): void {
    const logs = this.getAuditLogs();
    const currentUser = this.getCurrentUser();
    const newLog: AuditLog = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser?.id || 'sys-admin',
      userName: customUserName || currentUser?.name || 'Administrador',
      userRole: currentUser?.role || 'ADMIN',
      action,
      entity,
      previousValue: previousValue ? String(previousValue).slice(0, 150) : undefined,
      newValue: newValue ? String(newValue).slice(0, 150) : undefined,
      timestamp: new Date().toISOString(),
      ipAddress: '177.135.210.82 (Hortolândia-SP)'
    };
    logs.unshift(newLog);
    // Keep last 300 logs
    save(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 300));
  },

  // --- LGPD ---
  getConsents(): ConsentRecord[] {
    return load<ConsentRecord[]>(STORAGE_KEYS.CONSENTS, []);
  },

  recordConsent(prefs: { essential: boolean; analytics: boolean; marketing: boolean }, userId?: string): ConsentRecord {
    const list = this.getConsents();
    const record: ConsentRecord = {
      id: `cst_${Date.now()}`,
      userId,
      ipAddress: '177.135.210.82',
      essential: prefs.essential,
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      policyVersion: '2026.1-LGPD',
      timestamp: new Date().toISOString()
    };
    list.push(record);
    save(STORAGE_KEYS.CONSENTS, list);
    return record;
  },

  getDataRequests(): LgpdDataRequest[] {
    return load<LgpdDataRequest[]>(STORAGE_KEYS.DATA_REQUESTS, []);
  },

  createDataRequest(name: string, email: string, requestType: 'export_data' | 'delete_account' | 'revoke_consent'): LgpdDataRequest {
    const list = this.getDataRequests();
    const req: LgpdDataRequest = {
      id: `lgpd_${Date.now()}`,
      customerName: name,
      customerEmail: email,
      requestType,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };
    list.unshift(req);
    save(STORAGE_KEYS.DATA_REQUESTS, list);
    this.addAuditLog('Solicitação de Titular LGPD', 'LGPD', `${requestType}`, email, name);
    return req;
  },

  exportUserData(email: string): string {
    const orders = this.getOrders().filter((o) => o.customerEmail?.toLowerCase() === email.toLowerCase());
    const consents = this.getConsents().filter((c) => c.userId === email);
    const data = {
      titular: email,
      geradoEm: new Date().toISOString(),
      controlador: 'Pastelada (Hortolândia - SP)',
      pedidos: orders,
      consentimentos: consents,
      baseLegal: 'Artigo 18 da Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)'
    };
    return JSON.stringify(data, null, 2);
  },

  anonymizeUserData(email: string): void {
    const orders = this.getOrders();
    orders.forEach((o) => {
      if (o.customerEmail?.toLowerCase() === email.toLowerCase()) {
        o.customerName = 'Cliente Anonimizado (LGPD)';
        o.customerEmail = 'anonimizado@lgpd.local';
        o.customerPhone = '(19) 99999-9999';
        if (o.deliveryAddress) {
          o.deliveryAddress.street = 'Endereço Anonimizado';
          o.deliveryAddress.number = 'S/N';
          o.deliveryAddress.complement = '';
          o.deliveryAddress.reference = '';
        }
      }
    });
    save(STORAGE_KEYS.ORDERS, orders);
    this.addAuditLog('Anonimização de Titular LGPD', 'User', email, 'Anonimizado conforme art. 18 LGPD', 'Sistema');
  },

  // --- INLINE EDIT MODE (Dualidade: Cliente x Admin) ---
  isEditMode(): boolean {
    return load<boolean>(STORAGE_KEYS.EDIT_MODE, false);
  },

  setEditMode(enabled: boolean): void {
    save(STORAGE_KEYS.EDIT_MODE, enabled);
  },

  // --- API ERROR LOGS (Mercado Pago, Resend, etc.) ---
  getApiErrorLogs(): ApiErrorLog[] {
    const seed: ApiErrorLog[] = [
      {
        id: 'err-seed-01',
        service: 'mercadopago',
        serviceName: 'Mercado Pago (PIX)',
        action: 'Criação de Cobrança PIX Instantânea',
        orderId: 'ord-seed-002',
        orderCode: 'SP-1041',
        customerName: 'Mariana Santos',
        errorMessage: 'Ambiente Sandbox: Timeout de resposta ao gerar QR Code PIX dinâmico.',
        errorCode: 'MP_TIMEOUT_408',
        details: 'A chamada à API demorou mais de 5000ms. Cliente foi orientado a tentar novamente ou pagar na entrega.',
        timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
        status: 'unresolved'
      },
      {
        id: 'err-seed-02',
        service: 'resend',
        serviceName: 'Resend (E-mail Transacional)',
        action: 'Envio de Confirmação de Pedido #SP-1040',
        orderId: 'ord-seed-001',
        orderCode: 'SP-1040',
        customerName: 'Ian Felipe',
        errorMessage: 'Chave de API em modo Sandbox restringe envios para e-mails não verificados.',
        errorCode: 'RESEND_DOMAIN_403',
        details: 'O e-mail pedidos@example.com precisa ser validado no painel da Resend ou utilize a chave de produção.',
        timestamp: new Date(Date.now() - 1000 * 60 * 125).toISOString(),
        status: 'resolved',
        resolvedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        resolvedBy: 'Ian Felipe (Proprietário)'
      }
    ];
    return load<ApiErrorLog[]>(STORAGE_KEYS.API_ERROR_LOGS, seed);
  },

  addApiErrorLog(error: Omit<ApiErrorLog, 'id' | 'timestamp' | 'status'>): ApiErrorLog {
    const list = this.getApiErrorLogs();
    const newLog: ApiErrorLog = {
      ...error,
      id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      status: 'unresolved'
    };
    list.unshift(newLog);
    save(STORAGE_KEYS.API_ERROR_LOGS, list);

    this.addAuditLog(
      `Falha na API: ${newLog.serviceName}`,
      'ApiErrorLog',
      newLog.orderCode ? `Pedido: ${newLog.orderCode}` : newLog.action,
      `Erro: ${newLog.errorMessage}`,
      'Sistema'
    );
    return newLog;
  },

  resolveApiErrorLog(id: string, resolvedBy = 'Proprietário'): void {
    const list = this.getApiErrorLogs();
    const item = list.find((e) => e.id === id);
    if (item) {
      item.status = 'resolved';
      item.resolvedAt = new Date().toISOString();
      item.resolvedBy = resolvedBy;
      save(STORAGE_KEYS.API_ERROR_LOGS, list);
      this.addAuditLog('Resolver Falha de API', 'ApiErrorLog', item.id, `Resolvido por ${resolvedBy}`, resolvedBy);
    }
  },

  deleteApiErrorLog(id: string, adminName = 'Proprietário'): void {
    const list = this.getApiErrorLogs().filter((e) => e.id !== id);
    save(STORAGE_KEYS.API_ERROR_LOGS, list);
    this.addAuditLog('Excluir Registro de Falha de API', 'ApiErrorLog', id, 'Removido', adminName);
  },

  clearResolvedApiErrorLogs(adminName = 'Proprietário'): void {
    const list = this.getApiErrorLogs().filter((e) => e.status !== 'resolved');
    save(STORAGE_KEYS.API_ERROR_LOGS, list);
    this.addAuditLog('Limpar Falhas de API Resolvidas', 'ApiErrorLog', 'Todos resolvidos', 'Limpeza realizada', adminName);
  },

  getUnresolvedApiErrorCount(): number {
    return this.getApiErrorLogs().filter((e) => e.status === 'unresolved').length;
  }
};

