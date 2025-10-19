// ThemeWrapper.tsx
import React, { useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';

type Mode = 'light' | 'system' | 'dark';

let globalSetMode: (mode: Mode) => void = () => { };

export function changeLightDarkMode(next: Mode) {
    globalSetMode(next);
}

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<Mode>('system');
    globalSetMode = setMode;

    useEffect(() => {
        const stored = localStorage.getItem('antd-theme') as Mode | null;
        const initial = stored || 'system';
        setMode(initial);
    }, []);

    useEffect(() => {
        if (mode === 'system') {
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            const sync = () => setMode(mq.matches ? 'dark' : 'light');
            sync();
            mq.addEventListener('change', sync);
            return () => mq.removeEventListener('change', sync);
        }
    }, [mode]);

    useEffect(() => {
        localStorage.setItem('antd-theme', mode);
    }, [mode]);

    const dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <ConfigProvider theme={{ algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
            {children}
        </ConfigProvider>
    );
}