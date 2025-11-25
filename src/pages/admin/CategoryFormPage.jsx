import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/api";

export default function CategoryFormPage() {
  const { id } = useParams(); // id varsa edit mod
  const navigate = useNavigate();
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    imageUrl: "",
    publicId: "",
  });
  const [busy, setBusy] = useState(false);
  const editMode = Boolean(id);

  // Edit modunda mevcut kategoriyi çek
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
        });
      } catch (e) {
        alert("Kategori yüklenemedi");
        navigate("/admin/categories", { replace: true });
      }
    })();
  }, [editMode, id, navigate]);

  async function handleUpload() {
    const files = fileRef.current?.files;
    if (!files?.length) return;

    const fd = new FormData();
    fd.append("files", files[0]); // multer.array('files')

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

  async function handleRemoveImage() {
    // Görseli kaldır (Cloudinary’den de silmeye çalış)
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

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      if (editMode) {
        await api.put(`/api/categories/${id}`, form);
      } else {
        await api.post(`/api/categories`, form);
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
        <input
          placeholder="Kategori Adı"
          className="border border-beige rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
        <input
          placeholder="Slug (ör. erkek-giyim)"
          className="border border-beige rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          required
        />

        {/* Görsel yükleme alanı */}
        <div className="border rounded-xl p-3">
          <div className="flex items-center gap-2">
            <input type="file" ref={fileRef} accept="image/*" />
            <button
              type="button"
              onClick={handleUpload}
              disabled={busy}
              className="border px-3 py-2 rounded-lg"
            >
              {busy ? "Yükleniyor..." : "Yükle"}
            </button>
            {form.imageUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="border px-3 py-2 rounded-lg"
              >
                Görseli Kaldır
              </button>
            )}
          </div>

          {form.imageUrl && (
            <div className="mt-3">
              <img
                src={form.imageUrl}
                alt="Kategori görseli"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="bg-gold text-black font-medium px-4 py-2 rounded-lg hover:bg-gold/90 transition"
          >
            {editMode ? "Güncelle" : "Kaydet"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="border px-4 py-2 rounded-lg"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
