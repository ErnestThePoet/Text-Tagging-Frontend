import React from "react";
import { observer } from "mobx-react-lite";
import * as L from "../../../../logics/workspace/tagging";
import {
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { Spin } from 'antd';
import { Modal, Input, Select, Switch } from 'antd';
import styles from "../../../../styles/workspace.module.scss";
import taskData from "../../../../states/task-data";
import getTextsDialogState from "../../../../states/component-states/get-texts-dialog-state";
import uiState from "../../../../states/ui-state";

const { Option } = Select;

const trimTargetTextCount = (count: number) => {
    if (isNaN(count)) {
        count = 30;
    }

    if (count < 1) {
        count = 1;
    }

    if (count > 100) {
        count = 100;
    }

    getTextsDialogState.setTargetTextCount(Math.floor(count));
}

const GetTextsDialog: React.FC = observer(() => {
    
    return (
        <Modal
            title="选项"
            okText="确定"
            cancelText="取消"
            open={getTextsDialogState.isOpen}
            onOk={() => L.getTextsToTag()}
            onCancel={() => getTextsDialogState.setIsOpen(false)}
            confirmLoading={getTextsDialogState.isConfirmLoading}
        >
            {
                uiState.isDatasetStatLoading
                    ?
                    <Spin />
                    :
                    <div className={styles.divGetTextsOptionsWrapper}>
                        <div>
                            <label>获取数量</label>
                            <Input min={1} max={100} defaultValue={30}
                                type="number"
                                value={getTextsDialogState.targetTextCount}
                                onChange={e => trimTargetTextCount(e.target.valueAsNumber)} />
                        </div>

                        <div>
                            <label>指定文件</label>
                            <Select defaultValue={""}
                                onChange={e => getTextsDialogState.setTargetFile(e)}>
                                {
                                    taskData.datasetStats.map((x, i) => (
                                        <Option key={i} value={i === 0 ? "" : x.fileName}>
                                            {
                                                `${i === 0 ? "<全数据库>" : x.fileName}`
                                                + ` (${x.totalTextCount - x.taggedTextCount}待标注)`
                                            }
                                        </Option>
                                    ))
                                }
                            </Select>
                        </div>

                        <div>
                            <label>标注多的文本优先</label>
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                checked={getTextsDialogState.moreTagsFirst}
                                onChange={e => getTextsDialogState.setIsMoreTagsFirst(e)}
                            />
                        </div>
                    </div>
            }
        </Modal>
    )
})

export default GetTextsDialog;
