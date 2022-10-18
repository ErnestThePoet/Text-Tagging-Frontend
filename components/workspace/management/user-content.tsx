import React, { useState, useEffect, Key } from "react";
import { observer } from "mobx-react-lite";
import { Modal, Table, Spin, Space, Button, Tag, Select } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { stringCompare, stringNullCompare } from "../../../modules/utils/cmp";
import * as L from "../../../logics/workspace/management";
import type { UserInfo } from "../../../states/user-management-data";
import userData from "../../../states/user-data";
import userManagementData from "../../../states/user-management-data";
import { UserLevel, UserLevelValues } from "../../../modules/objects/types";
import { getUserLevelLabel } from "../../../modules/utils/user-level-utils";
import addUserDialogState from "../../../states/component-states/add-user-dialog-state";
import AddUserDialog from "./dialogs/add-user-dialog";
import styles from "../../../styles/workspace.module.scss";
import uiState from "../../../states/ui-state";

const { confirm } = Modal;
const { Option } = Select;

const showResetPwDialog = (index: number) => {
    confirm({
        title: "重置密码",
        okText: "确定",
        cancelText: "取消",
        icon: <ExclamationCircleOutlined />,
        content: `您将重置【${userManagementData.usersInfo[index].name}】的密码为"itnlp"。`,
        onOk() {
            L.resetPassword(index);
        }
    });
};

const UserContent: React.FC = observer(() => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

    const [isChangeLevelDialogOpen, setIsChangeLevelDialogOpen] = useState(false);
    const [isChangeLevelDialogConfirmLoading,
        setIsChangeLevelDialogConfirmLoading] = useState(false);
    const [selectedUserIndex, setSelectedUserIndex] = useState(0);
    const [newLevel, setNewLevel] = useState<UserLevel>(0);

    useEffect(() => {
        userManagementData.updateUsersInfo();
    }, []);

    const columns: ColumnsType<UserInfo> = [
        {
            align: "center",
            title: "登录名",
            dataIndex: "account",
            width: "20%",
            showSorterTooltip: false,
            sorter: (a, b) => stringCompare(a.account, b.account)
        },
        {
            align: "center",
            title: "昵称",
            dataIndex: "name",
            width: "20%",
            showSorterTooltip: false,
            sorter: (a, b) => stringCompare(a.name, b.name),
        },
        {
            align: "center",
            title: "权限等级",
            dataIndex: "level",
            showSorterTooltip: false,
            sorter: (a, b) => a.level - b.level,
            render: x => {
                switch (x) {
                    case 0:
                        return (<Tag color="blue">{getUserLevelLabel(0)}</Tag>);
                    case 1:
                        return (<Tag color="green">{getUserLevelLabel(1)}</Tag>);
                    default:
                        return "N/A";
                }
            }
        },
        {
            align: "center",
            title: "上次登陆时间",
            dataIndex: "lastLoginTime",
            showSorterTooltip: false,
            sorter: (a, b) => stringNullCompare(a.lastLoginTime, b.lastLoginTime),
        },
        {
            align: "center",
            title: "操作",
            render: x => (
                <Space>
                    <Button type="link" onClick={() => {
                        setNewLevel(x.level);
                        setSelectedUserIndex(x.key);
                        setIsChangeLevelDialogOpen(true);
                    }}>
                        修改权限
                    </Button>
                    <Button type="link" onClick={() => showResetPwDialog(x.key)}>
                        重置密码
                    </Button>
                </Space>
            )
        },
    ];

    const showDeleteUsersDialog = () => {
        confirm({
            title: "删除账号",
            okText: "继续删除",
            cancelText: "取消",
            icon: <ExclamationCircleOutlined />,
            content: `是否删除所选的${selectedRowKeys.length}个账号？`,
            onOk() {
                L.deleteUsers(selectedRowKeys as number[]);
            }
        });
    };

    return (
        <Spin spinning={uiState.isUsersInfoLoading}>
            <div>
                <Space className={styles.divUserContentActionWrapper}>
                    {`已选${selectedRowKeys.length}个账号`}
                    <Button danger
                        disabled={selectedRowKeys.length === 0}
                        onClick={() => showDeleteUsersDialog()}>
                        删除账号
                    </Button>

                    <Button icon={<PlusOutlined />}
                        onClick={() => addUserDialogState.setIsOpen(true)}>
                        添加账号
                    </Button>
                </Space>

                <Table columns={columns}
                    dataSource={userManagementData.usersInfo
                        .map((x, i) => ({ ...x, key: i }))
                        .filter(x => x.account !== userData.account)}
                    // 必须先map后filter，保证key就是数组中的下标
                    rowSelection={{
                        onChange: (newSelectedRowKeys: Key[]) => {
                            setSelectedRowKeys(newSelectedRowKeys);
                        }
                    }} />
            </div>

            <Modal title="修改权限"
                okText="确定"
                cancelText="取消"
                onOk={() => L.changeUserLevel(selectedUserIndex,
                    newLevel,
                    setIsChangeLevelDialogOpen,
                    setIsChangeLevelDialogConfirmLoading)}
                onCancel={() => setIsChangeLevelDialogOpen(false)}
                open={isChangeLevelDialogOpen}
                confirmLoading={isChangeLevelDialogConfirmLoading}>
                <Space>
                    <span>
                        修改【{userManagementData.usersInfo[selectedUserIndex]?.name}】的权限为:
                    </span>
                    
                    <Select value={newLevel} onChange={e => setNewLevel(e)}>
                        {
                            UserLevelValues.map((x, i) => (
                                <Option key={i} value={x}>{getUserLevelLabel(x)}</Option>
                            ))
                        }
                    </Select>
                </Space>
            </Modal>

            <AddUserDialog />
        </Spin>
    );
});

export default UserContent;