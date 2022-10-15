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
import changeTextDialogState from "../../../../states/component-states/change-text-dialog-state";

const { TextArea } = Input;

const ChangeTextDialog: React.FC = observer(() => {

    return (
        <Modal
            title="编辑文本内容"
            okText="确定"
            cancelText="取消"
            open={changeTextDialogState.isChangeTextDialogOpen}
            onOk={() => L.changeText()}
            onCancel={() => changeTextDialogState.setIsChangeTextDialogOpen(false)}
            confirmLoading={changeTextDialogState.isChangeTextLoading}
        >
            <TextArea rows={4}
                placeholder="请输入新文本内容"
                value={changeTextDialogState.text}
                onChange={e=>changeTextDialogState.setText(e.target.value) } />
        </Modal>
    )
})

export default ChangeTextDialog;
