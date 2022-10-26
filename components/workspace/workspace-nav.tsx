import React from "react";
import { observer } from "mobx-react-lite";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { saveTaggingProgress } from "../../logics/workspace/tagging";
import * as L from "../../logics/workspace/workspace-nav";
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Layout, Menu, Modal } from 'antd';
import styles from "../../styles/workspace.module.scss";
import userData from "../../states/user-data";
import changePwDialogState from "../../states/component-states/change-pw-dialog-state";
import taggingData from "../../states/tagging-data";

const { Header } = Layout;
const { confirm } = Modal;

interface WorkspaceNavProps {
    defaultSelectedKey: string;
}

const navItemsNormal: MenuProps['items']
    = ['文本标注', '添加文本'].map((x, i) => ({
        key: i,
        label: x
    }));

const navItemsAdmin: MenuProps['items']
    = ['文本标注', '添加文本', '文本查询', "系统管理"].map((x, i) => ({
        key: i,
        label: x
    }));

const showSaveDialog = (okText: string, onOk: () => void) => {
    confirm({
        title: "保存标注",
        okText,
        cancelText: "返回",
        icon: <ExclamationCircleOutlined />,
        content: "存在尚未提交的标注。是否提交所做标注？",
        onOk
    });
};

const onAccountMenuItemClick = (key: string) => {
    switch (key) {
        // case "0":
        //     //TODO:add guide
        //     break;
        case "1":
            if (taggingData.hasUnsavedChanges) {
                showSaveDialog("提交并修改密码",
                    () => saveTaggingProgress(undefined,
                        () => changePwDialogState.setIsOpen(true)));
            }
            else {
                changePwDialogState.setIsOpen(true);
            }
            break;
        case "2":
            if (taggingData.hasUnsavedChanges) {
                showSaveDialog("提交并退出登录",
                    () => saveTaggingProgress(undefined,
                        () => L.logout()));
            }
            else {
                L.logout();
            }
            break;
    }
}

const accountMenu = (
    <Menu
        onClick={e => onAccountMenuItemClick(e.key)}
        items={[
            // {
            //     key: '0',
            //     label: "使用指南",
            //     icon: <QuestionCircleOutlined />
            // },
            {
                key: '1',
                label: '修改密码'
            },
            {
                key: '2',
                danger: true,
                label: '退出登录'
            }
        ]}
    />
);

const WorkspaceNav: React.FC<WorkspaceNavProps> = observer((props: WorkspaceNavProps) => (
    <Header className={styles.header}>
        <FontAwesomeIcon className={styles.icon} icon={faBook} />
        <Menu theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[props.defaultSelectedKey]}
            onClick={e => L.onNavMenuItemClick(e.key)}
            items={userData.isAdmin
                ? navItemsAdmin
                : navItemsNormal} />

        <Dropdown className={styles.dropdownAccount}
            overlay={accountMenu}>
            <a onClick={e => e.preventDefault()}>
                <Space>
                    <span className={styles.spanAccountName}>
                        <span>
                            {userData.name}
                        </span>

                        {
                            userData.isAdmin &&
                            <span>
                                (管理员)
                            </span>
                        }
                    </span>

                    <DownOutlined />
                </Space>
            </a>
        </Dropdown>
    </Header>
));

export default WorkspaceNav;