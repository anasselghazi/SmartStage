import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">OGAS</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Bonjour, <span className="font-medium">{user?.nom}</span>
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            isAdmin()
              ? 'bg-purple-100 text-purple-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {isAdmin() ? 'Administrateur' : 'Gestionnaire RH'}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Tableau de bord</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Carte Recherche */}
          <Link to="/recherche"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition border border-gray-100 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg text-2xl">🔍</div>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
                  Rechercher un stagiaire
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Recherche par CIN ou Référence
                </p>
              </div>
            </div>
          </Link>

          {/* Carte Historique — accessible à tous */}
         {/* Carte Historique — accessible à tous */}
<Link to="/historique"
  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition border border-gray-100 group"
>
  <div className="flex items-center gap-4">
    <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg text-2xl">📋</div>
    <div>
      <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition">
        Historique des attestations
      </h3>
      <p className="text-sm text-gray-500 mt-1">
        Consulter les attestations générées
      </p>
    </div>
  </div>
</Link>
          {/* Carte Admin Comptes — admin uniquement */}
          {isAdmin() && (
            <Link to="/admin/comptes"
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition border border-gray-100 group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 text-purple-600 p-3 rounded-lg text-2xl">👥</div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition">
                    Gestion des comptes RH
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Approuver ou bloquer les comptes
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Carte Import Excel — admin uniquement */}
          {isAdmin() && (
            <Link to="/admin/import"
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition border border-gray-100 group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-100 text-green-600 p-3 rounded-lg text-2xl">📊</div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition">
                    Importer Excel
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Importer la liste des stagiaires
                  </p>
                </div>
              </div>
            </Link>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;