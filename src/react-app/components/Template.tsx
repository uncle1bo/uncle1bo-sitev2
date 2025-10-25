import React from 'react';
import { Link } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space, Layout, theme } from 'antd';
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
    const antdToken = theme.useToken().token;

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
                    display: 'flex',
                    alignItems: 'center',
                    padding: antdToken.paddingContentHorizontal,
                    background: antdToken.colorPrimaryBg,
                    color: antdToken.colorText,
                }}
            >
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                        <Title
                            style={{
                                color: antdToken.colorPrimary,
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
                            style={{ color: antdToken.colorText }}
                        >
                            <DownOutlined />
                        </Button>
                    </Dropdown>
                </Space>
            </Header>

            <Content style={{ padding: 16 }}>{children}</Content>

            <Footer style={{ textAlign: 'center', color: antdToken.colorTextSecondary }}>
                ©Uncle1Bo
            </Footer>
        </Layout>
    );
}