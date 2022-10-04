import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import * as L from "../../logics/workspace/tagging";
import { checkIsLoggedIn } from "../../logics/router-checks";
import { DownOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { List, Space, Layout, Button } from 'antd';
import WorkspaceNav from "../../components/workspace/workspace-nav";
import SingleTaggingControl from "../../components/workspace/tagging/single-tagging-control";
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
                <Layout hasSider>
                    <aside className={styles.asideTextList}>
                        <List
                            className={styles.listTextList}
                            dataSource={new Array(100).fill("123")}
                            renderItem={x => (
                                <List.Item className={styles.listItemText}>
                                    {x}
                                    <DownOutlined />
                                </List.Item>
                            )}
                        />

                        <Space direction="vertical"
                            size={5}
                            className={styles.spaceAsideBottomButtonWrapper}>
                            <Button block>
                                保存标注进度
                            </Button>
                            <Button className={styles.btnGetTexts} type="primary" block>
                                获取待标注文本
                            </Button>
                        </Space>
                    </aside>
                    <Layout className={styles.layoutContent}>
                        <Content className={styles.content}>

                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </div>
    );
});

export default WorkspaceTaggingPage;