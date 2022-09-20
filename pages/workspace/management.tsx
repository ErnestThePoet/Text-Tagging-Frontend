import React from "react";
import { observer } from "mobx-react-lite";
import { checkIsAdmin } from "../../logics/router-checks";
import { UserOutlined, DatabaseOutlined, BarChartOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { getMenuItem } from "../../modules/utils/menu-item";
import type { MenuItem } from "../../modules/utils/menu-item";
import WorkspaceNav from "../../components/workspace/workspace-nav";
import DatasetStatContent from "../../components/workspace/management/dataset-stat-content";
import styles from "../../styles/workspace.module.scss";

const { Content, Sider } = Layout;

export default class WorkspaceManagementPage extends React.Component<
    {},
    {
        selectedMenuKey: string;
    }
> {
    constructor(props: {}) {
        super(props);
        this.state = {
            selectedMenuKey: "0"
        };
    }

    componentDidMount(): void {
        checkIsAdmin();
    }

    menuItems: MenuItem[] = [
        getMenuItem("标注进度统计", "0", <BarChartOutlined />),
        getMenuItem("数据集管理", "1", <DatabaseOutlined />),
        getMenuItem("用户管理", "2", <UserOutlined />)];

    thisComponent = observer(() => (
        <div className={styles.divMainWrapper}>
            <Layout>
                <WorkspaceNav defaultSelectedKey="3"/>
                <Layout>
                    <Sider className={styles.sider}>
                        <Menu
                            onClick={e=>this.setState({selectedMenuKey:e.key})}
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
                                this.state.selectedMenuKey === "0" &&
                                <DatasetStatContent />
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