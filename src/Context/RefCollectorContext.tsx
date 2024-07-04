import { createContext } from 'react';

interface RefCollectorContextType {
    collectRefForm: (ref: HTMLDivElement) => void;
    collectRefScrollBarSection: (ref: HTMLDivElement) => void;
    setLastModifiedDiv: (div: HTMLDivElement) => void;
}

const RefCollectorContext = createContext<RefCollectorContextType>({
    collectRefForm: (ref) => {},
    collectRefScrollBarSection: (ref) => {},
    setLastModifiedDiv: (div) => {}
});

export default RefCollectorContext;