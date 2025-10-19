// src/components/Template.tsx
import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import routes from '~react-pages';
import ThemeWrapper, { changeLightDarkMode } from './ThemeWrapper';
import Layout, { Content, Footer, Header } from 'antd/es/layout/layout';
import { Button, Dropdown, MenuProps, Space, Typography } from 'antd';
import { SunOutlined, MoonOutlined, LaptopOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function Template({ children }: { children: React.ReactNode }): JSX.Element {
    /* 拍平路由 */
    const navItems = routes.flatMap((r) =>
        r.path && !r.path.includes(':') && r.path !== '*'
            ? [{ path: r.path, title: r.meta?.title || r.name || r.path }]
            : [],
    );

    /* 主题下拉菜单 */
    const themeMenu: MenuProps = {
        items: [
            {
                key: 'light',
                icon: <SunOutlined />,
                label: '亮色',
                onClick: () => changeLightDarkMode('light'),
            },
            {
                key: 'dark',
                icon: <MoonOutlined />,
                label: '暗色',
                onClick: () => changeLightDarkMode('dark'),
            },
            {
                key: 'system',
                icon: <LaptopOutlined />,
                label: '系统',
                onClick: () => changeLightDarkMode('system'),
            },
        ],
    };

    return (
        <ThemeWrapper>
            <Layout style={{ minHeight: '100vh' }}>
                <Header style={{ padding: '0 16px', color: '#fff' }}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Text style={{ color: 'var(--antd-wave-shadow-color)', fontSize: 18, fontWeight: 600 }}>
                            Uncle1Bo
                        </Text>
                        <Space>
                            {navItems.map((nav) => (
                                <Link key={nav.path} to={nav.path} style={{ color: '#fff' }}>
                                    {nav.title}
                                </Link>
                            ))}
                        </Space>
                        <Dropdown menu={themeMenu} trigger={['click']}>
                            <Button type="text" icon={<MoonOutlined />} style={{ color: '#fff' }} />
                        </Dropdown>
                    </Space>
                </Header>
                <Content style={{ padding: 16 }}>{children}</Content>
                <Footer style={{ textAlign: 'center' }}>©Uncle1Bo</Footer>
            </Layout>
        </ThemeWrapper>
    );
}