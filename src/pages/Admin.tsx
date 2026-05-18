import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/a7d65e38-ef61-4f2a-93fc-0ae9439533a8";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  era: string;
  description: string;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const adminHeaders = {
    "Content-Type": "application/json",
    "X-Admin-Password": password,
  };

  const loadProducts = async () => {
    setLoading(true);
    const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

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
      // Удаляем тестовый товар если создался
      if (res.status === 201) {
        const created = await res.json();
        await fetch(API_URL, {
          method: "DELETE",
          headers: adminHeaders,
          body: JSON.stringify({ id: created.id }),
        });
        loadProducts();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, price: Number(form.price), id: editingId };
    await fetch(API_URL, {
      method: editingId ? "PUT" : "POST",
      headers: adminHeaders,
      body: JSON.stringify(payload),
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
    await fetch(API_URL, {
      method: "DELETE",
      headers: adminHeaders,
      body: JSON.stringify({ id }),
    });
    setDeletingId(null);
    loadProducts();
  };

  const handleNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setAuthError(false); }}
                className={inputCls}
                placeholder="••••••••"
                autoFocus
              />
              {authError && <p className="font-montserrat text-xs text-red-400 mt-2">Неверный пароль</p>}
            </div>
            <button type="submit" className="w-full gold-gradient text-dark-base font-montserrat text-xs tracking-[0.3em] uppercase py-4 hover:opacity-90 transition-all duration-300">
              Войти
            </button>
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
            <h1 className="font-cormorant text-xl text-foreground font-light">Товары каталога</h1>
          </div>
        </div>
        <button
          onClick={handleNew}
          className="gold-gradient text-dark-base font-montserrat text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 hover:opacity-90 transition-all duration-300 flex items-center gap-2"
        >
          <Icon name="Plus" size={14} />
          Добавить товар
        </button>
      </div>

      <div className="max-w-5xl mx-auto p-6">

        {/* Form */}
        {showForm && (
          <div className="bg-dark-surface border border-gold/30 p-6 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-cormorant text-2xl text-foreground font-light">
                {editingId ? "Редактировать товар" : "Новый товар"}
              </h2>
              <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setEditingId(null); }} className="text-muted-foreground hover:text-gold transition-colors">
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
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} placeholder="Часы, Мебель, Фарфор..." />
                </div>
                <div>
                  <label className={labelCls}>Эпоха</label>
                  <input value={form.era} onChange={(e) => setForm({ ...form, era: e.target.value })} className={inputCls} placeholder="XVIII век, XIX век..." />
                </div>
              </div>
              <div className="mb-5">
                <label className={labelCls}>Ссылка на фото</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputCls} placeholder="https://..." />
              </div>
              <div className="mb-6">
                <label className={labelCls}>Описание</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} placeholder="Краткое описание предмета..." />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="gold-gradient text-dark-base font-montserrat text-xs tracking-[0.2em] uppercase px-8 py-3 hover:opacity-90 transition-all duration-300 disabled:opacity-60 flex items-center gap-2">
                  {saving ? <><Icon name="Loader2" size={13} className="animate-spin" />Сохранение...</> : "Сохранить"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setEditingId(null); }} className="border border-border text-muted-foreground font-montserrat text-xs tracking-[0.2em] uppercase px-8 py-3 hover:border-gold/40 hover:text-gold transition-all duration-300">
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products table */}
        {loading ? (
          <div className="text-center py-20">
            <Icon name="Loader2" size={32} className="animate-spin text-gold mx-auto" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border">
            <p className="font-cormorant text-2xl text-muted-foreground font-light mb-2">Товаров пока нет</p>
            <p className="font-montserrat text-xs text-muted-foreground">Нажмите «Добавить товар» чтобы начать</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="bg-dark-surface border border-border flex items-center gap-4 p-4 hover:border-gold/30 transition-all duration-300">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-16 h-16 object-cover flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-dark-elevated flex items-center justify-center flex-shrink-0">
                    <Icon name="Image" size={20} className="text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-cormorant text-lg text-foreground font-light truncate">{p.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {p.category && <span className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-gold/60">{p.category}</span>}
                    {p.era && <span className="font-montserrat text-[9px] text-muted-foreground">{p.era}</span>}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right mr-4">
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
        )}
      </div>
    </div>
  );
}
