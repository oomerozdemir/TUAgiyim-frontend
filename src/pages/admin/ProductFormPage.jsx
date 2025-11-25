import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/api";

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [allCats, setAllCats] = useState([]);
  const [selectedCatIds, setSelectedCatIds] = useState([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    description: "",
    images: [], // Eski (genel) resimler varsa burada tutulur ama arayüzde gösterilmez/eklenmez
    featured: false,
    sizes: [], // [{label, stock}]
    colors: [], // [{label, stock, images:[{url, publicId}]}]
    attributes: [], // [{label, value}]
  });

  // Kategoriler
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/categories");
        setAllCats(data);
      } catch {}
    })();
  }, []);

  // Ürün yükle (edit)
  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await api.get(`/api/products/${id}`);
      // Renge ait görselleri, product.images içinden colorId eşleştirerek dağıt
      const colorsFromApi = Array.isArray(data.colors) ? data.colors : [];
      const imagesFromApi = Array.isArray(data.images) ? data.images : [];

      const colors = colorsFromApi.map((c) => ({
        label: c.label,
        stock: c.stock,
        images: imagesFromApi
          .filter((im) => im.colorId === c.id)
          .map((im) => ({ url: im.url, publicId: im.publicId || null })),
      }));

      setForm({
        name: data.name ?? "",
        slug: data.slug ?? "",
        price: data.price ?? "",
        description: data.description ?? "",
        // Genel görselleri state'e alıyoruz ki kaydederken silinmesinler (eski veri koruması)
        images: imagesFromApi
          .filter((im) => !im.colorId)
          .map((img) => ({ url: img.url, publicId: img.publicId || null })),
        featured: Boolean(data.featured),
        sizes: Array.isArray(data.sizes)
          ? data.sizes.map((s) => ({ label: s.label, stock: s.stock }))
          : [],
        colors,
        attributes: Array.isArray(data.attributes) ? data.attributes : [],
      });

      if (data.categories) {
        setSelectedCatIds(data.categories.map((c) => c.id));
      }
    })();
  }, [id]);

  function toggleCat(id) {
    setSelectedCatIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  // === BEDEN işlemleri ===
  function addSize() {
    setForm((f) => ({ ...f, sizes: [...f.sizes, { label: "", stock: 0 }] }));
  }
  function updateSize(i, key, val) {
    setForm((f) => {
      const c = [...f.sizes];
      c[i] = { ...c[i], [key]: key === "stock" ? Number(val || 0) : val };
      return { ...f, sizes: c };
    });
  }
  function removeSize(i) {
    setForm((f) => ({ ...f, sizes: f.sizes.filter((_, x) => x !== i) }));
  }

  // === RENK işlemleri ===
  function addColor() {
    setForm((f) => ({
      ...f,
      colors: [...f.colors, { label: "", stock: 0, images: [] }],
    }));
  }
  function updateColor(i, key, val) {
    setForm((f) => {
      const c = [...f.colors];
      c[i] = { ...c[i], [key]: key === "stock" ? Number(val || 0) : val };
      return { ...f, colors: c };
    });
  }
  function removeColor(i) {
    setForm((f) => ({ ...f, colors: f.colors.filter((_, x) => x !== i) }));
  }

  // Renge çoklu görsel yükleme
  async function uploadColorImages(i, files) {
    if (!files?.length) return;
    const fd = new FormData();
    for (const f of files) fd.append("files", f);
    setBusy(true);
    try {
      const { data } = await api.post(`/api/upload?folder=products`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const ups = data?.files || [];
      setForm((f) => {
        const copy = [...f.colors];
        const cur = copy[i] || { label: "", stock: 0, images: [] };
        cur.images = [
          ...(cur.images || []),
          ...ups.map((u) => ({ url: u.url, publicId: u.publicId })),
        ];
        copy[i] = cur;
        return { ...f, colors: copy };
      });
    } finally {
      setBusy(false);
    }
  }

  async function removeColorImage(colorIdx, imgIdx) {
    const im = form.colors?.[colorIdx]?.images?.[imgIdx];
    setForm((f) => {
      const copy = [...f.colors];
      copy[colorIdx] = {
        ...copy[colorIdx],
        images: (copy[colorIdx].images || []).filter((_, i) => i !== imgIdx),
      };
      return { ...f, colors: copy };
    });
    if (im?.publicId) {
      try {
        await api.delete(`/api/upload/${im.publicId}`);
      } catch {}
    }
  }

  // === ÜRÜN DETAYLARI (attributes) ===
  function addAttribute() {
    setForm((f) => ({
      ...f,
      attributes: [...(f.attributes || []), { label: "", value: "" }],
    }));
  }
  function updateAttribute(i, key, val) {
    setForm((f) => {
      const list = [...(f.attributes || [])];
      list[i] = { ...list[i], [key]: val };
      return { ...f, attributes: list };
    });
  }
  function removeAttribute(i) {
    setForm((f) => ({
      ...f,
      attributes: (f.attributes || []).filter((_, x) => x !== i),
    }));
  }

  // Kaydet
  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      // Renk görsellerini images payload'ına colorLabel ile ekle
      const colorImages = (form.colors || []).flatMap((c) =>
        (c.images || []).map((im) => ({
          url: im.url,
          publicId: im.publicId || null,
          colorLabel: c.label?.trim(),
        }))
      );

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description?.trim() || null,
        price: Number(form.price),
        featured: !!form.featured,
        categoryIds: selectedCatIds,
        // Genel görselleri koruyoruz (eski veriler kaybolmasın) ama yeni eklenmiyor
        images: [...form.images, ...colorImages],
        sizes: form.sizes
          .filter((s) => s.label?.trim())
          .map((s) => ({ label: s.label.trim(), stock: Number(s.stock || 0) })),
        colors: form.colors
          .filter((c) => c.label?.trim())
          .map((c) => ({ label: c.label.trim(), stock: Number(c.stock || 0) })),
        ...(form.attributes?.length
          ? {
              attributes: form.attributes
                .filter((a) => a.label?.trim() && a.value?.trim())
                .map((a) => ({ label: a.label.trim(), value: a.value.trim() })),
            }
          : {}),
      };

      if (id) await api.put(`/api/products/${id}`, payload);
      else await api.post(`/api/products`, payload);

      navigate("/admin/products");
    } catch (err) {
      alert("Kaydedilemedi: " + (err.response?.data?.message || err.message));
    } finally {
      setBusy(false);
    }
  }

  const totalStock = form.sizes.reduce((a, s) => a + (Number(s.stock) || 0), 0);

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4">
        {id ? "Ürünü Düzenle" : "Yeni Ürün"}
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Ürün Adı"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          required
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Slug (ör. siyah-tshirt)"
          value={form.slug}
          onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
          required
        />
        <input
          type="number"
          step="0.01"
          className="border rounded px-3 py-2"
          placeholder="Fiyat"
          value={form.price}
          onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
          required
        />

        <textarea
          rows={4}
          className="border rounded px-3 py-2"
          placeholder="Açıklama"
          value={form.description}
          onChange={(e) =>
            setForm((s) => ({ ...s, description: e.target.value }))
          }
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) =>
              setForm((s) => ({ ...s, featured: e.target.checked }))
            }
          />
          <span>Bu ürünü anasayfada öne çıkar</span>
        </label>

        {/* BEDENLER */}
        <div className="border rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Bedenler</h3>
            <button type="button" onClick={addSize} className="border rounded px-3 py-1">
              + Ekle
            </button>
          </div>
          {form.sizes.map((s, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="border rounded px-3 py-1 w-1/2"
                placeholder="Beden (örn: S, M, L)"
                value={s.label}
                onChange={(e) => updateSize(i, "label", e.target.value)}
              />
              <input
                type="number"
                className="border rounded px-3 py-1 w-1/3"
                placeholder="Stok"
                value={s.stock}
                onChange={(e) => updateSize(i, "stock", e.target.value)}
              />
              <button type="button" onClick={() => removeSize(i)} className="border rounded px-3 py-1">
                Sil
              </button>
            </div>
          ))}
          <div className="text-sm text-black/60 mt-1">
            Toplam stok: <b>{totalStock}</b>
          </div>
        </div>

        {/* RENKLER VE GÖRSELLER */}
        <div className="border rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Renkler ve Görseller</h3>
            <button type="button" onClick={addColor} className="border rounded px-3 py-1">
              + Renk Ekle
            </button>
          </div>

          {form.colors.length === 0 && (
            <p className="text-sm text-black/50 italic">
              Ürüne görsel eklemek için önce bir renk ekleyiniz.
            </p>
          )}

          {form.colors.map((c, i) => (
            <div key={i} className="mb-3 border border-black/10 rounded-lg p-3">
              <div className="grid grid-cols-12 gap-2 items-center">
                <input
                  className="col-span-4 border rounded px-3 py-1"
                  placeholder="Renk (örn: Siyah)"
                  value={c.label}
                  onChange={(e) => updateColor(i, "label", e.target.value)}
                />
                <input
                  type="number"
                  className="col-span-2 border rounded px-3 py-1"
                  placeholder="Stok"
                  value={c.stock}
                  onChange={(e) => updateColor(i, "stock", e.target.value)}
                />
                <div className="col-span-4 flex items-center gap-2">
                  <label className="cursor-pointer border px-3 py-1 rounded text-sm hover:bg-gray-50">
                    Görsel Seç
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => uploadColorImages(i, e.target.files)}
                    />
                  </label>
                </div>
                <div className="col-span-2 text-right">
                  <button type="button" onClick={() => removeColor(i)} className="text-red-500 text-sm hover:underline">
                    Sil
                  </button>
                </div>
              </div>

              {/* Yüklenen görseller */}
              {(c.images?.length ? true : false) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.images.map((im, k) => (
                    <div key={k} className="relative w-20 h-20 rounded overflow-hidden border bg-gray-50 group">
                      <img src={im.url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeColorImage(i, k)}
                        title="Kaldır"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* KATEGORİLER */}
        <div className="border rounded-xl p-3">
          <div className="font-medium mb-2">Kategoriler</div>
          {allCats.length === 0 ? (
            <div className="text-sm text-black/60">Kategori yok. Önce Admin → Kategoriler sekmesinden ekle.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allCats.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCatIds.includes(cat.id)}
                    onChange={() => toggleCat(cat.id)}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* ÜRÜN DETAYLARI (attributes) */}
        <div className="border rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Ürün Detayları</h3>
            <button type="button" onClick={addAttribute} className="border rounded px-3 py-1">
              + Satır Ekle
            </button>
          </div>
          {(form.attributes || []).map((a, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 mb-2">
              <input
                className="col-span-5 border rounded px-3 py-1"
                placeholder="Etiket (örn: Ref. No)"
                value={a.label}
                onChange={(e) => updateAttribute(i, "label", e.target.value)}
              />
              <input
                className="col-span-6 border rounded px-3 py-1"
                placeholder="Değer (örn: 1095657-089)"
                value={a.value}
                onChange={(e) => updateAttribute(i, "value", e.target.value)}
              />
              <div className="col-span-1 text-right">
                <button type="button" onClick={() => removeAttribute(i)} className="border rounded px-3 py-1">
                  Sil
                </button>
              </div>
            </div>
          ))}
          {(!form.attributes || form.attributes.length === 0) && (
            <p className="text-xs text-black/60">Örn: Ref. No, Sezon, Materyal, Özellik, Ölçü bilgileri…</p>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={busy} className="bg-gold text-black px-4 py-2 rounded">
            {id ? "Güncelle" : "Kaydet"}
          </button>
          <button type="button" className="border px-4 py-2 rounded" onClick={() => navigate(-1)}>
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}