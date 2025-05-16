'use client';

import { LoaderView } from '@/components/loader-view';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { YadioConverter } from 'yadio-sdk';

const YadioContext = createContext<YadioConverter | null>(null);

export function YadioProvider({ children }: { children: React.ReactNode }) {
    const [converter, setConverter] = useState<YadioConverter | null>(null);

    useEffect(() => {
        const instance = new YadioConverter('USD');
        setConverter(instance);
    }, []);

    return (
        <YadioContext.Provider value={converter}>
            {children}
        </YadioContext.Provider>
    );
}

export const useYadio = () => {
    const ctx = useContext(YadioContext);
    if (!ctx) throw new Error('useYadio must be used within a YadioProvider');
    return ctx;
}