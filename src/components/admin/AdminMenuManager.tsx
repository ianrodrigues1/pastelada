import React, { useState, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Percent,
  Check,
  AlertTriangle,
  Flame,
  Search,
  Layers,
  Save,
  X,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { StoreService } from '../../services/storeService';
import { Category, OptionGroup, PastelSizeId, Product, ProductOption } from '../../types';

export const PASTEL_PHOTO_PRESETS = [
  {
    name: 'Pastel de Feira Dourado',
    url: '/src/assets/images/hero_pastel_feira_1791132272218.jpg'
  },
  {
    name: 'Pastel de Carne Moída',
    url: '/src/assets/images/pastel_de_carne_1791132284645.jpg'
  },
  {
    name: 'Pastel de Queijo Puxando',
    url: '/src/assets/images/pastel_de_queijo_1791132295556.jpg'
  },
  {
    name: 'Pastel da Casa (Bacon e Recheio)',
    url: '/src/assets/images/pastel_da_casa_1791132305519.jpg'
  },
  {
    name: 'Pastel Doce (Nutella e Morango)',
    url: '/src/assets/images/pastel_doce_nutella_1791132315640.jpg'
  }
];

export const AdminMenuManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(StoreService.getProducts(true));
  const [categories, setCategories] = useState<Category[]>(StoreService.getCategories(true));
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>(StoreService.getOptionGroups(true));

  const [activeTab, setActiveTab] = useState<'products' | 'options' | 'bulk_adjust' | 'trash'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [quickPhotoProduct, setQuickPhotoProduct] = useState<Product | null>(null);
  const [tempPhotoUrl, setTempPhotoUrl] = useState<string>('');

  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  // Bulk Price Adjustment state
  const [bulkCategory, setBulkCategory] = useState<string>('all');
  const [bulkPercent, setBulkPercent] = useState<number>(5);

  const refreshData = () => {
    setProducts(StoreService.getProducts(true));
    setCategories(StoreService.getCategories(true));
    setOptionGroups(StoreService.getOptionGroups(true));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isQuick = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem é muito grande. Escolha uma foto de até 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (isQuick) {
        setTempPhotoUrl(dataUrl);
      } else if (editingProduct) {
        setEditingProduct({ ...editingProduct, imageUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    StoreService.saveProduct(editingProduct);
    setEditingProduct(null);
    refreshData();
    setNotice(`Produto "${editingProduct.name}" salvo com sucesso!`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleSaveQuickPhoto = () => {
    if (!quickPhotoProduct) return;
    quickPhotoProduct.imageUrl = tempPhotoUrl;
    StoreService.saveProduct(quickPhotoProduct);
    setQuickPhotoProduct(null);
    setTempPhotoUrl('');
    refreshData();
    setNotice(`Foto do produto "${quickPhotoProduct.name}" atualizada com sucesso!`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleSoftDelete = (id: string) => {
    StoreService.deleteProduct(id);
    refreshData();
    setNotice('Produto movido para a Lixeira (Histórico de pedidos preservado).');
    setTimeout(() => setNotice(null), 4000);
  };

  const handleRestore = (id: string) => {
    StoreService.restoreProduct(id);
    refreshData();
    setNotice('Produto restaurado com sucesso!');
    setTimeout(() => setNotice(null), 4000);
  };

  const handleApplyBulkAdjust = () => {
    const result = StoreService.bulkAdjustPrices(bulkCategory, bulkPercent);
    refreshData();
    setNotice(`Reajuste de ${bulkPercent}% aplicado com sucesso a ${result.count} produtos!`);
    setTimeout(() => setNotice(null), 4000);
  };

  const pendingConfirmCount = products.filter((p) => p.needsConfirmation && !p.archivedAt).length;

  return (
    <div className="space-y-6">
      {/* Notice alert */}
      {notice && (
        <div className="p-3 bg-emerald-100 border-2 border-emerald-600 text-emerald-950 font-dm text-xs flex items-center gap-2">
          <Check size={16} className="text-emerald-700 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Warning banner for [CONFIRMAR] items */}
      {pendingConfirmCount > 0 && (
        <div className="p-4 bg-amber-100 border-2 border-amber-600 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={20} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-barlow uppercase text-sm block">
                Itens Marcados como [CONFIRMAR] ({pendingConfirmCount} pendentes)
              </strong>
              <p className="font-dm text-xs text-amber-900 mt-0.5">
                Alguns preços foram transcritos de fotos de cardápios antigos ou prints e divergem
                entre fontes. O dono do restaurante deve conferir e validar esses valores antes da
                publicação oficial.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#fffaf2] card-hard">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 font-barlow font-bold text-xs uppercase border-2 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#e8874a] text-[#24352b] border-[#24352b]'
                : 'bg-white border-zinc-300'
            }`}
          >
            Produtos ({products.filter((p) => !p.archivedAt).length})
          </button>

          <button
            onClick={() => setActiveTab('options')}
            className={`px-3 py-1.5 font-barlow font-bold text-xs uppercase border-2 cursor-pointer ${
              activeTab === 'options'
                ? 'bg-[#e8874a] text-[#24352b] border-[#24352b]'
                : 'bg-white border-zinc-300'
            }`}
          >
            Recheios & Adicionais ({optionGroups.length} grupos)
          </button>

          <button
            onClick={() => setActiveTab('bulk_adjust')}
            className={`px-3 py-1.5 font-barlow font-bold text-xs uppercase border-2 cursor-pointer ${
              activeTab === 'bulk_adjust'
                ? 'bg-[#e8874a] text-[#24352b] border-[#24352b]'
                : 'bg-white border-zinc-300'
            }`}
          >
            <Percent size={13} className="inline mr-1" /> Reajuste em Massa
          </button>

          <button
            onClick={() => setActiveTab('trash')}
            className={`px-3 py-1.5 font-barlow font-bold text-xs uppercase border-2 cursor-pointer ${
              activeTab === 'trash'
                ? 'bg-[#e8874a] text-[#24352b] border-[#24352b]'
                : 'bg-white border-zinc-300'
            }`}
          >
            <Trash2 size={13} className="inline mr-1" /> Lixeira (
            {products.filter((p) => p.archivedAt).length})
          </button>
        </div>

        {activeTab === 'products' && (
          <button
            onClick={() => {
              setEditingProduct({
                id: `prod_${Date.now()}`,
                categoryId: categories[0]?.id || 'cat-tradicionais',
                name: '',
                description: '',
                imageUrl: '/src/assets/images/hero_pastel_feira_1791132272218.jpg',
                availableSizes: ['tubete', 'convencional'],
                pricesBySize: { tubete: 20.0, convencional: 26.0, tubetinho: 16.0, especial: 64.9 },
                isCustomizable: false,
                isAvailable: true
              });
            }}
            className="btn-hard bg-[#e8874a] text-[#24352b] px-3.5 py-1.5 text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus size={16} /> Novo Produto
          </button>
        )}
      </div>

      {/* TAB 1: PRODUCTS LIST */}
      {activeTab === 'products' && (
        <div className="card-hard bg-[#fffaf2] overflow-hidden">
          <div className="p-3 border-b-2 border-[#24352b] bg-zinc-50 flex items-center justify-between">
            <span className="font-barlow font-bold uppercase text-xs text-zinc-700">
              Catálogo de Produtos & Fotos
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar por nome..."
              className="p-1.5 border border-zinc-300 text-xs font-dm bg-white w-60"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-dm border-collapse">
              <thead>
                <tr className="bg-zinc-100 border-b-2 border-[#24352b] font-barlow font-black uppercase text-zinc-800">
                  <th className="p-3">Foto</th>
                  <th className="p-3">Nome do Produto</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Tubete (150g)</th>
                  <th className="p-3">Convencional (240g)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {products
                  .filter((p) => !p.archivedAt && (search ? p.name.toLowerCase().includes(search.toLowerCase()) : true))
                  .map((product) => {
                    const cat = categories.find((c) => c.id === product.categoryId);

                    return (
                      <tr key={product.id} className="hover:bg-amber-50/50">
                        {/* Photo Thumbnail + Quick Photo Trigger */}
                        <td className="p-3">
                          <div
                            onClick={() => {
                              setQuickPhotoProduct(product);
                              setTempPhotoUrl(product.imageUrl || '');
                            }}
                            className="relative w-12 h-12 bg-zinc-200 border-2 border-[#24352b] overflow-hidden cursor-pointer group shadow-[1px_1px_0px_#24352b]"
                            title="Clique para trocar a foto deste pastel"
                          >
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:opacity-75 transition"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-amber-100">
                                <Flame size={16} className="text-[#e8874a]" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                              <Camera size={14} />
                            </div>
                          </div>
                        </td>

                        <td className="p-3 font-bold text-zinc-900">
                          {product.name}
                          {product.needsConfirmation && (
                            <span className="ml-2 text-[10px] text-amber-700 bg-amber-100 px-1 py-0.5 border border-amber-300">
                              [CONFIRMAR]
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-zinc-600">{cat?.name || product.categoryId}</td>
                        <td className="p-3 font-mono font-bold">
                          R$ {(product.pricesBySize.tubete || 0).toFixed(2).replace('.', ',')}
                        </td>
                        <td className="p-3 font-mono font-bold">
                          R$ {(product.pricesBySize.convencional || 0).toFixed(2).replace('.', ',')}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              product.isAvailable = !product.isAvailable;
                              StoreService.saveProduct(product);
                              refreshData();
                            }}
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-none border ${
                              product.isAvailable
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-red-100 text-red-800 border-red-300'
                            }`}
                          >
                            {product.isAvailable ? 'Disponível' : 'Esgotado'}
                          </button>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => {
                              setQuickPhotoProduct(product);
                              setTempPhotoUrl(product.imageUrl || '');
                            }}
                            className="p-1 border border-zinc-300 hover:border-black bg-white"
                            title="Alterar Foto do Pastel"
                          >
                            <Camera size={13} className="text-zinc-700" />
                          </button>
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-1 border border-zinc-300 hover:border-black bg-white"
                            title="Editar Preços e Dados"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleSoftDelete(product.id)}
                            className="p-1 border border-zinc-300 hover:border-red-700 text-red-700 bg-white"
                            title="Mover para Lixeira"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: OPTIONS & FILLINGS */}
      {activeTab === 'options' && (
        <div className="space-y-6">
          {optionGroups.map((grp) => (
            <div key={grp.id} className="card-hard bg-[#fffaf2] p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <div>
                  <h3 className="font-barlow font-black text-xl uppercase text-[#24352b]">
                    {grp.title}
                  </h3>
                  <span className="font-dm text-xs text-zinc-500">{grp.description}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {grp.options.map((opt) => (
                  <div
                    key={opt.id}
                    className="p-3 border-2 border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs font-dm"
                  >
                    <div>
                      <span className="font-bold text-zinc-900 block">{opt.name}</span>
                      <span className="text-[11px] text-zinc-500">
                        Tubete: R$ {(opt.pricesBySize.tubete || 0).toFixed(2)} | Conv: R${' '}
                        {(opt.pricesBySize.convencional || 0).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        opt.isAvailable = !opt.isAvailable;
                        StoreService.saveOptionGroup(grp);
                        refreshData();
                      }}
                      className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                        opt.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {opt.isAvailable ? 'Ativo' : 'Pausado'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: BULK ADJUST */}
      {activeTab === 'bulk_adjust' && (
        <div className="card-hard bg-[#fffaf2] p-6 max-w-xl space-y-4 font-dm text-xs">
          <div className="flex items-center gap-2">
            <Percent size={24} className="text-[#24352b]" />
            <h3 className="font-barlow font-black text-2xl uppercase text-[#24352b]">
              Reajuste de Preços em Massa
            </h3>
          </div>
          <p className="text-zinc-600">
            Ajuste os preços de uma categoria inteira ou de todo o cardápio em um percentual fixo
            (ex: inflação ou reajuste de insumos). Os preços calculados são arredondados
            automaticamente.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="font-bold text-zinc-800 block mb-1">Selecione a Categoria:</label>
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                className="w-full p-2 border-2 border-zinc-300 bg-white"
              >
                <option value="all">Todas as Categorias</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-zinc-800 block mb-1">
                Percentual de Ajuste (%):
              </label>
              <input
                type="number"
                value={bulkPercent}
                onChange={(e) => setBulkPercent(Number(e.target.value))}
                placeholder="5"
                className="w-full p-2 border-2 border-zinc-300 bg-white"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={handleApplyBulkAdjust}
                className="btn-hard bg-[#e8874a] text-[#24352b] px-5 py-2.5 text-sm cursor-pointer"
              >
                Aplicar Reajuste de {bulkPercent}% Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRASH BIN */}
      {activeTab === 'trash' && (
        <div className="card-hard bg-[#fffaf2] p-6 space-y-4">
          <h3 className="font-barlow font-black text-2xl uppercase text-[#24352b]">
            Lixeira de Produtos (Retenção Segura 30 Dias)
          </h3>
          <p className="font-dm text-xs text-zinc-600">
            Itens excluídos permanecem aqui para que relatórios e pedidos antigos do cliente nunca
            sejam corrompidos. Você pode restaurá-los a qualquer momento com 1 clique.
          </p>

          <div className="divide-y divide-zinc-200">
            {products
              .filter((p) => p.archivedAt)
              .map((prod) => (
                <div key={prod.id} className="py-3 flex items-center justify-between text-xs font-dm">
                  <div>
                    <span className="font-bold text-zinc-900 block">{prod.name}</span>
                    <span className="text-[11px] text-zinc-500">
                      Arquivado em: {new Date(prod.archivedAt!).toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRestore(prod.id)}
                    className="btn-hard bg-[#e8874a] text-[#24352b] px-3 py-1.5 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={14} /> Restaurar Produto
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* QUICK PHOTO SWAP MODAL */}
      {quickPhotoProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white card-hard max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h3 className="font-barlow font-black text-xl uppercase text-[#24352b]">
                  Trocar Foto do Produto
                </h3>
                <span className="font-dm text-xs font-bold text-amber-800">
                  {quickPhotoProduct.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setQuickPhotoProduct(null)}
                className="p-1 border border-black cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Live Preview */}
            <div className="text-center">
              <span className="font-bold text-zinc-700 block mb-1 text-xs">Pré-visualização da Foto:</span>
              <div className="w-full h-44 bg-zinc-100 border-2 border-[#24352b] overflow-hidden flex items-center justify-center">
                {tempPhotoUrl ? (
                  <img
                    src={tempPhotoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-zinc-400 text-xs">Sem foto selecionada</span>
                )}
              </div>
            </div>

            {/* Upload from Computer/Phone */}
            <div className="space-y-2 pt-1">
              <input
                type="file"
                ref={quickFileInputRef}
                accept="image/*"
                onChange={(e) => handleFileUpload(e, true)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => quickFileInputRef.current?.click()}
                className="w-full btn-hard bg-[#e8874a] text-[#24352b] py-2.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload size={16} />
                Carregar Foto do Computador ou Celular
              </button>
              <span className="text-[10px] text-zinc-500 text-center block">
                Você pode tirar uma foto na hora com o celular ou escolher um arquivo (JPG, PNG, WebP)
              </span>
            </div>

            {/* Preset Library */}
            <div className="pt-2 border-t border-zinc-200">
              <span className="font-bold text-zinc-800 block mb-2 text-xs">
                Ou Escolha da Galeria de Pastéis Prontos:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PASTEL_PHOTO_PRESETS.map((pst, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTempPhotoUrl(pst.url)}
                    className={`p-1.5 border-2 text-left flex items-center gap-2 cursor-pointer transition ${
                      tempPhotoUrl === pst.url
                        ? 'border-[#24352b] bg-amber-100 font-bold'
                        : 'border-zinc-200 hover:border-black'
                    }`}
                  >
                    <img
                      src={pst.url}
                      alt={pst.name}
                      className="w-8 h-8 object-cover border border-black shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] text-zinc-800 line-clamp-1">{pst.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* URL input */}
            <div className="pt-2">
              <label className="font-bold text-zinc-700 block mb-1 text-xs">
                Ou digite/cole o link direto da imagem:
              </label>
              <input
                type="text"
                value={tempPhotoUrl}
                onChange={(e) => setTempPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-2 border border-zinc-300 text-xs font-mono"
              />
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setQuickPhotoProduct(null)}
                className="px-4 py-2 border text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveQuickPhoto}
                className="btn-hard bg-[#24352b] text-white px-5 py-2 text-xs flex items-center gap-1 cursor-pointer"
              >
                <Save size={14} /> Salvar Nova Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL EDIT / CREATE PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white card-hard max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-barlow font-black text-xl uppercase text-[#24352b]">
                Editar Produto & Preços
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1 border border-black cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 font-dm text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full p-2 border border-zinc-300 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Categoria *</label>
                <select
                  value={editingProduct.categoryId}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, categoryId: e.target.value })
                  }
                  className="w-full p-2 border border-zinc-300 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full p-2 border border-zinc-300"
                />
              </div>

              {/* Price by size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Preço Tubete (R$)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingProduct.pricesBySize.tubete || 0}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        pricesBySize: {
                          ...editingProduct.pricesBySize,
                          tubete: Number(e.target.value)
                        }
                      })
                    }
                    className="w-full p-2 border border-zinc-300 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">
                    Preço Convencional (R$)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingProduct.pricesBySize.convencional || 0}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        pricesBySize: {
                          ...editingProduct.pricesBySize,
                          convencional: Number(e.target.value)
                        }
                      })
                    }
                    className="w-full p-2 border border-zinc-300 font-bold"
                  />
                </div>
              </div>

              {/* Photo section in full editor */}
              <div className="pt-2 border-t border-zinc-200 space-y-2">
                <label className="font-bold text-zinc-800 block">Foto do Produto:</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-zinc-100 border-2 border-black overflow-hidden shrink-0">
                    {editingProduct.imageUrl ? (
                      <img
                        src={editingProduct.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-1.5 border-2 border-zinc-300 hover:border-black font-barlow font-bold text-xs uppercase flex items-center justify-center gap-1 bg-white cursor-pointer"
                    >
                      <Upload size={14} /> Carregar do Computador / Celular
                    </button>
                    <input
                      type="text"
                      value={editingProduct.imageUrl || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                      }
                      placeholder="Ou cole a URL da imagem..."
                      className="w-full p-1.5 border border-zinc-300 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Preset quick buttons */}
                <div>
                  <span className="text-[10px] text-zinc-500 block mb-1 font-bold">
                    Ou selecione um modelo pronto:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {PASTEL_PHOTO_PRESETS.map((pst, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setEditingProduct({ ...editingProduct, imageUrl: pst.url })
                        }
                        className="text-[10px] px-2 py-0.5 border border-zinc-300 hover:border-black bg-zinc-50"
                      >
                        {pst.name.split(' ')[1] || pst.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 border text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-hard bg-[#e8874a] text-[#24352b] px-5 py-2 text-xs flex items-center gap-1 cursor-pointer"
              >
                <Save size={14} /> Salvar Produto
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
