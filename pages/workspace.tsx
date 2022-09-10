import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import * as L from "../logics/workspace";
import { checkIsLoggedIn } from "../logics/router-checks";
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import styles from "../styles/workspace.module.scss";

const { Header, Content, Sider } = Layout;

export default class WorkspacePage extends React.Component{
    constructor(props: {}) {
        super(props);
    }
    
    componentDidMount(): void {
        checkIsLoggedIn();
    }

    topNavItems: MenuProps['items'] = ['文本标注', '添加文本', '文本查询'].map((x,i) => ({
        key:i,
        label: x,
    }));

    thisComponent = observer(() => (
        <div className={styles.divMainWrapper}>
            <Layout>
                <Header className={styles.header}>
                    <i className={classNames(styles.iIcon,"fa-solid fa-book")}></i>
                    <Menu theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        items={this.topNavItems} />
                </Header>
                <Layout>
                    <Sider width={200} className={styles.sider}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%', borderRight: 0 }}
                            items={this.topNavItems}
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