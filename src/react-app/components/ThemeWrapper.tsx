// ThemeWrapper.tsx
import React, { useContext, useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';

type Mode = 'light' | 'system' | 'dark';

const ModeContext = React.createContext<Mode>('system');

export const useTheme = () => useContext(ModeContext);

let globalSetMode: (m: Mode) => void = () => { };
export function changeLightDarkMode(next: Mode) {
    globalSetMode(next);
}

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    /* 1. 存用户原始选择（要落库） */
    const [userMode, setUserMode] = useState<Mode>('system');
    /* 2. 存当前生效值（给 UI 用） */
    const [activeMode, setActiveMode] = useState<Mode>('light');

    globalSetMode = setUserMode;

    /* 初始化：读库 → 写 userMode */
    useEffect(() => {
        const stored = (localStorage.getItem('antd-theme') as Mode) || 'system';
        setUserMode(stored);
    }, []);

    /* 根据 userMode 算出真正生效值，并监听系统变化 */
    useEffect(() => {
        let computed: Mode;
        if (userMode === 'system') {
            computed = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = () => setActiveMode(mq.matches ? 'dark' : 'light');
            handler();
            mq.addEventListener('change', handler);
            return () => mq.removeEventListener('change', handler);
        } else {
            computed = userMode;
        }
        setActiveMode(computed);
    }, [userMode]);

    /* 持久化：只存用户原始选择 */
    useEffect(() => {
        localStorage.setItem('antd-theme', userMode);
    }, [userMode]);

    const dark = activeMode === 'dark';
    return (
        <ModeContext.Provider value={activeMode}>
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