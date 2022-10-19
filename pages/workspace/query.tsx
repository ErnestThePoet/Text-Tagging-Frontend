import React, { useState, useEffect, Key } from "react";
import { observer } from "mobx-react-lite";
import * as L from "../../logics/workspace/query";
import { Table, Space, Layout, Button, Empty, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { checkIsLoggedIn } from "../../logics/router-checks";
import styles from "../../styles/workspace.module.scss";
import WorkspaceNav from "../../components/workspace/workspace-nav";
import QueryForm from "../../components/workspace/query/query-form";
import * as T from "../../modules/objects/text";
import taskData from "../../states/task-data";
import queryData from "../../states/query-data";

const { Content } = Layout;

function getTagItemDisplayStr(item: T.TagItem): string {
    const tagItemMeta = taskData.idMetaMap[item.id];
    switch (tagItemMeta.type) {
        case 0:
            if (item.value.length === 0) {
                return "未标注";
            }
            return tagItemMeta.choices!.find(
                x => x.internal === item.value[0])!.editorLabel!;
        case 1:
            if (item.value.length === 0) {
                return "未标注";
            }
            return item.value.map(
                x => tagItemMeta.choices!.find(
                    u => u.internal === x)!.editorLabel).join(",");
        case 2:
            return item.value[0].toString();
        case 3:
            return item.value.map(x => x.toString()).join(",");
        default:
            return "不支持标注项类型";
    }
}

const columns: ColumnsType<T.Text> = [
    {
        align: "center",
        title: "ID",
        dataIndex: "userId"
    },
    {
        align: "center",
        title: "文本内容",
        dataIndex: "text",
        width: "50%"
    },
    {
        align: "center",
        title: "标注",
        dataIndex: "tag",
        render: (x: T.Tag) => (
            x.id === null ?
                <Tag>无任何标注</Tag>
                :
                <Space direction="vertical" align="start">
                    <Tag color="orange">
                        <b>标注者:</b>
                        <span>{x.taggerName}</span>
                    </Tag>

                    <Tag color="green">
                        <b>标注时间:</b>
                        <span>{x.tagTime}</span>
                    </Tag>

                    <Tag color="blue">
                        <Space direction="vertical" align="start" size={0}>
                            {
                                x.tagItems.map((x, i) => (
                                    <Space key={i}>
                                        <b>{taskData.idMetaMap[x.id].editorTitle}:</b>
                                        <span>{getTagItemDisplayStr(x)}</span>
                                    </Space>
                                ))
                            }
                        </Space>
                    </Tag>
                </Space>
        )
    },
    {
        align: "center",
        title: "操作",
        render: x => (
            <Space>
                <Button type="link" onClick={() => { }}>
                    修改
                </Button>
            </Space>
        )
    },
];

const Query: React.FC = observer(() => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

    useEffect(() => {
        checkIsLoggedIn();
    }, []);

    return (
        <div className={styles.divMainWrapper}>
            <Layout>
                <WorkspaceNav defaultSelectedKey="2" />
                <Layout hasSider>
                    <aside className={styles.asideQueryOptions}>
                        <QueryForm />
                    </aside>
                    <Layout className={styles.layoutContent}>
                        <Content className={styles.content}>
                            {
                                queryData.texts.length === 0
                                    ?
                                    <Empty description="暂无文本数据" />
                                    :
                                    <>
                                        <Space className={styles.divUserContentActionWrapper}>
                                            {`共查询到${queryData.texts.length}条文本，`
                                                + `已选${selectedRowKeys.length}条`}
                                            <Button danger
                                                disabled={selectedRowKeys.length === 0}
                                                onClick={() => {}}>
                                                删除所选文本
                                            </Button>
                                        </Space>

                                        <Table columns={columns}
                                            dataSource={queryData.texts
                                                .map((x, i) => ({ ...x, key: i })) }
                                            rowSelection={{
                                                onChange: (newSelectedRowKeys: Key[]) => {
                                                    setSelectedRowKeys(newSelectedRowKeys);
                                                }
                                            }} />
                                    </>
                            }
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </div>
    );
})

export default Query;