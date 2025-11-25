import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [publicId, setPublicId] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef();

  async function fetchCategories() {
    setLoading(true);
    try {
      const { data } = await api.get("/api/categories");
      setCategories(data);
    } finally { setLoading(false); }
  }
  useEffect(() => { fetchCategories(); }, []);

  // ⬇️ Görsel yükleme
  async function handleUpload() {
    const files = fileRef.current?.files;
    if (!files?.length) return alert("Bir dosya seçin.");
    const fd = new FormData();
    fd.append("files", files[0]); // <-- DİKKAT: 'files' alanı
    setBusy(true);
    try {
      const { data } = await api.post("/api/upload?folder=categories", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const up = data.files[0];
      setImageUrl(up.url);
      setPublicId(up.publicId);
    } finally { setBusy(false); }
  }

  // ⬇️ Kategori ekle (görsel alanlarıyla birlikte)
  async function handleAddCategory(e) {
    e.preventDefault();
    if (!name || !slug) return alert("Ad ve slug gerekli");
    setBusy(true);
    try {
      await api.post("/api/categories", { name, slug, imageUrl, publicId });
      setName(""); setSlug(""); setImageUrl(""); setPublicId("");
      if (fileRef.current) fileRef.current.value = "";
      fetchCategories();
    } finally { setBusy(false); }
  }

  async function handleDelete(id) {
    if (!confirm("Bu kategoriyi silmek istiyor musunuz?")) return;
    await api.delete(`/api/categories/${id}`);
    fetchCategories();
  }

  return (
    <div className="max-w-4xl mx-auto pt-10 px-4">
      <h2 className="text-2xl font-semibold mb-6">Kategoriler</h2>

      <form onSubmit={handleAddCategory} className="grid gap-3 mb-8">
        <input className="border rounded-lg px-4 py-2" placeholder="Kategori Adı"
               value={name} onChange={e=>setName(e.target.value)} required/>
        <input className="border rounded-lg px-4 py-2" placeholder="Slug (ör. erkek-giyim)"
               value={slug} onChange={e=>setSlug(e.target.value)} required/>

        {/* Görsel yükleme */}
        <div className="border rounded-xl p-3">
          <div className="flex items-center gap-2">
            <input type="file" ref={fileRef} />
            <button type="button" onClick={handleUpload} disabled={busy}
              className="border px-3 py-2 rounded-lg">{busy ? "Yükleniyor..." : "Yükle"}</button>
          </div>
          {imageUrl && (
            <div className="mt-3">
              <img src={imageUrl} alt="Kapak" className="w-32 h-32 object-cover rounded"/>
            </div>
          )}
        </div>

        <button type="submit" disabled={busy}
          className="bg-gold text-black font-medium px-4 py-2 rounded-lg hover:bg-gold/90 transition">
          Ekle
        </button>
      </form>

      {/* Liste */}
      {loading ? <p>Yükleniyor...</p> : (
        <table className="w-full border-collapse">
          <thead><tr className="text-left border-b">
            <th className="p-3">Görsel</th><th className="p-3">Ad</th><th className="p-3">Slug</th><th className="p-3 text-center">İşlem</th>
          </tr></thead>
          <tbody>
            {categories.map(c=>(
              <tr key={c.id} className="border-b">
                <td className="p-3">{c.imageUrl ? <img src={c.imageUrl} className="w-12 h-12 object-cover rounded"/> : "-"}</td>
                <td className="p-3">{c.name}</td>
                <td className="p-3 text-black/70">{c.slug}</td>
                <td className="p-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <Link
                      to={`/admin/categories/${c.id}`}
                      className="text-sm border rounded px-3 py-1"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={()=>handleDelete(c.id)}
                      className="text-sm border rounded px-3 py-1"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
