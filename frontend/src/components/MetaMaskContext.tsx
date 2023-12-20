import React, { createContext, useContext, useState, FC, ReactNode } from 'react';

interface MetaMaskContextType {
    account: string | null;
    setAccount: (account: string | null) => void;
}

const MetaMaskContext = createContext<MetaMaskContextType | undefined>(undefined);

interface MetaMaskProviderProps {
    children: ReactNode;
}

export const useMetaMask = () => {
    const context = useContext(MetaMaskContext);
    if (!context) {
        throw new Error("useMetaMask must be used within a MetaMaskProvider.");
    }
    return context;
};

export const MetaMaskProvider:FC<MetaMaskProviderProps> = ({children }) => {
    const [account, setAccount] = useState<string | null>(null);

    return (
        <MetaMaskContext.Provider value={{ account, setAccount }}>
            {children}
        </MetaMaskContext.Provider>

    );

}
