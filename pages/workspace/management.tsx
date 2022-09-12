import React from "react";
import { observer } from "mobx-react-lite";
import { checkIsAdmin } from "../../logics/router-checks";
import { UserOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { getMenuItem } from "../../modules/utils/menu-item";
import type { MenuItem } from "../../modules/utils/menu-item";
import WorkspaceNav from "../../components/workspace/workspace-nav";
import styles from "../../styles/workspace.module.scss";

const { Content, Sider } = Layout;

export default class WorkspaceManagementPage extends React.Component {
    constructor(props: {}) {
        super(props);
    }

    componentDidMount(): void {
        checkIsAdmin();
    }

    menuItems: MenuItem[] = [
        getMenuItem("数据集管理", "0", <DatabaseOutlined />),
        getMenuItem("用户管理", "1", <UserOutlined />)];

    thisComponent = observer(() => (
        <div className={styles.divMainWrapper}>
            <Layout>
                <WorkspaceNav defaultSelectedKey="3"/>
                <Layout>
                    <Sider className={styles.sider}>
                        <Menu
                            className={styles.menuSider}
                            mode="inline"
                            defaultSelectedKeys={["0"]}
                            defaultOpenKeys={["sub1"]}
                            items={this.menuItems}
                        />
                    </Sider>
                    <Layout className={styles.layoutContent}>
                        <Content
                            className={styles.content}>
                            {
                                new Array(100).fill(null).map((x, i) => (
                                    <div key={i}>Je suis Ernest!</div>
                                ))
                            }
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </div>
    ));

    render = () => (
        <this.thisComponent />
    );
}