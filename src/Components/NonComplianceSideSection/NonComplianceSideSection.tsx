import { useState } from 'react'; // Ajout de React import (requis pour React 16 avant la version 17)
import './NonComplianceSideSection.css';
import { useTranslation } from 'react-i18next';

const NonComplianceSideSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [checkedState, setCheckedState] = useState(new Array(58).fill(false)); // État pour suivre les cases cochées
  const { t } = useTranslation();

  const toggleNonComplianceSideSection = () => {
    setIsExpanded(!isExpanded);
  };

  // Fonction pour gérer le changement des cases à cocher
const handleCheckboxChange = (position: number): void => {
    const updatedCheckedState: boolean[] = checkedState.map((item: boolean, index: number) =>
        index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
};

  return (
    <div className={`non-compliance-side-section ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="toggle-button-side-section" onClick={toggleNonComplianceSideSection}>
        {isExpanded ? '❯' : '❮'}
      </button>

      {isExpanded && (
        <div className="content">
          <table>
            <thead>
              <tr>
                <th>{t('points')}</th>
                <th>{t('select')}</th> {/* Localisez si nécessaire */}
              </tr>
            </thead>
            <tbody>
              {[...Array(58)].map((_, index) => (
                <tr key={index}>
                  <td>{t(`nonCompliance${index + 1}`)}</td>
                  <td>
                    <input
                      type="checkbox"
                      id={`custom-checkbox-${index}`}
                      name={`custom-checkbox-${index}`}
                      value={index}
                      checked={checkedState[index]}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NonComplianceSideSection 