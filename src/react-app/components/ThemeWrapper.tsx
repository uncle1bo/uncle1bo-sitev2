// ThemeWrapper.tsx
import React, { useContext, useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';

type Mode = 'light' | 'system' | 'dark';

const ModeContext = React.createContext<Mode>('system');
export function useTheme() {
    return useContext(ModeContext);
}

let globalSetMode: (mode: Mode) => void = () => { };

export function changeLightDarkMode(next: Mode) {
    globalSetMode(next);
}

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<Mode>(() => {
        // ✅ 惰性初始化，避免首次渲染为 'system'
        const stored = localStorage.getItem('antd-theme') as Mode | null;
        return stored || 'system';
    });

    globalSetMode = setMode;

    useEffect(() => {
        localStorage.setItem('antd-theme', mode);
    }, [mode]);

    const dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <ModeContext.Provider value={mode}>
            <ConfigProvider
                theme={{
                    token: { colorPrimary: '#1677ff' },
                    algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    cssVar: true,
                }}
            >
                {children}
            </ConfigProvider>
        </ModeContext.Provider>
    );
}