import React from 'react';
import {
  ShoppingBag,
  Clock,
  User as UserIcon,
  Shield,
  Edit3,
  LogOut,
  MapPin,
  Flame,
  Menu,
  X
} from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { User } from '../../types';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenMenu: () => void;
  onOpenBuilder: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  cartCount: number;
  currentUser: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenMenu,
  onOpenBuilder,
  onOpenAccount,
  onOpenAdmin,
  cartCount,
  currentUser,
  onLoginClick,
  onLogoutClick,
  isEditMode,
  onToggleEditMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const settings = StoreService.getSettings();
  const storeStatus = StoreService.isStoreOpenNow();

  const isStaffOrAdmin =
    currentUser &&
    (currentUser.role === 'OWNER' ||
      currentUser.role === 'ADMIN' ||
      currentUser.role === 'STAFF');

  return (
    <header className="sticky top-0 z-40 w-full bg-[#e8874a] border-b-[3px] border-[#24352b] shadow-md">
      {/* Top Administration & Edit Mode Bar (Visible exclusively to authorized staff) */}
      {isStaffOrAdmin && (
        <div className="bg-[#24352b] text-[#fffaf2] px-4 py-1.5 text-xs font-semibold flex flex-wrap items-center justify-between gap-2 border-b border-black">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-barlow tracking-wider uppercase text-sm">
              Acesso Autorizado: {currentUser.name} ({currentUser.role})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleEditMode}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium transition-all ${
                isEditMode
                  ? 'bg-[#e8874a] text-[#24352b] font-bold'
                  : 'bg-zinc-800 text-zinc-300 hover:text-white'
              }`}
            >
              <Edit3 size={13} />
              {isEditMode ? 'Modo Edição Ativo' : 'Ativar Edição do Site'}
            </button>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 bg-[#e8874a] text-[#24352b] px-3 py-0.5 rounded font-barlow uppercase font-bold hover:bg-yellow-400 transition"
            >
              <Shield size={13} />
              Painel Admin
            </button>
          </div>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 bg-[#24352b] text-[#e8874a] flex items-center justify-center font-barlow font-black text-2xl border-2 border-[#24352b] shadow-[3px_3px_0px_#fffaf2]">
              SP
            </div>
            <div>
              <span className="font-barlow font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#24352b] block leading-none">
                {settings.name}
              </span>
              <span className="font-dm text-xs font-bold text-[#24352b]/80 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                <MapPin size={11} /> Hortolândia - SP
              </span>
            </div>
          </div>

          {/* Operating Status Badge (Live) */}
          <div className="hidden lg:flex items-center">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 border-2 border-[#24352b] shadow-[2px_2px_0px_#24352b] text-xs font-bold font-dm ${
                storeStatus.isOpen
                  ? 'bg-emerald-100 text-emerald-950'
                  : 'bg-amber-100 text-amber-950'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  storeStatus.isOpen ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
                }`}
              ></span>
              <span className="uppercase">{storeStatus.badge}</span>
              <span className="text-zinc-500 font-normal">|</span>
              <span className="text-[11px] font-normal">{storeStatus.nextOpening}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={onOpenMenu}
              className="font-barlow font-bold text-lg text-[#24352b] hover:underline uppercase tracking-wide cursor-pointer"
            >
              Cardápio Completo
            </button>

            <button
              onClick={onOpenBuilder}
              className="flex items-center gap-1.5 font-barlow font-extrabold text-lg text-[#24352b] bg-[#fffaf2] px-3.5 py-1.5 btn-hard cursor-pointer"
            >
              <Flame size={18} className="text-orange-600 fill-orange-600" />
              Do Seu Jeito
            </button>

            {/* User Account / Login */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAccount}
                  className="flex items-center gap-2 text-sm font-bold bg-[#24352b] text-[#fffaf2] px-3 py-1.5 border-2 border-[#24352b] shadow-[2px_2px_0px_#fffaf2] cursor-pointer"
                >
                  <UserIcon size={16} />
                  <span className="max-w-[120px] truncate">{currentUser.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={onLogoutClick}
                  title="Sair"
                  className="p-1.5 text-[#24352b] hover:bg-black/10 rounded cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="font-barlow font-bold text-base text-[#24352b] border-2 border-[#24352b] px-3 py-1.5 bg-[#fffaf2] hover:bg-amber-50 shadow-[2px_2px_0px_#24352b] cursor-pointer uppercase"
              >
                Entrar
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center justify-center p-2.5 bg-[#24352b] text-[#fffaf2] border-2 border-[#24352b] shadow-[3px_3px_0px_#fffaf2] cursor-pointer hover:bg-zinc-800 transition"
              aria-label="Ver carrinho"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white font-barlow font-black text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#24352b]">
                  {cartCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenCart}
              className="relative p-2 bg-[#24352b] text-[#fffaf2] border-2 border-[#24352b] shadow-[2px_2px_0px_#fffaf2]"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white font-bold text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border-2 border-[#24352b] bg-[#fffaf2]"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-[#24352b] flex flex-col gap-3 bg-[#e8874a]">
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 border-2 border-[#24352b] text-xs font-bold">
              <Clock size={14} />
              <span>{storeStatus.message}</span>
            </div>

            <button
              onClick={() => {
                onOpenMenu();
                setMobileMenuOpen(false);
              }}
              className="text-left font-barlow font-bold text-xl uppercase py-1"
            >
              Cardápio Completo
            </button>

            <button
              onClick={() => {
                onOpenBuilder();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 font-barlow font-extrabold text-xl uppercase bg-[#fffaf2] p-2.5 btn-hard"
            >
              <Flame size={20} className="text-orange-600" />
              Montar Do Seu Jeito
            </button>

            {currentUser ? (
              <div className="flex items-center justify-between pt-2 border-t border-black/20">
                <button
                  onClick={() => {
                    onOpenAccount();
                    setMobileMenuOpen(false);
                  }}
                  className="font-dm font-bold text-sm"
                >
                  Minha Conta ({currentUser.name})
                </button>
                <button onClick={onLogoutClick} className="text-xs uppercase font-bold text-red-700">
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  setMobileMenuOpen(false);
                }}
                className="btn-hard bg-[#fffaf2] py-2 text-center"
              >
                Entrar com Google
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
