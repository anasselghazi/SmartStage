import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ImportExcel = () => {
  const [fichier, setFichier]   = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [resultat, setResultat] = useState(null);
  const [error, setError]       = useState('');
  const inputRef                = useRef();
  const navigate                = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validerFichier(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) validerFichier(file);
  };

  const validerFichier = (file) => {
    const allowed = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                     'application/vnd.ms-excel',
                     'text/csv'];
    if (!allowed.includes(file.type)) {
      setError('Format invalide. Accepté : .xlsx, .xls, .csv');
      setFichier(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Fichier trop volumineux. Maximum : 10MB');
      setFichier(null);
      return;
    }
    setError('');
    setFichier(file);
    setResultat(null);
  };

  const handleImport = async () => {
    if (!fichier) return;

    setLoading(true);
    setError('');
    setResultat(null);

    const formData = new FormData();
    formData.append('fichier', fichier);

    try {
      const res = await api.post('/admin/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResultat(res.data);
      setFichier(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'importation.');
    } finally {
      setLoading(false);
    }
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Importer un fichier Excel</h2>
        <p className="text-gray-500 text-sm mb-8">
          Formats acceptés : .xlsx, .xls, .csv — Maximum 10MB
        </p>

        {/* Zone Drag & Drop */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => inputRef.current.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : fichier
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv,.xlsm"
            onChange={handleFileChange}
            className="hidden"
          />

          {fichier ? (
            <>
              <div className="text-4xl mb-3">📊</div>
              <p className="font-semibold text-green-700">{fichier.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {(fichier.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-xs text-gray-400 mt-2">Cliquer pour changer</p>
            </>
          ) : (
            <>
              <div className="text-4xl mb-3">📁</div>
              <p className="font-semibold text-gray-700">
                Glisser-déposer votre fichier ici
              </p>
              <p className="text-sm text-gray-400 mt-1">ou cliquer pour sélectionner</p>
            </>
          )}
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mt-4">
            {error}
          </div>
        )}

        {/* Bouton Import */}
        {fichier && (
          <button
            onClick={handleImport}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Importation en cours...' : '📤 Lancer l\'importation'}
          </button>
        )}

        {/* Résultat */}
        {resultat && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">
              {resultat.message}
            </h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{resultat.inseres}</p>
                <p className="text-sm text-gray-500 mt-1">Insérés</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{resultat.mis_a_jour}</p>
                <p className="text-sm text-gray-500 mt-1">Mis à jour</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{resultat.erreurs.length}</p>
                <p className="text-sm text-gray-500 mt-1">Erreurs</p>
              </div>
            </div>

            {/* Détail erreurs */}
            {resultat.erreurs.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-600 mb-2 text-sm">
                  Détail des erreurs :
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {resultat.erreurs.map((err, i) => (
                    <div key={i} className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm">
                      <span className="font-medium text-red-700">Ligne {err.ligne} :</span>
                      <span className="text-red-600 ml-2">{err.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportExcel;