import { useEffect, useState } from "react";
import api from "../../lib/api";
import { User, Mail, Calendar, Shield, ShoppingBag } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Backend'de oluşturduğumuz route'a istek atıyoruz
      const { data } = await api.get("/api/auth/users");
      setUsers(data);
    } catch (error) {
      console.error("Kullanıcılar yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Yükleniyor...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">Kullanıcılar</h1>
        <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-600">
          Toplam: <span className="text-black font-bold">{users.length}</span> Kayıtlı Kullanıcı
        </div>
      </div>

      <div className="bg-white border border-beige/40 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b">
              <tr>
                <th className="px-6 py-4">Kullanıcı</th>
                <th className="px-6 py-4">E-posta</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Sipariş Sayısı</th>
                <th className="px-6 py-4">Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <User size={16} />
                      </div>
                      <span className="font-medium text-black">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="opacity-50" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.role === "admin" 
                        ? "bg-purple-100 text-purple-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      <Shield size={12} />
                      {user.role === "admin" ? "Yönetici" : "Müşteri"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                       <ShoppingBag size={14} className="opacity-50" />
                       {user._count?.orders || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="opacity-50" />
                      {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
            <div className="p-10 text-center text-gray-500">Kayıtlı kullanıcı bulunamadı.</div>
        )}
      </div>
    </div>
  );
}