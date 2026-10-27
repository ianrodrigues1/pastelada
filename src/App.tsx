import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CookieBanner } from './components/common/CookieBanner';
import { Hero } from './components/home/Hero';
import { FeaturedSection } from './components/home/FeaturedSection';
import { SizeShowcase } from './components/home/SizeShowcase';
import { MenuPage } from './components/menu/MenuPage';
import { PastelBuilderModal } from './components/builder/PastelBuilderModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/order/OrderTrackingModal';
import { AccountModal } from './components/account/AccountModal';
import { GoogleLoginModal } from './components/auth/GoogleLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LegalModal } from './components/legal/LegalModal';
import { StoreService } from './services/storeService';
import { CartItem, Order, PastelSizeId, Product, User } from './types';
import { Sparkles, MapPin, Phone, Clock, Flame } from 'lucide-react';

export default function App() {
  // Current view: 'home' | 'menu' | 'admin'
  const [currentView, setCurrentView] = useState<'home' | 'menu' | 'admin'>('home');

  // Modals state
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderProduct, setBuilderProduct] = useState<Product | undefined>(undefined);
  const [builderInitialSize, setBuilderInitialSize] = useState<PastelSizeId>('tubete');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // Cart & User state
  const [cartItems, setCartItems] = useState<CartItem[]>(StoreService.getCart());
  const [currentUser, setCurrentUser] = useState<User | null>(StoreService.getCurrentUser());
  const [isEditMode, setIsEditMode] = useState<boolean>(StoreService.isEditMode());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const settings = StoreService.getSettings();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddToCart = (item: CartItem) => {
    const updated = StoreService.addToCart(item);
    setCartItems([...updated]);
    showToast(`${item.productName} adicionado ao carrinho!`);
    setIsCartOpen(true);
  };

  const handleDirectAddProduct = (product: Product, sizeId: PastelSizeId) => {
    const sizeConfig = StoreService.getSizes().find((s) => s.id === sizeId);
    const price = product.pricesBySize[sizeId] || 19.9;

    const cartItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      sizeId,
      sizeName: sizeConfig?.name || sizeId,
      basePrice: price,
      selectedOptions: [],
      unitPrice: price,
      quantity: 1,
      totalPrice: price
    };

    handleAddToCart(cartItem);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    const updated = StoreService.updateCartQuantity(itemId, delta);
    setCartItems([...updated]);
  };

  const handleClearCart = () => {
    StoreService.clearCart();
    setCartItems([]);
    showToast('Carrinho limpo.');
  };

  const handleOrderCreated = (newOrder: Order) => {
    setCartItems([]);
    setActiveTrackingOrder(newOrder);
    showToast(`Pedido #${newOrder.code} gerado com sucesso!`);
  };

  const handleReorder = (pastOrder: Order) => {
    pastOrder.items.forEach((item) => {
      const cartItem: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productId: item.productId,
        productName: item.productName,
        sizeId: item.sizeId,
        sizeName: item.sizeName,
        basePrice: item.unitPrice,
        selectedOptions: [],
        notes: item.notes,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.subtotal
      };
      StoreService.addToCart(cartItem);
    });

    setCartItems(StoreService.getCart());
    setIsCartOpen(true);
    showToast(`Itens do pedido #${pastOrder.code} adicionados ao seu carrinho!`);
  };

  const handleLogout = () => {
    StoreService.setCurrentUser(null);
    setCurrentUser(null);
    setIsEditMode(false);
    StoreService.setEditMode(false);
    if (currentView === 'admin') {
      setCurrentView('home');
    }
    showToast('Sessão encerrada com sucesso.');
  };

  const handleToggleEditMode = () => {
    const next = !isEditMode;
    setIsEditMode(next);
    StoreService.setEditMode(next);
    showToast(next ? 'Modo de Edição em Contexto ativado!' : 'Modo de Edição desativado.');
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  // If in admin view, render AdminDashboard
  if (currentView === 'admin') {
    return (
      <AdminDashboard
        onBackToSite={() => setCurrentView('home')}
        currentUser={currentUser}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f1e7] text-[#24352b] selection:bg-[#e8874a] selection:text-[#24352b]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-5 z-50 p-4 bg-[#24352b] text-[#fffaf2] border-2 border-[#e8874a] shadow-[4px_4px_0px_#e8874a] font-barlow font-bold uppercase text-sm animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMenu={() => setCurrentView('menu')}
        onOpenBuilder={() => {
          setBuilderProduct(undefined);
          setBuilderInitialSize('tubete');
          setIsBuilderOpen(true);
        }}
        onOpenAccount={() => {
          if (currentUser) {
            setIsAccountOpen(true);
          } else {
            setIsLoginOpen(true);
          }
        }}
        onOpenAdmin={() => setCurrentView('admin')}
        cartCount={totalCartCount}
        currentUser={currentUser}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogoutClick={handleLogout}
        isEditMode={isEditMode}
        onToggleEditMode={handleToggleEditMode}
      />

      {/* View routing: Menu Page or Home Page */}
      {currentView === 'menu' ? (
        <MenuPage
          onBackToHome={() => setCurrentView('home')}
          onOpenBuilder={(prod, sz) => {
            setBuilderProduct(prod);
            setBuilderInitialSize(sz || 'tubete');
            setIsBuilderOpen(true);
          }}
          onDirectAddProduct={handleDirectAddProduct}
        />
      ) : (
        <main className="flex-1">
          {/* 1. Hero Section */}
          <Hero
            onOpenBuilder={() => {
              setBuilderProduct(undefined);
              setBuilderInitialSize('tubete');
              setIsBuilderOpen(true);
            }}
            onOpenMenu={() => setCurrentView('menu')}
            isEditMode={isEditMode}
          />

          {/* 2. Featured Section ("Os Mais Pedidos") */}
          <FeaturedSection
            onSelectProduct={(prod) => {
              if (prod.isCustomizable) {
                setBuilderProduct(prod);
                setIsBuilderOpen(true);
              } else {
                handleDirectAddProduct(prod, 'tubete');
              }
            }}
            onOpenBuilder={() => {
              setBuilderProduct(undefined);
              setIsBuilderOpen(true);
            }}
          />

          {/* 3. Sizes Comparison (Tubete vs Convencional vs Especial) */}
          <SizeShowcase
            onOpenBuilderWithSize={(sizeId) => {
              setBuilderProduct(undefined);
              setBuilderInitialSize(sizeId);
              setIsBuilderOpen(true);
            }}
          />

          {/* 4. Experience & Tradition Section */}
          <section className="py-16 bg-[#e8874a] border-b-[3px] border-[#24352b]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="font-barlow font-bold text-xs uppercase tracking-widest text-[#24352b] block mb-1">
                    FEITO COM AMOR E INGREDIENTES DE PRIMEIRA
                  </span>
                  <h2 className="font-barlow font-black text-4xl sm:text-5xl uppercase text-[#24352b] tracking-tight leading-none mb-4">
                    Por Que Nosso Pastel é Diferente?
                  </h2>
                  <div className="space-y-4 font-dm text-sm text-[#24352b]/90 leading-relaxed font-medium">
                    <p>
                      No <strong>Pastelada</strong>, não economizamos no recheio. Cada pastel
                      é montado manualmente na hora que você pede, com peso aferido em balança de
                      precisão para garantir 150g no Tubete e 240g no Convencional.
                    </p>
                    <p>
                      Nossa massa é aberta fininha e frita em óleo limpo sob temperatura controlada,
                      resultando naquele pastel dourado, sequinho por fora e transbordando sabor a
                      cada mordida.
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <a
                      href={settings.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-hard bg-[#24352b] text-[#fffaf2] hover:bg-zinc-800 px-6 py-3 text-base flex items-center gap-2 cursor-pointer"
                    >
                      <Phone size={18} /> Pedir pelo WhatsApp
                    </a>
                  </div>
                </div>

                <div className="relative">
                  <div className="card-hard-lg bg-[#fffaf2] p-4">
                    <img
                      src="/src/assets/images/hero_pastel_feira_1791132272218.jpg"
                      alt="Pastelaria artesanal Pastelada em Hortolândia"
                      className="w-full h-80 object-cover border-2 border-[#24352b]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="mt-3 flex items-center justify-between text-xs font-dm font-bold text-[#24352b]">
                      <span>Rua Zacarias Costa Camargo, 221</span>
                      <span className="bg-[#e8874a] px-2 py-0.5 border border-black">
                        Hortolândia - SP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Main Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
        onOpenSecurityDocs={() => setCurrentView('admin')}
      />

      {/* Modals & Overlays */}
      <PastelBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onAddToCart={handleAddToCart}
        initialSize={builderInitialSize}
        product={builderProduct}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenMenu={() => setCurrentView('menu')}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currentUser={currentUser}
        onOrderCreated={handleOrderCreated}
      />

      {activeTrackingOrder && (
        <OrderTrackingModal
          isOpen={true}
          onClose={() => setActiveTrackingOrder(null)}
          order={activeTrackingOrder}
        />
      )}

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onReorder={handleReorder}
        onOpenPrivacy={() => setLegalModalType('privacy')}
      />

      <GoogleLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(u) => {
          setCurrentUser(u);
          showToast(`Bem-vindo, ${u.name}!`);
        }}
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
      />

      <LegalModal
        isOpen={legalModalType !== null}
        onClose={() => setLegalModalType(null)}
        type={legalModalType || 'privacy'}
      />

      {/* LGPD Cookie Consent Banner */}
      <CookieBanner onOpenPrivacy={() => setLegalModalType('privacy')} />
    </div>
  );
}
