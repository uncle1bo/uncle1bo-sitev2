import React from 'react';
import { Link } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space, Layout } from 'antd';
import {
    SunOutlined,
    MoonOutlined,
    LaptopOutlined,
    DownOutlined,
} from '@ant-design/icons';
import { changeLightDarkMode, useTheme } from './ThemeWrapper';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';

const themeIconMap = {
    light: <SunOutlined />,
    dark: <MoonOutlined />,
    system: <LaptopOutlined />,
};

export default function Template({ children }: { children: React.ReactNode }) {
    const currentTheme = useTheme();
    
    const themeMenu: MenuProps = {
        items: [
            { key: 'light', icon: <SunOutlined />, label: '亮色', onClick: () => changeLightDarkMode('light') },
            { key: 'dark', icon: <MoonOutlined />, label: '暗色', onClick: () => changeLightDarkMode('dark') },
            { key: 'system', icon: <LaptopOutlined />, label: '系统', onClick: () => changeLightDarkMode('system') },
        ],
    };

    /* 使用 ConfigProvider + token 让颜色完全跟随 Ant Design 主题 */
    return (
            <Layout style={{ minHeight: '100vh' }}>
                {/* 顶栏 */}
                <Header
                    style={{
                        padding: '0 16px',
                        /* 用 token 代替手写色值 */
                        background: 'var(--ant-color-bg-header)', // 暗/亮自动切换
                        color: 'var(--ant-color-text)',
                    }}
                >
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                            <Title
                                style={{
                                    color: 'var(--ant-color-primary)',
                                    margin: 0,
                                }}
                            >
                                Uncle1Bo
                            </Title>
                        </Link>

                        <Dropdown menu={themeMenu} trigger={['click']}>
                            <Button
                                type="text"
                                icon={themeIconMap[currentTheme]}
                                style={{ color: 'var(--ant-color-text)' }}
                            >
                                <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
                            </Button>
                        </Dropdown>
                    </Space>
                </Header>

                <Content style={{ padding: 16 }}>{children}</Content>

                <Footer style={{ textAlign: 'center', color: 'var(--ant-color-text-secondary)' }}>
                    ©Uncle1Bo
                </Footer>
            </Layout>
    );
}