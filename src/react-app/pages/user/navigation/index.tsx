import { Tree } from "antd";
import { JSX } from "react";
import UserDashBoard from "../../../components/UserDashBoard";

type NavigationItem = {
    title: string;
    key: string;   // 唯一标识
    link: string;
    src: string;
    children?: NavigationItem[];
};

// 生成唯一 key 的便捷函数
const uid = () => `${Date.now()}-${Math.random()}`;

const mock: NavigationItem[] = [
    {
        title: "首页",
        key: uid(),
        link: "/home",
        src: "/pages/home.tsx",
        children: [
            { title: "子页A", key: uid(), link: "/home/sub-a", src: "/pages/sub-a.tsx" }
        ]
    },
    { title: "关于", key: uid(), link: "/about", src: "/pages/about.tsx" }
];

export default function NavigationSettings(): JSX.Element {
    return (
        <UserDashBoard>
            <Tree
                treeData={mock}
            />
        </UserDashBoard>
    );
}