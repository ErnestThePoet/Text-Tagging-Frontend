import React from "react";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { Progress, Divider, Empty, Table, Spin } from "antd";
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { SingleDatasetStat } from "../../../states/task-data";
import { stringCompare } from "../../../modules/utils/cmp";
import ui from "../../../states/ui";
import styles from "../../../styles/workspace.module.scss";
import * as L from "../../../logics/workspace/management";
import userData from "../../../states/user-data";
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
            <Progress percent={100*x} size="small"/>
        )
    },
    {
        title: "标注进度(按标注项数量)",
        dataIndex: "totalTagItemProgress",
        sorter: (a, b) => a.totalTagItemProgress - b.totalTagItemProgress,
        render: (x) => (
            <Progress percent={100 * x} size="small" />
        )
    },
];

const onChange: TableProps<SingleDatasetStat>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
};

export default class DatasetStatContent extends React.Component {
    constructor(props: {}) {
        super(props);
    }

    componentDidMount(): void {
        taskData.updateDatasetStat();
    }

    thisComponent = observer(() => (
        <Spin spinning={ui.loadings.management.datasetStat}>
            {
                taskData.datasetStat.stats.length <= 0
                    ?
                    <div className={styles.divDatasetContent}>
                        <Empty description="此标注任务还没有数据集" />
                    </div>
                    :
                    <div className={styles.divDatasetContent}>
                        <div className="total-progress-wrapper">
                            <div className="total-progress">
                                <label>全库标注进度(按已标注文本)</label>
                                <label>{`${taskData.datasetStat.stats[0].taggedTextCount}/`
                                    + `${taskData.datasetStat.stats[0].totalTextCount}`}</label>
                                <Progress type="circle"
                                    percent={taskData.datasetStat.stats[0].taggedTextProgress * 100} />
                            </div>

                            <div className="total-progress">
                                <label>全库标注进度(按标注项数量)</label>
                                <label>{`${taskData.datasetStat.stats[0].totalTagItemCount}/(`
                                    + `${taskData.datasetStat.tagItemCount}×`
                                    + `${taskData.datasetStat.stats[0].totalTextCount})`}</label>
                                <Progress type="circle"
                                    percent={taskData.datasetStat.stats[0].totalTagItemProgress * 100} />
                            </div>
                        </div>

                        <Divider />

                        <Table columns={columns}
                            dataSource={taskData.datasetStat.stats}
                            onChange={onChange} />
                    </div>
            }
        </Spin>
    ));

    render = () => (
        <this.thisComponent />
    );
}