import { JSX, useState } from "react";
import UserDashBoard from "../../../components/UserDashBoard";
import Table, { ColumnsType } from "antd/es/table";
import { Button, Collapse, Input, Space, Tag, theme } from "antd";
import { PlusOutlined } from "@ant-design/icons";

type TagsSettingTypeOfRows = {
    expanded: boolean,
    inputing: boolean,
    inputVal: string,
    deletingAlias: string | null;
};
type TagsSettingType = {
    state: TagsSettingTypeOfRows,
    key: string,
    origin: string,
    cn: string,
    candidates: Array<string>,
};

const creatInitialRowState = (): TagsSettingTypeOfRows => ({
    expanded: false,
    inputing: false,
    inputVal: "",
    deletingAlias: null,
});
const mock: Array<TagsSettingType> = [
    {
        state: creatInitialRowState(),
        key: `${Math.random()}-${Math.random()}`,
        origin: '文章ID',
        cn: '文章标题',
        candidates: ['文学','杂谈'],
    },
];

export default function TagsSetting(): JSX.Element {
    const antdToken = theme.useToken().token;
    type TagsDataType = {
        list: TagsSettingType[],
        map: Map<TagsSettingType["key"], TagsSettingType>
    };
    const [data, setData] = useState<TagsDataType>({
        list: mock, map: new Map(mock.map((r) => [r.key, r]))
    });
    type TagsSettingPatchType = {
        state?: Partial<TagsSettingTypeOfRows>,
        key?: string,
        origin?: string,
        cn?: string,
        candidates?: Array<string>,
    }
    const updateTagsDataByKey = function (
        prev: TagsDataType,
        key: TagsSettingType["key"],
        patch: TagsSettingPatchType
    ): TagsDataType | undefined {
        const isNavigationItemEqual = (a: TagsSettingType, b: TagsSettingType): boolean => {
            const topLevelKeys = Object.keys(a).filter(key => key !== 'state');
            for (const key of topLevelKeys) {
                if (!Object.is(a[key as keyof TagsSettingType], b[key as keyof TagsSettingType])) {
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
    const ensureExpanded = (key: TagsSettingType["key"]) => {
        setData((prev) =>
            updateTagsDataByKey(prev, key, { state: { expanded: true } }) ?? prev
        );
    };
    const handleCollapseChange = (key: string) => {
        setData((prev) => {
            const item = prev.map.get(key);
            if (!item) {
                console.error(`function handleCollapseChange 未找到数据中索引为 ${key} 的数据，跳过`);
                return prev;
            }
            const working = item.state.inputing;
            return updateTagsDataByKey(prev, key, {
                state: { expanded: working ? true : !item.state.expanded },
            }) ?? prev;
        });
    };

    const columns: ColumnsType<TagsSettingType> = [
        { title: '序号', render: (_, __, i) => i + 1, width: 60, align: 'center' },
        { title: '文章ID', dataIndex: 'origin', align: 'center' },
        { title: '标题', dataIndex: 'cn', align: 'center' },
        {//标签
            title: '标签',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Collapse
                        ghost
                        size="small"
                        activeKey={record.state.expanded ? [record.key] : []}
                    >
                        <Collapse.Panel header={`${record.candidates.length} 个标签`} key={record.key} data-panel-key={record.key}>
                            <Space direction="vertical">
                                {/* 已存在的标签 */}
                                {record.candidates.map((c) => (
                                    <Space key={c} size={4}>
                                        <Tag
                                            closable
                                            onClose={(e) => {
                                                e.preventDefault(); // ① 阻止 AntD 默认移除
                                                setData((prev) =>
                                                    updateTagsDataByKey(prev, record.key, {
                                                        state: { deletingAlias: c },
                                                    }) ?? prev
                                                );
                                            }}
                                        >
                                            {c}
                                        </Tag>
                                        {/* 正在删除这条别名时，出现确认/取消按钮 */}
                                        {record.state.deletingAlias === c && (
                                            <Space size={4}>
                                                <Button
                                                    size="small"
                                                    type="primary"
                                                    style={{
                                                        backgroundColor: antdToken.colorError,
                                                    }}
                                                    onClick={() =>
                                                        setData((prev) =>
                                                            updateTagsDataByKey(prev, record.key, {
                                                                candidates: record.candidates.filter((a) => a !== c),
                                                                state: { deletingAlias: null },
                                                            }) ?? prev
                                                        )
                                                    }
                                                >
                                                    删除
                                                </Button>
                                                <Button
                                                    size="small"
                                                    onClick={() =>
                                                        setData((prev) =>
                                                            updateTagsDataByKey(prev, record.key, {
                                                                state: { deletingAlias: null },
                                                            }) ?? prev
                                                        )
                                                    }
                                                >
                                                    取消
                                                </Button>
                                            </Space>
                                        )}
                                    </Space>
                                ))}
                                {/* 如果正在给这行加标签，出现输入框 */}
                                {record.state.inputing === true && (
                                    <Space>
                                        <Input
                                            size="small"
                                            value={record.state.inputVal}
                                            onChange={(e) => setData((prev) =>
                                                updateTagsDataByKey(prev, record.key, {
                                                    state: {
                                                        inputing: true,
                                                        inputVal: e.target.value,
                                                    }
                                                }) ?? prev
                                            )}
                                            onPressEnter={() => {
                                                if (!record.state.inputVal.trim()) return;
                                                setData((prev) =>
                                                    updateTagsDataByKey(prev, record.key, {
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
                                                    updateTagsDataByKey(prev, record.key, {
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
                                                updateTagsDataByKey(prev, record.key, {
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
                </Space >
            ),
        },
        {//控件
            title: '操作',
            align: 'center',
            width: 160,
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            ensureExpanded(record.key);
                            setData((prev) =>
                                updateTagsDataByKey(prev, record.key, {
                                    state: {
                                        inputing: true,
                                        inputVal: "",
                                    }
                                }) ?? prev
                            );//开启输入，清空输入
                        }}
                    />
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