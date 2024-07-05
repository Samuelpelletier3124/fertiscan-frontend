import { createContext } from 'react';

interface RefCollectorContextType {
    collectRefForm: (ref: HTMLDivElement) => void;
    collectRefScrollBarSection: (ref: HTMLDivElement) => void;
    updateLastModifiedDiv: (ref: HTMLDivElement) => void;
    updateProgressBarFocus: (ref: HTMLDivElement) => void;
}

const RefCollectorContext = createContext<RefCollectorContextType>({
    collectRefForm: (ref) => {},
    collectRefScrollBarSection: (ref) => {},
    updateLastModifiedDiv: (ref) => {},
    updateProgressBarFocus: (ref) => {}
});

export default RefCollectorContext;