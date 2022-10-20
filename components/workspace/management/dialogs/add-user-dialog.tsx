import React from "react";
import { observer } from "mobx-react-lite";
import * as L from "../../../../logics/workspace/management";
import * as RULES from "../../../../modules/form-rules";
import { Button, Form, Input, Modal,Select } from 'antd';
import addUserDialogState from "../../../../states/component-states/add-user-dialog-state";
import { UserLevelValues } from "../../../../modules/objects/types";
import { getUserLevelLabel } from "../../../../modules/utils/user-level-utils";

const { Option } = Select;

const AddUserDialog: React.FC = observer(() => {

    return (
        // 吃一堑长一智，Modal必须设置destroyOnClose，否则内部元素不会响应状态变化
        <Modal
            destroyOnClose
            title="添加账号"
            open={addUserDialogState.isOpen}
            onCancel={() => addUserDialogState.setIsOpen(false)}
            footer={null}
        >
            <Form
                name="add_user"
                onFinish={() => L.createUser()}
            >
                <Form.Item
                    name="add_user_account"
                    label="登录名:"
                    labelAlign="left"
                    labelCol={{ span: 4 }}
                    rules={RULES.ACCOUNT_RULES}
                    initialValue={addUserDialogState.account}
                >
                    <Input
                        placeholder="请输入登录名"
                        value={addUserDialogState.account}
                        onChange={e => addUserDialogState.setAccount(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    name="add_user_name"
                    label="昵称:"
                    labelAlign="left"
                    labelCol={{ span: 4 }}
                    rules={RULES.NAME_RULES}
                    initialValue={addUserDialogState.name}
                >
                    <Input
                        placeholder="请输入昵称"
                        value={addUserDialogState.name}
                        onChange={e => addUserDialogState.setName(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    name="add_user_level"
                    label="权限:"
                    labelAlign="left"
                    labelCol={{ span: 4 }}
                    initialValue={addUserDialogState.level}
                    rules={[
                        {
                            required: true,
                            message: "请选择权限"
                        }
                    ]}
                >
                    <Select
                        value={addUserDialogState.level}
                        onChange={e => addUserDialogState.setLevel(e)}>
                        {
                            UserLevelValues.map((x, i) => (
                                <Option key={i} value={x}>{getUserLevelLabel(x)}</Option>
                            ))
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    validateStatus="error"
                    help={addUserDialogState.resultMsg}
                >
                    <Button
                        type="primary" htmlType="submit" block
                        disabled={addUserDialogState.isConfirmLoading}>
                        添加账号
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
})

export default AddUserDialog;
