import React,{useState,useEffect} from "react";
import { observer } from "mobx-react-lite";
import { checkIsAdmin } from "../../logics/router-checks";
import { UserOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { getMenuItem } from "../../modules/utils/menu-item";
import type { MenuItem } from "../../modules/utils/menu-item";
import WorkspaceNav from "../../components/workspace/workspace-nav";
import DatasetContent from "../../components/workspace/management/dataset-content";
import styles from "../../styles/workspace.module.scss";

const { Content, Sider } = Layout;

const menuItems: MenuItem[] = [
    getMenuItem("数据集管理", "0", <DatabaseOutlined />),
    getMenuItem("用户管理", "1", <UserOutlined />)];

const WorkspaceManagementPage: React.FC = observer(() => {
    const [selectedMenuKey, setSelectedMenuKey] = useState("0");

    useEffect(() => {
        checkIsAdmin();
    }, []);

    return (<div className={styles.divMainWrapper}>
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
                            selectedMenuKey === "0" &&
                            <DatasetContent />
                        }
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </div>
    );
});

export default WorkspaceManagementPage;