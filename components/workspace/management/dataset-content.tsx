import React, { useState, useEffect, Key } from "react";
import { observer } from "mobx-react-lite";
import {
    Progress,
    Divider,
    Empty,
    Table,
    Spin,
    Space,
    Button,
    Upload,
    Modal,
    Form,
    Input,
    Tooltip,
    Typography
} from "antd";
import type { ColumnsType } from 'antd/es/table';
import {
    ReloadOutlined,
    PlusOutlined,
    ExclamationCircleOutlined,
    QuestionCircleTwoTone
} from '@ant-design/icons';
import type { SingleDatasetStat } from "../../../states/task-data";
import { stringCompare } from "../../../modules/utils/cmp";
import * as RULES from "../../../modules/form-rules";
import * as L from "../../../logics/workspace/management";
import styles from "../../../styles/workspace.module.scss";
import taskData from "../../../states/task-data";
import uiState from "../../../states/ui-state";

const { Title, Paragraph, Text, Link } = Typography;

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
            <Progress percent={100 * x} size="small" format={x => `${x?.toFixed(1)}%`} />
        )
    },
    {
        title: "标注进度(按标注项数量)",
        dataIndex: "totalTagItemProgress",
        showSorterTooltip: false,
        sorter: (a, b) => a.totalTagItemProgress - b.totalTagItemProgress,
        render: (x) => (
            <Progress percent={100 * x} size="small" format={x => `${x?.toFixed(1)}%`} />
        )
    },
];

const showUploadFormatSpec = () => {
    Modal.info({
        title: `【${taskData.name}】数据集导入格式说明`,
        width: 750,
        okText: "确定",
        content: (
            <Typography>
                <Paragraph>
                    请导入UTF-8编码的JSON文件，其最外层为一个Array，每个元素都是具有下列属性的Object:
                </Paragraph>

                <Paragraph>
                    <ul>
                        <li>
                            id: string，用户指定的文本ID，如不需要设置可以设为空字符串;
                        </li>
                        <li>
                            text: string，文本内容，要求不能为空;
                        </li>
                        <li>
                            tag: Array，所有标注项组成的数组，每个元素都是具有itemName: string和value: any这两个属性的Object，具体为：
                            <ul>
                                {
                                    L.getUploadFormatTagItemsSpec().map((x, i) => (
                                        // eslint-disable-next-line react/no-unknown-property
                                        <li key={i}>{x}</li>
                                    ))
                                }
                            </ul>
                        </li>
                    </ul>
                </Paragraph>

                <Paragraph>
                    导入数据前，系统会自动对上传的文件进行格式检查。
                </Paragraph>
            </Typography>
        )
    });
}

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
                            <Space>
                                <Upload {...L.uploadProps}
                                    accept="application/json"
                                    maxCount={1}
                                    showUploadList={false}>
                                    <Button type="primary" icon={<PlusOutlined />}
                                        loading={uiState.isImportDatasetLoading}>
                                        导入第一个数据集
                                    </Button>
                                </Upload>

                                <Tooltip title="导入格式说明">
                                    <QuestionCircleTwoTone
                                        className={styles.iconUploadFormatSpec}
                                        onClick={() => showUploadFormatSpec()} />
                                </Tooltip>
                            </Space>
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
                                        format={x => `${x?.toFixed(1)}%`} />
                                </div>

                                <div className="total-progress">
                                    <label>全库标注进度(按标注项数量)</label>
                                    <label>{`${taskData.datasetStats[0].totalTagItemCount}/(`
                                        + `${taskData.tagItemCount}×`
                                        + `${taskData.datasetStats[0].totalTextCount})`}</label>
                                    <Progress type="circle"
                                        percent={taskData.datasetStats[0].totalTagItemProgress * 100}
                                        format={x => `${x?.toFixed(1)}%`} />
                                </div>
                            </div>

                            <Divider />

                            <Space className="action-wrapper">
                                {`已选${selectedRowKeys.length}个数据集`}

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
                                        loading={uiState.isImportDatasetLoading}>
                                        导入数据集
                                    </Button>
                                </Upload>

                                <Tooltip title="导入格式说明">
                                    <QuestionCircleTwoTone
                                        className={styles.iconUploadFormatSpec}
                                        onClick={() => showUploadFormatSpec()} />
                                </Tooltip>
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
                            您准备删除选中的
                            <b>
                                {selectedRowKeys.length}
                            </b>
                            个数据集
                            <b>【
                                {
                                    selectedRowKeys.map(x => (
                                        taskData.datasetStats[x].fileName
                                    )).toString()
                                }
                                】
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
                                loading={isDeleteConfirmDialogConfirmLoading}>
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