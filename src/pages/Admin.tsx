import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/a7d65e38-ef61-4f2a-93fc-0ae9439533a8";
const UPLOAD_URL = "https://functions.poehali.dev/8587e403-cee0-4f85-a5d9-8fa844217ec2";
const CATEGORIES_URL = "https://functions.poehali.dev/6914ab4d-b145-479e-94c6-f5c0274394f0";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  era: string;
  description: string;
  sort_order: number;
};

type Category = {
  id: number;
  name: string;
  sort_order: number;
};

const EMPTY_FORM = {
  name: "",
  price: "",
  image: "",
  category: "",
  era: "",
  description: "",
};

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [tab, setTab] = useState<"products" | "categories">("products");

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [catName, setCatName] = useState("");
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [savingCat, setSavingCat] = useState(false);
  const [deletingCatId, setDeletingCatId] = useState<number | null>(null);
  const [catError, setCatError] = useState("");

  const adminHeaders = {
    "Content-Type": "application/json",
    "X-Admin-Password": password,
  };

  // Load data
  const loadProducts = async () => {
    setLoadingProducts(true);
    const res = await fetch(API_URL);
    setProducts(await res.json());
    setLoadingProducts(false);
  };

  const loadCategories = async () => {
    setLoadingCats(true);
    const res = await fetch(CATEGORIES_URL);
    setCategories(await res.json());
    setLoadingCats(false);
  };

  // Auth
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Password": password },
      body: JSON.stringify({ name: "_test", price: 0, image: "", category: "", era: "", description: "" }),
    });
    if (res.status === 403) {
      setAuthError(true);
    } else {
      setAuthed(true);
      setAuthError(false);
      loadProducts();
      loadCategories();
      if (res.status === 201) {
        const created = await res.json();
        await fetch(API_URL, { method: "DELETE", headers: adminHeaders, body: JSON.stringify({ id: created.id }) });
        loadProducts();
      }
    }
  };

  // Image upload
  const uploadFile = async (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Password": password },
        body: JSON.stringify({ file: dataUrl, filename: file.name }),
      });
      const data = await res.json();
      if (data.url) setForm((f) => ({ ...f, image: data.url }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) uploadFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  // Product CRUD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch(API_URL, {
      method: editingId ? "PUT" : "POST",
      headers: adminHeaders,
      body: JSON.stringify({ ...form, price: Number(form.price), id: editingId }),
    });
    setSaving(false);
    setShowForm(false);
    setForm(EMPTY_FORM);
    setEditingId(null);
    loadProducts();
  };

  const handleEdit = (p: Product) => {
    setForm({ name: p.name, price: String(p.price), image: p.image, category: p.category, era: p.era, description: p.description });
    setEditingId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить этот товар?")) return;
    setDeletingId(id);
    await fetch(API_URL, { method: "DELETE", headers: adminHeaders, body: JSON.stringify({ id }) });
    setDeletingId(null);
    loadProducts();
  };

  const handleNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => { setShowForm(false); setForm(EMPTY_FORM); setEditingId(null); };

  // Drag & drop sort
  const handleSortDragStart = (id: number) => setDraggedId(id);
  const handleSortDragOver = (e: React.DragEvent, id: number) => { e.preventDefault(); if (id !== draggedId) setDragOverId(id); };
  const handleSortDrop = async (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) { setDraggedId(null); setDragOverId(null); return; }
    const oldList = [...products];
    const dragIdx = oldList.findIndex((p) => p.id === draggedId);
    const targetIdx = oldList.findIndex((p) => p.id === targetId);
    const newList = [...oldList];
    const [moved] = newList.splice(dragIdx, 1);
    newList.splice(targetIdx, 0, moved);
    const withOrder = newList.map((p, i) => ({ ...p, sort_order: i + 1 }));
    setProducts(withOrder);
    setDraggedId(null);
    setDragOverId(null);
    setReordering(true);
    await fetch(API_URL, { method: "PATCH", headers: adminHeaders, body: JSON.stringify({ order: withOrder.map((p) => ({ id: p.id, sort_order: p.sort_order })) }) });
    setReordering(false);
  };
  const handleSortDragEnd = () => { setDraggedId(null); setDragOverId(null); };

  // Category CRUD
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatError("");
    setSavingCat(true);
    const res = await fetch(CATEGORIES_URL, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ name: catName.trim() }),
    });
    const data = await res.json();
    setSavingCat(false);
    if (res.status === 409) { setCatError("Такая категория уже существует"); return; }
    if (!res.ok) { setCatError(data.error || "Ошибка"); return; }
    setCatName("");
    loadCategories();
  };

  const handleSaveCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    setCatError("");
    setSavingCat(true);
    const res = await fetch(CATEGORIES_URL, {
      method: "PUT",
      headers: adminHeaders,
      body: JSON.stringify({ id: editingCat.id, name: editingCatName.trim() }),
    });
    const data = await res.json();
    setSavingCat(false);
    if (res.status === 409) { setCatError("Такая категория уже существует"); return; }
    if (!res.ok) { setCatError(data.error || "Ошибка"); return; }
    setEditingCat(null);
    setEditingCatName("");
    loadCategories();
    loadProducts();
  };

  const handleDeleteCat = async (id: number) => {
    if (!confirm("Удалить категорию? Товары с этой категорией останутся, но будут без категории.")) return;
    setDeletingCatId(id);
    await fetch(CATEGORIES_URL, { method: "DELETE", headers: adminHeaders, body: JSON.stringify({ id }) });
    setDeletingCatId(null);
    loadCategories();
  };

  const inputCls = "w-full bg-dark-elevated border border-border px-4 py-3 font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 transition-colors";
  const labelCls = "font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/60 block mb-2";

  if (!authed) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="font-montserrat text-[9px] tracking-[0.4em] uppercase text-gold/50 mb-3">Панель управления</p>
            <h1 className="font-cormorant text-4xl text-foreground font-light">Администратор</h1>
          </div>
          <form onSubmit={handleLogin} className="bg-dark-surface border border-border p-8">
            <div className="mb-5">
              <label className={labelCls}>Пароль</label>
              <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setAuthError(false); }} className={inputCls} placeholder="••••••••" autoFocus />
              {authError && <p className="font-montserrat text-xs text-red-400 mt-2">Неверный пароль</p>}
            </div>
            <button type="submit" className="w-full gold-gradient text-dark-base font-montserrat text-xs tracking-[0.3em] uppercase py-4 hover:opacity-90 transition-all duration-300">Войти</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-base">
      {/* Header */}
      <div className="border-b border-border bg-dark-surface px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="text-muted-foreground hover:text-gold transition-colors">
            <Icon name="ArrowLeft" size={18} />
          </a>
          <div>
            <p className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/50">Панель управления</p>
            <h1 className="font-cormorant text-xl text-foreground font-light">Администратор</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {reordering && (
            <div className="flex items-center gap-2 text-gold/60">
              <Icon name="Loader2" size={14} className="animate-spin" />
              <span className="font-montserrat text-[10px]">Сохраняю порядок...</span>
            </div>
          )}
          {tab === "products" && (
            <button onClick={handleNew} className="gold-gradient text-dark-base font-montserrat text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 hover:opacity-90 transition-all duration-300 flex items-center gap-2">
              <Icon name="Plus" size={14} />
              Добавить товар
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-dark-surface">
        <div className="max-w-5xl mx-auto px-6 flex gap-0">
          {[
            { id: "products", label: "Товары", icon: "ShoppingBag" },
            { id: "categories", label: "Категории", icon: "Tag" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as "products" | "categories")}
              className={`flex items-center gap-2 px-5 py-3 font-montserrat text-[10px] tracking-[0.2em] uppercase border-b-2 transition-all duration-200 ${
                tab === t.id ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon name={t.icon} size={13} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">

        {/* ===== PRODUCTS TAB ===== */}
        {tab === "products" && (
          <>
            {/* Product Form */}
            {showForm && (
              <div className="bg-dark-surface border border-gold/30 p-6 mb-8 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-cormorant text-2xl text-foreground font-light">
                    {editingId ? "Редактировать товар" : "Новый товар"}
                  </h2>
                  <button onClick={closeForm} className="text-muted-foreground hover:text-gold transition-colors">
                    <Icon name="X" size={18} />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className={labelCls}>Название *</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Каминные часы Людовика XVI" />
                    </div>
                    <div>
                      <label className={labelCls}>Цена (₽) *</label>
                      <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} placeholder="45000" />
                    </div>
                    <div>
                      <label className={labelCls}>Категория</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className={inputCls + " cursor-pointer"}
                      >
                        <option value="">— Без категории —</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Эпоха</label>
                      <input value={form.era} onChange={(e) => setForm({ ...form, era: e.target.value })} className={inputCls} placeholder="XVIII век, XIX век..." />
                    </div>
                  </div>

                  {/* Image upload */}
                  <div className="mb-5">
                    <label className={labelCls}>Фотография товара</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleFileDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed flex flex-col items-center justify-center py-8 cursor-pointer transition-all duration-300 ${dragOver ? "border-gold bg-gold/5" : "border-border hover:border-gold/50 hover:bg-dark-elevated"}`}
                      >
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                        {uploading ? (
                          <><Icon name="Loader2" size={24} className="animate-spin text-gold mb-2" /><p className="font-montserrat text-xs text-muted-foreground">Загрузка...</p></>
                        ) : (
                          <><Icon name="Upload" size={24} className="text-gold/50 mb-2" /><p className="font-montserrat text-xs text-foreground/70 text-center">Перетащите фото сюда<br/>или нажмите для выбора</p><p className="font-montserrat text-[10px] text-muted-foreground mt-1">JPG, PNG, WEBP</p></>
                        )}
                      </div>
                      <div className="border border-border bg-dark-elevated flex items-center justify-center min-h-[120px] overflow-hidden">
                        {form.image ? (
                          <div className="relative w-full h-full min-h-[120px]">
                            <img src={form.image} alt="Превью" className="w-full h-full object-cover" style={{ minHeight: 120 }} />
                            <button type="button" onClick={() => setForm({ ...form, image: "" })} className="absolute top-2 right-2 w-6 h-6 bg-dark-base/80 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors">
                              <Icon name="X" size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center"><Icon name="Image" size={28} className="text-muted-foreground/30 mx-auto mb-1" /><p className="font-montserrat text-[10px] text-muted-foreground">Предпросмотр</p></div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputCls} placeholder="Или вставьте ссылку на фото: https://..." />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className={labelCls}>Описание</label>
                    <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} placeholder="Краткое описание предмета..." />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={saving || uploading} className="gold-gradient text-dark-base font-montserrat text-xs tracking-[0.2em] uppercase px-8 py-3 hover:opacity-90 transition-all duration-300 disabled:opacity-60 flex items-center gap-2">
                      {saving ? <><Icon name="Loader2" size={13} className="animate-spin" />Сохранение...</> : "Сохранить"}
                    </button>
                    <button type="button" onClick={closeForm} className="border border-border text-muted-foreground font-montserrat text-xs tracking-[0.2em] uppercase px-8 py-3 hover:border-gold/40 hover:text-gold transition-all duration-300">
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products list */}
            {loadingProducts ? (
              <div className="text-center py-20"><Icon name="Loader2" size={32} className="animate-spin text-gold mx-auto" /></div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border">
                <p className="font-cormorant text-2xl text-muted-foreground font-light mb-2">Товаров пока нет</p>
                <p className="font-montserrat text-xs text-muted-foreground">Нажмите «Добавить товар» чтобы начать</p>
              </div>
            ) : (
              <>
                <p className="font-montserrat text-[10px] text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Icon name="GripVertical" size={12} />
                  Перетащите товары для изменения порядка в каталоге
                </p>
                <div className="space-y-2">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      draggable
                      onDragStart={() => handleSortDragStart(p.id)}
                      onDragOver={(e) => handleSortDragOver(e, p.id)}
                      onDrop={(e) => handleSortDrop(e, p.id)}
                      onDragEnd={handleSortDragEnd}
                      className={`bg-dark-surface border flex items-center gap-4 p-4 transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
                        draggedId === p.id ? "opacity-40 border-gold/30" : dragOverId === p.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/30"
                      }`}
                    >
                      <div className="text-muted-foreground/40 hover:text-gold/60 transition-colors flex-shrink-0">
                        <Icon name="GripVertical" size={18} />
                      </div>
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-14 h-14 object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 bg-dark-elevated flex items-center justify-center flex-shrink-0">
                          <Icon name="Image" size={18} className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-cormorant text-lg text-foreground font-light truncate">{p.name}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          {p.category && <span className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-gold/60">{p.category}</span>}
                          {p.era && <span className="font-montserrat text-[9px] text-muted-foreground">{p.era}</span>}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right mr-2">
                        <p className="font-cormorant text-xl text-gold font-light">{p.price.toLocaleString("ru-RU")} ₽</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => handleEdit(p)} className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/40 transition-all duration-300">
                          <Icon name="Pencil" size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} disabled={deletingId === p.id} className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-red-400 hover:border-red-400/40 transition-all duration-300 disabled:opacity-40">
                          {deletingId === p.id ? <Icon name="Loader2" size={14} className="animate-spin" /> : <Icon name="Trash2" size={14} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ===== CATEGORIES TAB ===== */}
        {tab === "categories" && (
          <div className="max-w-xl">
            {/* Add category form */}
            <div className="bg-dark-surface border border-gold/30 p-6 mb-6">
              <h2 className="font-cormorant text-xl text-foreground font-light mb-4">Новая категория</h2>
              <form onSubmit={handleAddCategory} className="flex gap-3">
                <input
                  value={catName}
                  onChange={(e) => { setCatName(e.target.value); setCatError(""); }}
                  className={inputCls}
                  placeholder="Название категории"
                />
                <button
                  type="submit"
                  disabled={savingCat || !catName.trim()}
                  className="gold-gradient text-dark-base font-montserrat text-[10px] tracking-[0.2em] uppercase px-6 py-3 hover:opacity-90 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                >
                  {savingCat ? <Icon name="Loader2" size={13} className="animate-spin" /> : <Icon name="Plus" size={13} />}
                  Добавить
                </button>
              </form>
              {catError && <p className="font-montserrat text-xs text-red-400 mt-2">{catError}</p>}
            </div>

            {/* Categories list */}
            {loadingCats ? (
              <div className="text-center py-10"><Icon name="Loader2" size={28} className="animate-spin text-gold mx-auto" /></div>
            ) : categories.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-border">
                <p className="font-cormorant text-xl text-muted-foreground font-light">Категорий пока нет</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-dark-surface border border-border p-4 flex items-center gap-3 hover:border-gold/30 transition-all duration-200">
                    <Icon name="Tag" size={15} className="text-gold/50 flex-shrink-0" />
                    {editingCat?.id === cat.id ? (
                      <form onSubmit={handleSaveCat} className="flex-1 flex gap-2">
                        <input
                          autoFocus
                          value={editingCatName}
                          onChange={(e) => { setEditingCatName(e.target.value); setCatError(""); }}
                          className="flex-1 bg-dark-elevated border border-gold/40 px-3 py-2 font-montserrat text-sm text-foreground focus:outline-none focus:border-gold/70 transition-colors"
                        />
                        <button type="submit" disabled={savingCat || !editingCatName.trim()} className="gold-gradient text-dark-base font-montserrat text-[10px] tracking-widest uppercase px-4 py-2 hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-1">
                          {savingCat ? <Icon name="Loader2" size={12} className="animate-spin" /> : <Icon name="Check" size={12} />}
                          Сохранить
                        </button>
                        <button type="button" onClick={() => { setEditingCat(null); setEditingCatName(""); setCatError(""); }} className="border border-border text-muted-foreground font-montserrat text-[10px] tracking-widest uppercase px-4 py-2 hover:border-gold/40 hover:text-gold transition-all">
                          Отмена
                        </button>
                      </form>
                    ) : (
                      <>
                        <span className="flex-1 font-montserrat text-sm text-foreground">{cat.name}</span>
                        <button
                          onClick={() => { setEditingCat(cat); setEditingCatName(cat.name); setCatError(""); }}
                          className="w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/40 transition-all duration-200"
                        >
                          <Icon name="Pencil" size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteCat(cat.id)}
                          disabled={deletingCatId === cat.id}
                          className="w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:text-red-400 hover:border-red-400/40 transition-all duration-200 disabled:opacity-40"
                        >
                          {deletingCatId === cat.id ? <Icon name="Loader2" size={13} className="animate-spin" /> : <Icon name="Trash2" size={13} />}
                        </button>
                      </>
                    )}
                  </div>
                ))}
                {catError && editingCat && <p className="font-montserrat text-xs text-red-400 mt-1 px-1">{catError}</p>}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
