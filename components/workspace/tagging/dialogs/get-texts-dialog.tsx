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
import {
    MIN_TARGET_TEXT_COUNT,
    MAX_TARGET_TEXT_COUNT,
    DEFAULT_TARGET_TEXT_COUNT
} from "../../../../modules/get-text-rules";

const { Option } = Select;

const handleTargetTextCountChange = (value: string) => {
    let count: number = 0;

    if (value !== "") {
        count = parseInt(value);

        if (isNaN(count)) {
            count = DEFAULT_TARGET_TEXT_COUNT;
        }

        if (count < MIN_TARGET_TEXT_COUNT) {
            count = MIN_TARGET_TEXT_COUNT;
        }

        if (count > MAX_TARGET_TEXT_COUNT) {
            count = MAX_TARGET_TEXT_COUNT;
        }
    }

    getTextsDialogState.setTargetTextCount(count);
}

const GetTextsDialog: React.FC = observer(() => {

    return (
        <Modal
            destroyOnClose
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
                            <Input min={MIN_TARGET_TEXT_COUNT}
                                max={MAX_TARGET_TEXT_COUNT}
                                defaultValue={DEFAULT_TARGET_TEXT_COUNT}
                                type="number"
                                status={
                                    getTextsDialogState.targetTextCount < MIN_TARGET_TEXT_COUNT
                                        || getTextsDialogState.targetTextCount > MAX_TARGET_TEXT_COUNT
                                        ? "error" : ""
                                }
                                value={getTextsDialogState.targetTextCount === 0
                                    ? ""
                                    : getTextsDialogState.targetTextCount}
                                onChange={e => handleTargetTextCountChange(e.target.value)} />
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
                            <label>标注项多的文本优先</label>
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
