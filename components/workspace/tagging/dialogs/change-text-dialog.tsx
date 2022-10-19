import React from "react";
import { observer } from "mobx-react-lite";
import { Modal, Input } from 'antd';
import changeTextDialogState from "../../../../states/component-states/change-text-dialog-state";

const { TextArea } = Input;

interface ChangeTextDialogProps{
    onOk: () => void;
}

const ChangeTextDialog: React.FC<ChangeTextDialogProps> =
    observer((props: ChangeTextDialogProps) => {

    return (
        <Modal
            title="编辑文本内容"
            okText="确定"
            cancelText="取消"
            open={changeTextDialogState.isOpen}
            onOk={props.onOk}
            onCancel={() => changeTextDialogState.setIsOpen(false)}
            confirmLoading={changeTextDialogState.isConfirmLoading}
        >
            <TextArea rows={4}
                placeholder="请输入新文本内容"
                value={changeTextDialogState.text}
                onChange={e=>changeTextDialogState.setText(e.target.value) } />
        </Modal>
    )
})

export default ChangeTextDialog;
