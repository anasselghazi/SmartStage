import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ITEMS_PAR_PAGE = 10;

const Historique = () => {
  const [attestations, setAttestations] = useState([]);
  const [filtrees, setFiltrees]         = useState([]);
  const [recherche, setRecherche]       = useState('');
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [page, setPage]                 = useState(1);
  const navigate                        = useNavigate();

  useEffect(() => {
    const fetchAttestations = async () => {
      try {
        const res = await api.get('/attestations');
        setAttestations(res.data.attestations);
        setFiltrees(res.data.attestations);
      } catch (err) {
        setError('Erreur lors du chargement de l\'historique.');
      } finally {
        setLoading(false);
      }
    };
    fetchAttestations();
  }, []);

  const handleSearch = (e) => {
    const cle = e.target.value.toLowerCase();
    setRecherche(e.target.value);
    setPage(1);
    const resultats = attestations.filter((att) =>
      att.numero?.toLowerCase().includes(cle) ||
      att.stagiaire?.nom_complet?.toLowerCase().includes(cle) ||
      att.stagiaire?.reference?.toLowerCase().includes(cle) ||
      att.stagiaire?.cin?.toLowerCase().includes(cle)
    );
    setFiltrees(resultats);
  };

  // Pagination
  const totalPages  = Math.ceil(filtrees.length / ITEMS_PAR_PAGE);
  const debut       = (page - 1) * ITEMS_PAR_PAGE;
  const pageActuelle = filtrees.slice(debut, debut + ITEMS_PAR_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Historique des attestations</h2>
          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
            {filtrees.length} attestation(s)
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-6">Toutes les attestations générées</p>

        {/* Barre de recherche */}
        <div className="mb-6">
          <input
            type="text"
            value={recherche}
            onChange={handleSearch}
            placeholder="Rechercher par numéro, nom, CIN ou référence..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filtrees.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
            <p className="text-4xl mb-3">📄</p>
            <p>{recherche ? 'Aucun résultat pour cette recherche.' : 'Aucune attestation générée pour le moment.'}</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Numéro</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Stagiaire</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Référence</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Généré par</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Date</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pageActuelle.map((att) => (
                    <tr key={att.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-blue-600">{att.numero}</td>
                      <td className="px-6 py-4 text-gray-800">{att.stagiaire?.nom_complet}</td>
                      <td className="px-6 py-4 text-gray-600">{att.stagiaire?.reference}</td>
                      <td className="px-6 py-4 text-gray-600">{att.genere_par?.nom}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(att.date_generation).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate('/attestation', {
                            state: { stagiaire: att.stagiaire }
                          })}
                          className="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                        >
                          🖨️ Réimprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-500">
                  Page {page} sur {totalPages} — {filtrees.length} résultats
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
                  >
                    «
                  </button>
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .map((p, idx, arr) => (
                      <>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span key={`ellipsis-${p}`} className="px-3 py-1.5 text-sm text-gray-400">...</span>
                        )}
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`px-3 py-1.5 text-sm border rounded-lg transition ${
                            page === p
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </button>
                      </>
                    ))}
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
                  >
                    ›
                  </button>
                  <button
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Historique;