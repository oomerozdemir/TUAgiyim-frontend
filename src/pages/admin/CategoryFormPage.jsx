import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/api";

export default function CategoryFormPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const fileRef = useRef();

  const [categories, setCategories] = useState([]);
  
  const [form, setForm] = useState({
    name: "",
    slug: "",
    imageUrl: "",
    publicId: "",
    parentId: "", // Yeni: Üst kategori ID'si
  });
  const [busy, setBusy] = useState(false);
  const editMode = Boolean(id);

  // 1. Tüm kategorileri çek (Dropdown için)
  useEffect(() => {
    api.get("/api/categories")
      .then((res) => {
        // Eğer edit modundaysak, kendimizi parent olarak seçmemeliyiz.
        // Listeden kendisini filtreliyoruz.
        const all = Array.isArray(res.data) ? res.data : [];
        setCategories(id ? all.filter(c => c.id !== id) : all);
      })
      .catch((err) => console.error("Kategoriler çekilemedi:", err));
  }, [id]);

  // 2. Edit modundaysak mevcut kategoriyi çek ve forma doldur
  useEffect(() => {
    if (!editMode) return;
    (async () => {
      try {
        const { data } = await api.get(`/api/categories/${id}`);
        setForm({
          name: data.name ?? "",
          slug: data.slug ?? "",
          imageUrl: data.imageUrl ?? "",
          publicId: data.publicId ?? "",
          parentId: data.parentId ?? "", // Mevcut parent varsa getir
        });
      } catch (e) {
        alert("Kategori yüklenemedi");
        navigate("/admin/categories", { replace: true });
      }
    })();
  }, [editMode, id, navigate]);

  // Görsel Yükleme
  async function handleUpload() {
    const files = fileRef.current?.files;
    if (!files?.length) return;

    const fd = new FormData();
    fd.append("files", files[0]);

    setBusy(true);
    try {
      const { data } = await api.post(`/api/upload?folder=categories`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploaded = data?.files?.[0];
      if (uploaded?.url) {
        setForm((f) => ({
          ...f,
          imageUrl: uploaded.url,
          publicId: uploaded.publicId || "",
        }));
      }
      if (fileRef.current) fileRef.current.value = "";
    } finally {
      setBusy(false);
    }
  }

  // Görsel Kaldırma
  async function handleRemoveImage() {
    const pid = form.publicId;
    setForm((f) => ({ ...f, imageUrl: "", publicId: "" }));
    if (pid) {
      try {
        await api.delete(`/api/upload/${pid}`);
      } catch {
        /* yoksay */
      }
    }
  }

  // Kaydet / Güncelle
  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      // parentId boş string ise null gönderelim (veya backend boş stringi handle etmeli)
      // En garantisi payload'ı düzenlemek:
      const payload = { ...form, parentId: form.parentId || null };

      if (editMode) {
        await api.put(`/api/categories/${id}`, payload);
      } else {
        await api.post(`/api/categories`, payload);
      }
      navigate("/admin/categories", { replace: true });
    } catch (err) {
      alert(
        (editMode ? "Güncelleme" : "Kaydetme") +
          " başarısız: " +
          (err.response?.data?.message || "Bilinmeyen hata")
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-2xl font-semibold mb-4">
        {editMode ? "Kategoriyi Düzenle" : "Yeni Kategori"}
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-3">
        
        {/* Üst Kategori Seçimi */}
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Üst Kategori (Opsiyonel)</label>
            <select
                className="border border-beige rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold bg-white"
                value={form.parentId}
                onChange={(e) => setForm(f => ({ ...f, parentId: e.target.value }))}
            >
                <option value="">-- Yok (Ana Kategori Yap) --</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
            <p className="text-xs text-gray-500">
              Eğer "Yeni Sezon", "İndirim" gibi bir grup oluşturacaksanız boş bırakın.
              Alt kategori (örn: Elbise) oluşturuyorsanız grubunu seçin.
            </p>
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Kategori Adı</label>
            <input
            placeholder="Örn: Elbise"
            className="border border-beige rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            />
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Slug (URL Adresi)</label>
            <input
            placeholder="Örn: yeni-sezon-elbise"
            className="border border-beige rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            required
            />
        </div>

        {/* Görsel yükleme alanı */}
        <div className="border rounded-xl p-3 bg-white">
          <div className="text-sm font-medium mb-2">Kategori Görseli</div>
          <div className="flex items-center gap-2">
            <input type="file" ref={fileRef} accept="image/*" className="text-sm" />
            <button
              type="button"
              onClick={handleUpload}
              disabled={busy}
              className="border px-3 py-1 text-sm rounded-lg hover:bg-gray-50"
            >
              {busy ? "..." : "Yükle"}
            </button>
            {form.imageUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="border px-3 py-1 text-sm rounded-lg text-red-500 hover:bg-red-50"
              >
                Sil
              </button>
            )}
          </div>

          {form.imageUrl && (
            <div className="mt-3">
              <img
                src={form.imageUrl}
                alt="Kategori görseli"
                className="w-32 h-32 object-cover rounded border"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={busy}
            className="bg-gold text-black font-medium px-6 py-2 rounded-lg hover:bg-gold/90 transition shadow-sm"
          >
            {editMode ? "Güncelle" : "Kaydet"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="border px-6 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}