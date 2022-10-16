import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import * as L from "../../logics/workspace/workspace-nav";
import { DownOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Layout, Menu } from 'antd';
import styles from "../../styles/workspace.module.scss";
import userData from "../../states/user-data";

const { Header } = Layout;

interface WorkspaceNavProps{
    defaultSelectedKey: string;
}

const navItemsNormal: MenuProps['items']
    = ['文本标注', '添加文本', '文本查询'].map((x, i) => ({
    key: i,
    label: x
}));

const navItemsAdmin: MenuProps['items']
    = ['文本标注', '添加文本', '文本查询', "系统管理"].map((x, i) => ({
    key: i,
    label: x
}));

const accountMenu = (
    <Menu
        onClick={e => L.onAccountMenuItemClick(e.key)}
        items={[
            {
                key: '0',
                label: "使用指南",
                icon: <QuestionCircleOutlined />
            },
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

const WorkspaceNav: React.FC<WorkspaceNavProps> = observer((props:WorkspaceNavProps) => (
    <Header className={styles.header}>
        <i className={classNames(styles.iIcon, "fa-solid fa-book")}></i>
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