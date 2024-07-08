import React, { useState } from 'react';
import './NonComplianceFormAccordion.css'; // Assurez-vous que le CSS contient les styles nécessaires
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface NonComplianceFormAccordionProps {
    title: string;
}

const NonComplianceFormAccordion: React.FC<NonComplianceFormAccordionProps> = ({ title }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const toggle = () => setIsOpen(!isOpen);

    const nonComplianceItems = Array.from({ length: 58 }, (_, index) => index + 1);

    const arrowIcon = isOpen ? faChevronUp : faChevronDown;

    return (
        <div className={`accordion ${isOpen ? "open" : ""}`}>
            <div className="accordion-header" onClick={toggle}>
                {title}
                <FontAwesomeIcon icon={arrowIcon} className="accordion-toggle-icon" />
            </div>
            {isOpen && (
                <div className="accordion-content">
                    <table>
                        <tbody>
                    
                        {nonComplianceItems.map((number) => (
                            <tr key={number}>
                                <td>{t(`nonCompliance${number}`)}</td>
                                <td><input type="checkbox" id={`nonCompliance${number}`} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default NonComplianceFormAccordion;