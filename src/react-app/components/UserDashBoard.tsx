import { Tabs } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const userDashBoardPanes = [//0号为默认跳转页
    { key: 'navigation', label: '导航栏设置' },
];

export default function UserDashBoard({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const activeKey = location.pathname.split('/').pop() || userDashBoardPanes[0].key;

    return (
        <>
            <Tabs
                tabPosition="left"
                activeKey={activeKey}
                onChange={(key) => navigate(`../${key}`, { relative: 'path', replace: true })}
                items={userDashBoardPanes.map((pane) => ({ key: pane.key, label: pane.label, children: children }))}
            >
            </Tabs>
        </>
    );
}