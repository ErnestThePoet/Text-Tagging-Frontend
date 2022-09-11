import React from "react";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import * as L from "../../logics/management/management-nav";
import * as L_WSNAV from "../../logics/workspace/workspace-nav";
import { DownOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Layout, Menu } from 'antd';

import styles from "../../styles/management.module.scss";
import stylesWsNav from "../../styles/workspace.module.scss";
import userData from "../../states/user-data";

const { Header, Content, Sider } = Layout;

export default class ManagementNav extends React.Component {
    constructor(props: {}) {
        super(props);
    }

    navItems: MenuProps['items'] = ['数据集管理', '账号管理'].map((x, i) => ({
        key: i,
        label: x
    }));

    accountMenuAdmin = (
        <Menu
            onClick={e => L_WSNAV.onAccountMenuItemClick(e.key)}
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
            onClick={e => L_WSNAV.onAccountMenuItemClick(e.key)}
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
        <Header className={stylesWsNav.header}>
            <Link href="/workspace/tagging">
                <div className={styles.divBackToWorkspace}>
                    <i className={classNames(styles.iIcon, "fa-solid fa-book")}></i>
                    <a className={styles.aBackToWorkspace} onClick={e => e.preventDefault()}>
                        回到工作区
                    </a>
                </div>
            </Link>
            
            <Menu theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                items={this.navItems} />

            <Dropdown className={stylesWsNav.dropdownAccount}
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