import React, { useState, useEffect, Key } from "react";
import Head from 'next/head';
import { observer } from "mobx-react-lite";
import * as L from "../../logics/workspace/query";
import { Table, Space, Layout, Button, Empty, Tag, Modal, Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { checkIsLoggedIn } from "../../logics/router-checks";
import styles from "../../styles/workspace.module.scss";
import WorkspaceNav from "../../components/workspace/workspace-nav";
import QueryForm from "../../components/workspace/query/query-form";
import * as T from "../../modules/objects/text";
import * as RULES from "../../modules/form-rules";
import taskData from "../../states/task-data";
import queryData from "../../states/query-data";
import SingleTaggingBox from "../../components/workspace/tagging/single-tagging-box";
import taggingData from "../../states/tagging-data";
import changeTextDialogState from "../../states/component-states/change-text-dialog-state";
import ChangeTextDialog from "../../components/workspace/tagging/dialogs/change-text-dialog";

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

const Query: React.FC = observer(() => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);
    const [isDeleteConfirmDialogConfirmLoading,
        setIsDeleteConfirmDialogConfirmLoading] = useState(false);
    const [enteredPassword, setEnteredPassword] = useState("");
    const [deleteResultMsg, setDeleteResultMsg] = useState("");

    const [isChangeTagDialogOpen, setIsChangeTagDialogOpen] = useState(false);
    const [isChangeTagDialogConfirmLoading,
        setIsChangeTagDialogConfirmLoading] = useState(false);

    useEffect(() => {
        checkIsLoggedIn();
    }, []);

    const columns: ColumnsType<T.Text> = [
        {
            align: "center",
            title: "ID",
            dataIndex: "userId"
        },
        {
            align: "left",
            title: "文本内容",
            dataIndex: "text",
            width: "65%",
            render: x => (
                <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                    {x}
                </div>
            )
        },
        {
            align: "left",
            title: "标注",
            dataIndex: "tag",
            render: (tag: T.Tag, text) => (
                tag.id === null ?
                    <Tag>无任何标注</Tag>
                    :
                    <Space direction="vertical" align="start">
                        <Tag color="magenta">
                            <Space size={5}>
                                <b>文件:</b>
                                <span>{text.fileName}</span>
                            </Space>
                        </Tag>

                        <Tag color="orange">
                            <Space size={5}>
                                <b>标注者:</b>
                                <span>{tag.taggerName}</span>
                            </Space>
                        </Tag>

                        <Tag color="green">
                            <Space size={5}>
                                <b>标注时间:</b>
                                <span>{tag.tagTime}</span>
                            </Space>
                        </Tag>

                        <Tag color="blue">
                            <Space direction="vertical" align="start" size={0}>
                                {
                                    tag.tagItems.map((x, i) => (
                                        <Space key={i} size={5}>
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
                <Space direction="vertical">
                    <Button type="link" onClick={() => {
                        changeTextDialogState.setSelectedTextIndex(x.key);
                        changeTextDialogState.setText(queryData.texts[x.key].text);
                        changeTextDialogState.setIsOpen(true);
                    }}>
                        修改文本
                    </Button>
                    <Button type="link" onClick={() => {
                        queryData.setChangeTagTextIndex(x.key);
                        L.startChangeTag(setIsChangeTagDialogOpen);
                    }}>
                        修改标注
                    </Button>
                </Space>
            )
        },
    ];

    return (
        <div className={styles.divMainWrapper}>
            <Head>
                <title>文本标注系统 - 文本查询</title>
            </Head>

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
                                                onClick={() => setIsDeleteConfirmDialogOpen(true)}>
                                                删除所选文本
                                            </Button>
                                        </Space>

                                        <Table columns={columns}
                                            dataSource={queryData.texts
                                                .map((x, i) => ({ ...x, key: i }))}
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

            <Modal destroyOnClose
                title="确认删除所选文本"
                onCancel={() => setIsDeleteConfirmDialogOpen(false)}
                open={isDeleteConfirmDialogOpen}
                footer={null}>
                <div className={styles.divDeleteDatasetConfirmWrapper}>
                    <Space>
                        <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: 25 }} />
                        <span>
                            您准备删除选中的{selectedRowKeys.length}条文本！该文本和其标注都将永久丢失。
                        </span>
                    </Space>

                    <span>为确保安全，请输入您的登录密码验证身份：</span>

                    <Form
                        name="delete_dataset_enter_password"
                        onFinish={() => L.deleteTexts(
                            selectedRowKeys as number[],
                            enteredPassword,
                            setIsDeleteConfirmDialogOpen,
                            setIsDeleteConfirmDialogConfirmLoading,
                            setDeleteResultMsg,
                            setSelectedRowKeys
                        )}
                    >
                        <Form.Item
                            name="password"
                            rules={RULES.PW_RULES}
                        >
                            <Input
                                type="password"
                                placeholder="请输入登录密码"
                                value={enteredPassword}
                                onChange={e => setEnteredPassword(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item
                            validateStatus="error"
                            help={deleteResultMsg}
                        >
                            <Button
                                type="primary" htmlType="submit" danger
                                loading={isDeleteConfirmDialogConfirmLoading}>
                                继续删除
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>

            <Modal
                destroyOnClose
                title="修改标注"
                okText="修改标注"
                cancelText="放弃修改"
                width={1000}
                onOk={() => L.endChangeTag(
                    true,
                    setIsChangeTagDialogOpen,
                    setIsChangeTagDialogConfirmLoading)}
                onCancel={() => L.endChangeTag(
                    false,
                    setIsChangeTagDialogOpen,
                    setIsChangeTagDialogConfirmLoading)}
                open={isChangeTagDialogOpen}
                confirmLoading={isChangeTagDialogConfirmLoading}>
                <SingleTaggingBox hideCount hideEditText
                    textIndex={taggingData.texts.length - 1} />
            </Modal>

            <ChangeTextDialog onOk={() => L.changeText()} />
        </div>
    );
})

export default Query;