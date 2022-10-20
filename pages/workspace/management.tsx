import React, { useState, useEffect } from "react";
import Head from 'next/head';
import { observer } from "mobx-react-lite";
import { checkIsAdmin } from "../../logics/router-checks";
import { UserOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { getMenuItem } from "../../modules/utils/menu-item";
import type { MenuItem } from "../../modules/utils/menu-item";
import WorkspaceNav from "../../components/workspace/workspace-nav";
import DatasetContent from "../../components/workspace/management/dataset-content";
import styles from "../../styles/workspace.module.scss";
import ChangePwDialog from "../../components/workspace/change-pw-dialog";
import UserContent from "../../components/workspace/management/user-content";

const { Content, Sider } = Layout;

const menuItems: MenuItem[] = [
    getMenuItem("数据集管理", "0", <DatabaseOutlined />),
    getMenuItem("用户管理", "1", <UserOutlined />)];

const WorkspaceManagementPage: React.FC = observer(() => {
    const [selectedMenuKey, setSelectedMenuKey] = useState("0");

    useEffect(() => {
        checkIsAdmin();
    }, []);

    return (
        <div className={styles.divMainWrapper}>
            <Head>
                <title>文本标注系统-系统管理</title>
            </Head>
            <Layout>
                <WorkspaceNav defaultSelectedKey="3" />
                <Layout>
                    <Sider className={styles.sider}>
                        <Menu
                            onClick={e => setSelectedMenuKey(e.key)}
                            className={styles.menuSider}
                            mode="inline"
                            defaultSelectedKeys={["0"]}
                            defaultOpenKeys={["sub1"]}
                            items={menuItems}
                        />
                    </Sider>
                    <Layout className={styles.layoutContent}>
                        <Content
                            className={styles.content}>
                            {
                                (() => {
                                    switch (selectedMenuKey) {
                                        case "0":
                                            return <DatasetContent />;
                                        case "1":
                                            return <UserContent />;
                                    }
                                })()
                            }
                        </Content>
                    </Layout>
                </Layout>
            </Layout>

            <ChangePwDialog />
        </div>
    );
});

export default WorkspaceManagementPage;