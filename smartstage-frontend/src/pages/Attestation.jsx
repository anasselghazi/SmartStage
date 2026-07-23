import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Attestation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stagiaire = location.state?.stagiaire;

  useEffect(() => {
    if (!stagiaire) {
      navigate('/recherche');
    }
  }, [stagiaire]);

  if (!stagiaire) return null;

  const handlePrint = () => window.print();

  return (
    <>
      {/* Boutons (masqués à l'impression) */}
      <div className="no-print flex gap-3 p-4 bg-gray-50 border-b">
        <button
          onClick={() => navigate('/recherche')}
          className="text-sm text-gray-500 hover:text-blue-600"
        >
          ← Retour
        </button>
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition"
        >
          🖨️ Imprimer
        </button>
      </div>

      {/* Attestation A4 */}
      <div className="attestation-wrapper">
        <div className="attestation-page">

          {/* En-tête */}
          <div className="header">
            <div className="header-left">
              <p className="company-name">OGAS</p>
              <p className="company-subtitle">OCP Gestion Attestations Stage</p>
            </div>
            <div className="header-right">
              <p>Réf : {stagiaire.reference}</p>
              <p>Date : {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          {/* Titre */}
          <div className="title-section">
            <h1 className="title">ATTESTATION DE STAGE</h1>
            <div className="title-underline"></div>
          </div>

          {/* Corps */}
          <div className="body-text">
            <p>
              Nous soussignés, attestons par la présente que :
            </p>

            <div className="stagiaire-info">
              <p>
                <span className="label">Nom et Prénom :</span>
                <span className="value">{stagiaire.civilite} {stagiaire.nom_complet}</span>
              </p>
              {stagiaire.cin && (
                <p>
                  <span className="label">CIN :</span>
                  <span className="value">{stagiaire.cin}</span>
                </p>
              )}
              <p>
                <span className="label">École / Établissement :</span>
                <span className="value">{stagiaire.ecole ?? '—'}</span>
              </p>
              <p>
                <span className="label">Spécialité :</span>
                <span className="value">{stagiaire.specialite ?? '—'}</span>
              </p>
              <p>
                <span className="label">Niveau d'études :</span>
                <span className="value">{stagiaire.niveau_etude ?? '—'}</span>
              </p>
            </div>

            <p className="paragraph">
              A effectué un stage au sein de notre établissement, au département{' '}
              <strong>{stagiaire.service ?? '—'}</strong>, entité{' '}
              <strong>{stagiaire.entite ?? '—'}</strong>, du{' '}
              <strong>{new Date(stagiaire.date_debut).toLocaleDateString('fr-FR')}</strong> au{' '}
              <strong>{new Date(stagiaire.date_fin).toLocaleDateString('fr-FR')}</strong>.
            </p>

            <p className="paragraph">
              Cette attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.
            </p>
          </div>

          {/* Signature */}
          <div className="signature-section">
            <div className="signature-box">
              <p className="signature-title">Le Responsable RH</p>
              <div className="signature-space"></div>
              <p className="signature-name">Signature et cachet</p>
            </div>
          </div>

        </div>
      </div>

      {/* Styles impression */}
      <style>{`
        .attestation-wrapper {
          display: flex;
          justify-content: center;
          padding: 20px;
          background: #f3f4f6;
          min-height: 100vh;
        }

        .attestation-page {
          background: white;
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          font-family: 'Times New Roman', serif;
          font-size: 13pt;
          color: #1a1a1a;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #1d4ed8;
          padding-bottom: 15px;
          margin-bottom: 30px;
        }

        .company-name {
          font-size: 20pt;
          font-weight: bold;
          color: #1d4ed8;
        }

        .company-subtitle {
          font-size: 9pt;
          color: #6b7280;
          margin-top: 4px;
        }

        .header-right {
          text-align: right;
          font-size: 10pt;
          color: #4b5563;
          line-height: 1.6;
        }

        .title-section {
          text-align: center;
          margin: 30px 0;
        }

        .title {
          font-size: 20pt;
          font-weight: bold;
          letter-spacing: 3px;
          color: #1a1a1a;
        }

        .title-underline {
          width: 80px;
          height: 3px;
          background: #1d4ed8;
          margin: 10px auto 0;
        }

        .body-text {
          line-height: 1.8;
          margin-top: 30px;
        }

        .stagiaire-info {
          background: #f8fafc;
          border-left: 4px solid #1d4ed8;
          padding: 15px 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }

        .stagiaire-info p {
          margin: 6px 0;
        }

        .label {
          font-weight: bold;
          display: inline-block;
          width: 180px;
          color: #374151;
        }

        .value {
          color: #1a1a1a;
        }

        .paragraph {
          margin: 16px 0;
          text-align: justify;
        }

        .signature-section {
          margin-top: 60px;
          display: flex;
          justify-content: flex-end;
        }

        .signature-box {
          text-align: center;
          width: 200px;
        }

        .signature-title {
          font-weight: bold;
          margin-bottom: 10px;
        }

        .signature-space {
          height: 70px;
          border-bottom: 1px solid #9ca3af;
          margin-bottom: 8px;
        }

        .signature-name {
          font-size: 10pt;
          color: #6b7280;
        }

        @media print {
          .no-print {
            display: none !important;
          }

          body {
            margin: 0;
            padding: 0;
          }

          .attestation-wrapper {
            background: white;
            padding: 0;
          }

          .attestation-page {
            box-shadow: none;
            width: 100%;
            min-height: 100vh;
            padding: 15mm;
          }
        }
      `}</style>
    </>
  );
};

export default Attestation;
