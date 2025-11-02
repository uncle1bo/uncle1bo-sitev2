import { JSX, useState } from "react";
import UserDashBoard from "../../../components/UserDashBoard";
import Table, { ColumnsType } from "antd/es/table";
import { Button, Collapse, Input, Space, Tag } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

type NavigationSettingTypeOfRows = {
    expanded: boolean,
    editing: boolean,
    inputing: boolean,
    delating: boolean,
    inputVal: string,
};
type NavigationSettingType = {
    state: NavigationSettingTypeOfRows,
    key: string,
    origin: string,
    cn: string,
    candidates: Array<string>,
};

const creatInitialRowState = (): NavigationSettingTypeOfRows => ({
    expanded: false,
    editing: false,
    inputing: false,
    delating: false,
    inputVal: "",
});
const mock: Array<NavigationSettingType> = [
    {
        state: creatInitialRowState(),
        key: `${Date.now()}-${Math.random()}`,
        origin: '/user/navigation',
        cn: '导航栏设置',
        candidates: ['/nav', '/navi', '/navigation'],
    },
];

export default function NavigationSetting(): JSX.Element {
    type NavigationDataType = {
        list: NavigationSettingType[],
        map: Map<NavigationSettingType["key"], NavigationSettingType>
    };
    const [data, setData] = useState<NavigationDataType>({
        list: mock, map: new Map(mock.map((r) => [r.key, r]))
    });
    type NavigationSettingPatchType = {
        state?: Partial<NavigationSettingTypeOfRows>,
        key?: string,
        origin?: string,
        cn?: string,
        candidates?: Array<string>,
    }
    const updateNavigationDataByKey = function (
        prev: NavigationDataType,
        key: NavigationSettingType["key"],
        patch: NavigationSettingPatchType
    ): NavigationDataType | undefined {
        const isNavigationItemEqual = (a: NavigationSettingType, b: NavigationSettingType): boolean => {
            const topLevelKeys = Object.keys(a).filter(key => key !== 'state');
            for (const key of topLevelKeys) {
                if (!Object.is(a[key as keyof NavigationSettingType], b[key as keyof NavigationSettingType])) {
                    return false;
                }
            }
            const stateKeys = Object.keys(a.state);
            for (const key of stateKeys) {
                if (!Object.is(a.state[key as keyof typeof a.state], b.state[key as keyof typeof a.state])) {
                    return false;
                }
            }
            return true;
        };
        const oldItem = prev.map.get(key);
        if (!oldItem) {
            console.error(`function updateByKey 未找到数据中索引为 ${key} 的数据，跳过`);
            return;
        }
        const updatedItem = {
            ...oldItem,
            ...patch,
            state: { ...oldItem.state, ...patch.state }
        };
        if (isNavigationItemEqual(oldItem, updatedItem)) {
            return prev;
        }
        const newMap = new Map(prev.map);
        newMap.set(key, updatedItem);
        return {
            list: [...newMap.values()],
            map: newMap
        };
    };
    const ensureExpanded = (key: NavigationSettingType["key"]) => {
        setData((prev) =>
            updateNavigationDataByKey(prev, key, { state: { expanded: true } }) ?? prev
        );
    };
    const handleCollapseChange = (key: string) => {
        setData((prev) => {
            const item = prev.map.get(key);
            if (!item) {
                console.error(`function handleCollapseChange 未找到数据中索引为 ${key} 的数据，跳过`);
                return prev;
            }
            const working = item.state.delating || item.state.editing || item.state.inputing;
            return updateNavigationDataByKey(prev, key, {
                state: { expanded: working ? true : !item.state.expanded },
            }) ?? prev;
        });
    };

    const columns: ColumnsType<NavigationSettingType> = [
        { title: '序号', render: (_, __, i) => i + 1, width: 60, align: 'center' },
        { title: '原始地址', dataIndex: 'origin', align: 'center' },
        { title: '中文名', dataIndex: 'cn', align: 'center' },
        {//备选地址
            title: '备选地址',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Collapse
                        ghost
                        size="small"
                        activeKey={record.state.expanded ? [record.key] : []}
                    >
                        <Collapse.Panel header={`${record.candidates.length} 个别名`} key={record.key} data-panel-key={record.key}>
                            <Space direction="vertical">
                                {/* 已存在的别名 */}
                                {record.candidates.map((c) => (
                                    <Tag key={c}>{c}</Tag>
                                ))}
                                {/* 如果正在给这行加别名，出现输入框 */}
                                {record.state.inputing === true && (
                                    <Space>
                                        <Input
                                            size="small"
                                            value={record.state.inputVal}
                                            onChange={(e) => setData((prev) =>
                                                updateNavigationDataByKey(prev, record.key, {
                                                    state: {
                                                        inputing: true,
                                                        inputVal: e.target.value,
                                                    }
                                                }) ?? prev
                                            )}
                                            onPressEnter={() => {
                                                if (!record.state.inputVal.trim()) return;
                                                setData((prev) =>
                                                    updateNavigationDataByKey(prev, record.key, {
                                                        candidates: [...record.candidates, record.state.inputVal.trim()],
                                                        state: {
                                                            inputing: false,
                                                        }
                                                    }) ?? prev
                                                );//传输数据，关闭输入框
                                            }}
                                        />
                                        <Button
                                            size="small"
                                            type="primary"
                                            onClick={() => {
                                                if (!record.state.inputVal.trim()) return;
                                                setData((prev) =>
                                                    updateNavigationDataByKey(prev, record.key, {
                                                        candidates: [...record.candidates, record.state.inputVal.trim()],
                                                        state: {
                                                            inputing: false,
                                                        }
                                                    }) ?? prev
                                                );//传输数据，关闭输入框
                                            }}
                                        >
                                            确定
                                        </Button>
                                        <Button size="small" onClick={() => {
                                            setData((prev) =>
                                                updateNavigationDataByKey(prev, record.key, {
                                                    state: {
                                                        inputing: false,
                                                    }
                                                }) ?? prev
                                            );//关闭输入框
                                        }}>取消</Button>
                                    </Space>
                                )}
                            </Space>
                        </Collapse.Panel>
                    </Collapse >
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => handleCollapseChange(record.key)}
                    >
                        {record.state.expanded ? '收起' : '展开'}
                    </Button>
                </Space>
            ),
        },
        {//控件
            title: '操作',
            align: 'center',
            width: 160,
            render: (_, record) => (
                <Space>
                    <Button size="small" type="text" icon={<EditOutlined />} />
                    <Button
                        size="small"
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            ensureExpanded(record.key);
                            setData((prev) =>
                                updateNavigationDataByKey(prev, record.key, {
                                    state: {
                                        inputing: true,
                                        inputVal: "",
                                    }
                                }) ?? prev
                            );//开启输入，清空输入
                        }}
                    />
                    <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    return (
        <UserDashBoard>
            <Table rowKey="key" columns={columns} dataSource={data.list} />
        </UserDashBoard>
    );
}