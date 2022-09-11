import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import * as L from "../../logics/workspace/workspace-nav";
import { DownOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Layout, Menu } from 'antd';
import styles from "../../styles/workspace.module.scss";
import userData from "../../states/user-data";

const { Header, Content, Sider } = Layout;

export default class WorkspaceNav extends React.Component{
    constructor(props: {}) {
        super(props);
    }

    navItems: MenuProps['items'] = ['文本标注', '添加文本', '文本查询'].map((x, i) => ({
        key: i,
        label: x
    }));

    accountMenuAdmin = (
        <Menu
            onClick={e => L.onAccountMenuItemClick(e.key)}
            items={[
                {
                    key: '1',
                    label: "使用指南",
                    icon: <QuestionCircleOutlined />
                },
                {
                    key: '2',
                    label: "管理中心"
                },
                {
                    key: '3',
                    danger: true,
                    label: '退出登录'
                }
            ]}
        />
    );

    accountMenuNormal = (
        <Menu
            onClick={e => L.onAccountMenuItemClick(e.key)}
            items={[
                {
                    key: '1',
                    label: "使用指南",
                    icon: <QuestionCircleOutlined />
                },
                {
                    key: '3',
                    danger: true,
                    label: '退出登录'
                }
            ]}
        />
    );

    thisComponent = observer(() => (
        <Header className={styles.header}>
            <i className={classNames(styles.iIcon, "fa-solid fa-book")}></i>
            <Menu theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                items={this.navItems} />

            <Dropdown className={styles.dropdownAccount}
                overlay={userData.isAdmin
                    ? this.accountMenuAdmin
                    : this.accountMenuNormal}>
                <a onClick={e => e.preventDefault()}>
                    <Space>
                        {userData.name}
                        <DownOutlined />
                    </Space>
                </a>
            </Dropdown>
        </Header>
    ));

    render = () => (
        <this.thisComponent />
    );
}