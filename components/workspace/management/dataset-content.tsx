import React, { useState, useEffect, Key } from "react";
import { observer } from "mobx-react-lite";
import { Progress, Divider, Empty, Table, Spin, Space, Button, Upload } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined } from '@ant-design/icons';
import type { SingleDatasetStat } from "../../../states/task-data";
import { stringCompare } from "../../../modules/utils/cmp";
import * as L from "../../../logics/workspace/management";
import styles from "../../../styles/workspace.module.scss";
import taskData from "../../../states/task-data";


const columns: ColumnsType<SingleDatasetStat> = [
    {
        title: "数据集文件名",
        dataIndex: "fileName",
        width: "20%",
        sorter: (a, b) => stringCompare(a.fileName, b.fileName)
    },
    {
        title: "文本总数",
        dataIndex: "totalTextCount",
        sorter: (a, b) => a.totalTextCount - b.totalTextCount,
    },
    {
        title: "已标注文本总数",
        dataIndex: "taggedTextCount",
        sorter: (a, b) => a.taggedTextCount - b.taggedTextCount,
    },
    {
        title: "标注项总数",
        dataIndex: "totalTagItemCount",
        sorter: (a, b) => a.totalTagItemCount - b.totalTagItemCount,
    },
    {
        title: "标注进度(按已标注文本)",
        dataIndex: "taggedTextProgress",
        sorter: (a, b) => a.taggedTextProgress - b.taggedTextProgress,
        render: (x) => (
            <Progress percent={100 * x} size="small" format={x => `${x?.toFixed(0)}%`} />
        )
    },
    {
        title: "标注进度(按标注项数量)",
        dataIndex: "totalTagItemProgress",
        sorter: (a, b) => a.totalTagItemProgress - b.totalTagItemProgress,
        render: (x) => (
            <Progress percent={100 * x} size="small" format={x => `${x?.toFixed(0)}%`} />
        )
    },
];



const DatasetContent: React.FC = observer(() => {
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

    useEffect(() => {
        L.updateDatasetStat(setLoading);
    }, []);

    return (
        <Spin spinning={loading}>
            <div className={styles.divDatasetContent}>
                <ReloadOutlined className="reload-icon"
                    onClick={() => L.updateDatasetStat(setLoading)} />
                {
                    taskData.datasetStats.length <= 1
                        ?
                        <Empty description="此标注任务还没有数据集">
                            <Upload {...L.uploadProps}
                                accept="application/json"
                                maxCount={1}
                                showUploadList={false}>
                                <Button type="primary">
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
                                <Button disabled={selectedRowKeys.length === 0}>
                                    导出所选
                                </Button>
                                <Button danger disabled={selectedRowKeys.length === 0}>
                                    删除所选
                                </Button>

                                <Upload {...L.uploadProps}
                                    accept="application/json"
                                    maxCount={1}
                                    showUploadList={false}>
                                    <Button type="primary">
                                        导入数据集
                                    </Button>
                                </Upload>
                            </Space>

                            <Table columns={columns}
                                dataSource={taskData.datasetStats.slice(1)
                                    .map((x, i) => ({ ...x, key: i }))}
                                rowSelection={{
                                    onChange: (newSelectedRowKeys: Key[]) => {
                                        setSelectedRowKeys(newSelectedRowKeys);
                                    }
                                }} />

                        </>
                }
            </div>
        </Spin>
    );
});

export default DatasetContent;