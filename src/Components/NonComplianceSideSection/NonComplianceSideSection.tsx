import { useState } from 'react';
import './NonComplianceSideSection.css';
import { useTranslation } from "react-i18next";


// Simuler une fonction de traduction (qui serait fournie par une librairie réelle dans une application complète)
 const { t } = useTranslation();


const NonComplianceSideSection = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleNonComplianceSideSection = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`NonComplianceSideSection-section ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className='toggle-button' onClick={toggleNonComplianceSideSection}>
        {isExpanded ? '<' : '>'}
      </button>
      {isExpanded && (
        <div className='content'>
          <table>
            <thead>
              <tr>
                <th>Non-conformité</th>
                {/* Ajoutez d'autres en-têtes de colonnes ici au besoin */}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 58 }, (_, index) => (
                <tr key={`noncompliance-${index + 1}`}>
                    <td>{t(`nonCompliance${index + 1}`)}</td>                  {/* Ajoutez d'autres cellules ici au besoin */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NonComplianceSideSection;