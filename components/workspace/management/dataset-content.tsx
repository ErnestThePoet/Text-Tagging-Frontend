import React, { useState, useEffect, Key } from "react";
import { observer } from "mobx-react-lite";
import { Progress, Divider, Empty, Table, Spin, Space, Button, Upload, Modal, Form, Input } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { SingleDatasetStat } from "../../../states/task-data";
import { stringCompare } from "../../../modules/utils/cmp";
import * as RULES from "../../../modules/form-rules";
import * as L from "../../../logics/workspace/management";
import styles from "../../../styles/workspace.module.scss";
import taskData from "../../../states/task-data";
import uiState from "../../../states/ui-state";


const columns: ColumnsType<SingleDatasetStat> = [
    {
        title: "数据集文件名",
        dataIndex: "fileName",
        width: "20%",
        showSorterTooltip: false,
        sorter: (a, b) => stringCompare(a.fileName, b.fileName)
    },
    {
        title: "文本总数",
        dataIndex: "totalTextCount",
        showSorterTooltip: false,
        sorter: (a, b) => a.totalTextCount - b.totalTextCount,
    },
    {
        title: "已标注文本总数",
        dataIndex: "taggedTextCount",
        showSorterTooltip: false,
        sorter: (a, b) => a.taggedTextCount - b.taggedTextCount,
    },
    {
        title: "标注项总数",
        dataIndex: "totalTagItemCount",
        showSorterTooltip: false,
        sorter: (a, b) => a.totalTagItemCount - b.totalTagItemCount,
    },
    {
        title: "标注进度(按已标注文本)",
        dataIndex: "taggedTextProgress",
        showSorterTooltip: false,
        sorter: (a, b) => a.taggedTextProgress - b.taggedTextProgress,
        render: (x) => (
            <Progress percent={100 * x} size="small" format={x => `${x?.toFixed(0)}%`} />
        )
    },
    {
        title: "标注进度(按标注项数量)",
        dataIndex: "totalTagItemProgress",
        showSorterTooltip: false,
        sorter: (a, b) => a.totalTagItemProgress - b.totalTagItemProgress,
        render: (x) => (
            <Progress percent={100 * x} size="small" format={x => `${x?.toFixed(0)}%`} />
        )
    },
];



const DatasetContent: React.FC = observer(() => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

    // 导出数据接收未完成时，不允许点击导出和删除按钮
    const [isExportLoading, setIsExportLoading] = useState(false);

    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);
    const [isDeleteConfirmDialogConfirmLoading,
        setIsDeleteConfirmDialogConfirmLoading] = useState(false);
    const [enteredPassword, setEnteredPassword] = useState("");
    const [deleteResultMsg, setDeleteResultMsg] = useState("");

    useEffect(() => {
        taskData.updateDatasetStat();
    }, []);

    return (
        <Spin spinning={uiState.isDatasetStatLoading}>
            <div className={styles.divDatasetContent}>
                <ReloadOutlined className="reload-icon"
                    onClick={() => taskData.updateDatasetStat()} />
                {
                    taskData.datasetStats.length <= 1
                        ?
                        <Empty description="此标注任务还没有数据集">
                            <Upload {...L.uploadProps}
                                accept="application/json"
                                maxCount={1}
                                showUploadList={false}>
                                <Button type="primary" icon={<PlusOutlined />}>
                                    导入第一个数据集
                                </Button>
                            </Upload>
                        </Empty>
                        :
                        <>
                            <div className="total-progress-wrapper">
                                <div className="total-progress">
                                    <label>全库标注进度(按已标注文本)</label>
                                    <label>{`${taskData.datasetStats[0].taggedTextCount}/`
                                        + `${taskData.datasetStats[0].totalTextCount}`}</label>
                                    <Progress type="circle"
                                        percent={taskData.datasetStats[0].taggedTextProgress * 100}
                                        format={x => `${x?.toFixed(0)}%`} />
                                </div>

                                <div className="total-progress">
                                    <label>全库标注进度(按标注项数量)</label>
                                    <label>{`${taskData.datasetStats[0].totalTagItemCount}/(`
                                        + `${taskData.tagItemCount}×`
                                        + `${taskData.datasetStats[0].totalTextCount})`}</label>
                                    <Progress type="circle"
                                        percent={taskData.datasetStats[0].totalTagItemProgress * 100}
                                        format={x => `${x?.toFixed(0)}%`} />
                                </div>
                            </div>

                            <Divider />

                            <Space className="action-wrapper">
                                {`已选${selectedRowKeys.length}个数据集`}

                                {/* TODO: logics */}
                                <Button disabled={selectedRowKeys.length === 0
                                    || isExportLoading}
                                    onClick={() => L.exportDataset(
                                        selectedRowKeys as number[],
                                        false,
                                        setIsExportLoading)}>
                                    导出所选
                                </Button>

                                <Button disabled={selectedRowKeys.length === 0
                                    || isExportLoading}
                                    onClick={() => L.exportDataset(
                                        selectedRowKeys as number[],
                                        true,
                                        setIsExportLoading)}>
                                    导出所选(仅标注完成的)
                                </Button>

                                <Button danger disabled={selectedRowKeys.length === 0
                                    || isExportLoading}
                                    onClick={() => setIsDeleteConfirmDialogOpen(true)}>
                                    删除所选
                                </Button>

                                <Upload {...L.uploadProps}
                                    accept="application/json"
                                    maxCount={1}
                                    showUploadList={false}>
                                    <Button type="primary" icon={<PlusOutlined />}
                                    disabled={uiState.isImportDatasetLoading}>
                                        导入数据集
                                    </Button>
                                </Upload>
                            </Space>

                            <Table columns={columns}
                                dataSource={taskData.datasetStats
                                    .map((x, i) => ({ ...x, key: i }))
                                    .slice(1)}
                                rowSelection={{
                                    onChange: (newSelectedRowKeys: Key[]) => {
                                        setSelectedRowKeys(newSelectedRowKeys);
                                    }
                                }} />

                        </>
                }
            </div>

            <Modal destroyOnClose
                title="确认删除所选数据集"
                onCancel={() => setIsDeleteConfirmDialogOpen(false)}
                open={isDeleteConfirmDialogOpen}
                footer={null}>
                <div className={styles.divDeleteDatasetConfirmWrapper}>
                    <Space>
                        <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: 25 }} />
                        <span>
                            您准备删除选中的数据集
                            <b>
                                {
                                    selectedRowKeys.map(x => (
                                        taskData.datasetStats[x].fileName
                                    )).toString()
                                }
                            </b>
                            ！该数据集的所有文本和所有文本标注都将永久丢失。
                        </span>
                    </Space>

                    <span>为确保安全，请输入您的登录密码验证身份：</span>

                    <Form
                        name="delete_dataset_enter_password"
                        onFinish={() => L.deleteDataset(
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
                                disabled={isDeleteConfirmDialogConfirmLoading}>
                                继续删除
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </Spin>
    );
});

export default DatasetContent;