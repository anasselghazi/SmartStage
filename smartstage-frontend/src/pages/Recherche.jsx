import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Recherche = () => {
  const [cle, setCle]           = useState('');
  const [stagiaire, setStagiaire] = useState(null);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setStagiaire(null);
    setLoading(true);

    try {
      const response = await api.get('/stagiaires/rechercher', {
        params: { cle },
      });
      setStagiaire(response.data.stagiaire);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Aucun stagiaire trouvé pour cette recherche.');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImprimer = () => {
    navigate('/attestation', { state: { stagiaire } });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">SmartStage</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-500 hover:text-blue-600"
        >
          ← Retour
        </button>
      </nav>

      <div className="max-w-2xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Rechercher un stagiaire</h2>
        <p className="text-gray-500 text-sm mb-8">Entrez le CIN ou la Référence du stagiaire</p>

        {/* Formulaire de recherche */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            value={cle}
            onChange={(e) => setCle(e.target.value)}
            required
            placeholder="CIN ou Référence..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {loading ? '...' : 'Rechercher'}
          </button>
        </form>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Résultat */}
        {stagiaire && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">
              Informations du stagiaire
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Référence</p>
                <p className="font-medium">{stagiaire.reference}</p>
              </div>
              <div>
                <p className="text-gray-500">CIN</p>
                <p className="font-medium">{stagiaire.cin ?? '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Nom complet</p>
                <p className="font-medium">{stagiaire.nom_complet}</p>
              </div>
              <div>
                <p className="text-gray-500">Civilité</p>
                <p className="font-medium">{stagiaire.civilite ?? '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Date début</p>
                <p className="font-medium">{stagiaire.date_debut}</p>
              </div>
              <div>
                <p className="text-gray-500">Date fin</p>
                <p className="font-medium">{stagiaire.date_fin}</p>
              </div>
              <div>
                <p className="text-gray-500">Service</p>
                <p className="font-medium">{stagiaire.service ?? '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Entité</p>
                <p className="font-medium">{stagiaire.entite ?? '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Ecole</p>
                <p className="font-medium">{stagiaire.ecole ?? '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Spécialité</p>
                <p className="font-medium">{stagiaire.specialite ?? '—'}</p>
              </div>
            </div>

            {/* Bouton Imprimer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleImprimer}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg transition"
              >
                📄 Générer l'attestation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recherche;