import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminComptes = () => {
  const [comptes, setComptes]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [message, setMessage]   = useState('');
  const navigate                = useNavigate();

  const fetchComptes = async () => {
    try {
      const res = await api.get('/admin/comptes');
      setComptes(res.data);
    } catch (err) {
      setMessage('Erreur lors du chargement des comptes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComptes(); }, []);

  const handleAction = async (uuid, action) => {
    try {
      await api.patch(`/admin/comptes/${uuid}/${action}`);
      setMessage(`Compte ${action} avec succès.`);
      fetchComptes();
    } catch (err) {
      setMessage('Erreur lors de l\'action.');
    }
  };

  const badgeStatut = (statut) => {
    const styles = {
      en_attente: 'bg-yellow-100 text-yellow-700',
      approuve:   'bg-green-100 text-green-700',
      bloque:     'bg-red-100 text-red-700',
    };
    const labels = {
      en_attente: 'En attente',
      approuve:   'Approuvé',
      bloque:     'Bloqué',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[statut]}`}>
        {labels[statut]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">OGAS</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-500 hover:text-blue-600"
        >
          ← Retour
        </button>
      </nav>

      <div className="max-w-5xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestion des comptes RH</h2>
        <p className="text-gray-500 text-sm mb-6">Approuver ou bloquer les comptes Gestionnaire RH</p>

        {/* Message */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg text-sm mb-6">
            {message}
          </div>
        )}

        {/* Tableau */}
        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : comptes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
            Aucun compte RH trouvé.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Nom</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Statut</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Inscription</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comptes.map((compte) => (
                  <tr key={compte.uuid} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{compte.nom}</td>
                    <td className="px-6 py-4 text-gray-600">{compte.email}</td>
                    <td className="px-6 py-4">{badgeStatut(compte.statut)}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(compte.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {compte.statut !== 'approuve' && (
                        <button
                          onClick={() => handleAction(compte.uuid, 'approuver')}
                          className="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                        >
                          Approuver
                        </button>
                      )}
                      {compte.statut !== 'bloque' && (
                        <button
                          onClick={() => handleAction(compte.uuid, 'bloquer')}
                          className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                        >
                          Bloquer
                        </button>
                      )}
                      {compte.statut === 'bloque' && (
                        <button
                          onClick={() => handleAction(compte.uuid, 'debloquer')}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                        >
                          Débloquer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComptes;
