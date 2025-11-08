import { Button, Input, Space, Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import { JSX, ReactNode, useState } from "react";
import UserDashBoard from "../../../components/UserDashBoard";
import Link from "antd/es/typography/Link";
import Title from "antd/es/typography/Title";

type NavigationItem = {
    key: string;
    title: string;
    link: string;
    src: string;
    children?: NavigationItem[];
};

const uid = () => `${Math.random()}-${Math.random()}`;

const mock: NavigationItem[] = [
    {
        title: "首页",
        key: uid(),
        link: "/home",
        src: "/",
        children: [{ title: "子页A", key: uid(), link: "/a", src: "/sub-a" }]
    },
    { title: "关于", key: uid(), link: "/about", src: "/about" }
];

const remove = (key: string, list: NavigationItem[]): NavigationItem[] =>
    list.reduce<NavigationItem[]>((acc, item) => {
        if (item.key === key) return acc;
        if (item.children) item = { ...item, children: remove(key, item.children) };
        acc.push(item);
        return acc;
    }, []);

export default function NavigationSettings(): JSX.Element {
    const [treeData, setTreeData] = useState<NavigationItem[]>(mock);
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [src, setSrc] = useState("");

    const onDrop = (info: any) => {
        const dropKey = info.node.key;               // 放下目标节点key
        const dragKey = info.dragNode.key;           // 被拖拽节点key
        const dropToGap = info.dropToGap;            // 是否插入到间隙（兄弟节点）

        // 深拷贝数据
        const newData: NavigationItem[] = JSON.parse(JSON.stringify(treeData));

        // 查找并移除被拖拽节点
        let dragItem: NavigationItem | undefined;
        const removeDrag = (list: NavigationItem[]): NavigationItem[] =>
            list.reduce<NavigationItem[]>((acc, item) => {
                if (item.key === dragKey) {
                    dragItem = item;
                    return acc;
                }
                if (item.children) item.children = removeDrag(item.children);
                acc.push(item);
                return acc;
            }, []);

        const afterRemove = removeDrag(newData);
        if (!dragItem) return; // 未找到拖拽节点则退出

        // 递归查找目标节点并插入
        const findAndInsert = (list: NavigationItem[]): NavigationItem[] => {
            const newList = [...list];
            for (let i = 0; i < newList.length; i++) {
                const item = newList[i];
                // 找到目标节点
                if (item.key === dropKey) {
                    if (dropToGap) {
                        // 插入到兄弟节点位置（目标节点前后）
                        const insertPos = info.dropPosition < 0 ? i : i + 1;
                        newList.splice(insertPos, 0, dragItem!);
                    } else {
                        // 插入到目标节点的子节点中
                        if (!item.children) {
                            item.children = [];
                        }
                        item.children.push(dragItem!);
                    }
                    return newList; // 完成插入后返回
                }

                // 递归处理子节点
                if (item.children) {
                    item.children = findAndInsert(item.children);
                }
            }
            return newList;
        };

        // 执行插入并更新数据
        const result = findAndInsert(afterRemove);
        setTreeData(result);
    };

    const toTreeNode = (list: NavigationItem[]): DataNode[] =>
        list.map(({ title: t, key, children }) => ({
            title: t,
            key,
            children: children?.length ? toTreeNode(children) : undefined
        }));

    const addTopLevel = () => {
        if (!title || !link || !src) return;
        const newItem: NavigationItem = { title, key: uid(), link, src };
        setTreeData((prev) => [newItem, ...prev]);
        setTitle("");
        setLink("");
        setSrc("");
    };

    const titleRender = (node: DataNode): ReactNode => {
        const find = (list: NavigationItem[]): NavigationItem | undefined => {
            for (const item of list) {
                if (item.key === node.key) return item;
                if (item.children) {
                    const target = find(item.children);
                    if (target) return target;
                }
            }
            return undefined;
        };
        const item = find(treeData);
        if (!item) return <span>{String(node.title)}</span>;

        return (
            <Space align="center">
                <Title level={4} style={{ margin: 0 }}>{item.title}</Title>
                访问链接丨<Link href={item.link} target="_blank">{item.link}</Link>
                文件链接丨<Link href={item.src} target="_blank">{item.src}</Link>
                <Button
                    size="small"
                    danger
                    onClick={(e) => {
                        e.stopPropagation();
                        setTreeData(remove(item.key, treeData));
                    }}
                >
                    删除
                </Button>
            </Space>
        );
    };

    return (
        <UserDashBoard>
            <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
                <Space>
                    <Input placeholder="名称" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <Input placeholder="访问地址" value={link} onChange={(e) => setLink(e.target.value)} />
                    <Input placeholder="文件地址" value={src} onChange={(e) => setSrc(e.target.value)} />
                    <Button type="primary" onClick={addTopLevel}>新增</Button>
                </Space>
            </Space>

            <Tree
                treeData={toTreeNode(treeData)}
                draggable
                onDrop={onDrop}
                showLine
                defaultExpandAll
                blockNode
                titleRender={titleRender}
            />
        </UserDashBoard>
    );
}