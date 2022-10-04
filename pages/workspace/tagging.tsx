import React,{useEffect} from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import * as L from "../../logics/workspace/workspace-nav";
import { checkIsLoggedIn } from "../../logics/router-checks";
import { DownOutlined,QuestionCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Layout, Menu } from 'antd';
import WorkspaceNav from "../../components/workspace/workspace-nav";
import TaggingContent from "../../components/workspace/tagging/tagging-content";
import styles from "../../styles/workspace.module.scss";
import userData from "../../states/user-data";

const { Header, Content, Sider } = Layout;

const WorkspaceTaggingPage: React.FC = observer(() => {
    useEffect(() => {
        checkIsLoggedIn();
    }, []);
    
    return (
        <div className={styles.divMainWrapper}>
            <Layout>
                <WorkspaceNav defaultSelectedKey="0" />
                <Layout>
                    <Sider width={200} className={styles.sider}>
                        <Menu
                            className={styles.menuSider}
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            items={[]}
                        />
                    </Sider>
                    <Layout className={styles.layoutContent}>
                        <Content className={styles.content}>
                            <TaggingContent/>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </div>
    );
});

export default WorkspaceTaggingPage;