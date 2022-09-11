import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import * as L from "../../logics/workspace/workspace-nav";
import { checkIsLoggedIn } from "../../logics/router-checks";
import { DownOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Layout, Menu } from 'antd';
import ManagementNav from "../../components/management/management-nav";
import styles from "../../styles/workspace.module.scss";
import userData from "../../states/user-data";

const { Header, Content, Sider } = Layout;

export default class WorkspacePage extends React.Component {
    constructor(props: {}) {
        super(props);
    }

    componentDidMount(): void {
        checkIsLoggedIn();
    }

    thisComponent = observer(() => (
        <div className={styles.divMainWrapper}>
            <Layout>
                <ManagementNav />
                <Layout>
                    <Sider width={200} className={styles.sider}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%', borderRight: 0 }}
                            items={[]}
                        />
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>

                        <Content
                            className={styles.content}
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            Content
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