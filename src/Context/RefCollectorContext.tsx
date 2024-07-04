import { createContext } from 'react';

interface RefCollectorContextType {
    collectRefForm: (ref: HTMLDivElement) => void;
    collectRefScrollBarSection: (ref: HTMLDivElement) => void;
    updateLastModifiedDiv: (ref: HTMLDivElement) => void;
}

const RefCollectorContext = createContext<RefCollectorContextType>({
    collectRefForm: (ref) => {},
    collectRefScrollBarSection: (ref) => {},
    updateLastModifiedDiv: (ref) => {}
});

export default RefCollectorContext;