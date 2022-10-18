import React, { useState,useEffect } from "react";
import { observer } from "mobx-react-lite";
import * as L from "../../logics/workspace/query";
import { SearchOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Space, Layout, Button, Empty, Tag, Input, Select } from 'antd';
import { checkIsLoggedIn } from "../../logics/router-checks";
import styles from "../../styles/workspace.module.scss";
import WorkspaceNav from "../../components/workspace/workspace-nav";
import ChangePwDialog from "../../components/workspace/change-pw-dialog";
import addTextsData from "../../states/add-texts-data";
import QueryForm from "../../components/workspace/query/query-form";

const { Content } = Layout;
const { Option } = Select;

const Query: React.FC = observer(() => {
    useEffect(() => {
        checkIsLoggedIn();
    }, []);

    return (
        <div className={styles.divMainWrapper}>
            <Layout>
                <WorkspaceNav defaultSelectedKey="2" />
                <Layout hasSider>
                    <aside className={styles.asideQueryOptions}>
                        <QueryForm/>
                    </aside>
                    <Layout className={styles.layoutContent}>
                        <Content className={styles.content}>
                            {
                                addTextsData.texts.length === 0
                                    ?
                                    <Empty description="暂无文本数据" />
                                    :
                                    <>
                                        
                                    </>
                            }
                        </Content>
                    </Layout>
                </Layout>
            </Layout>

            <ChangePwDialog />
        </div>
    );
})

export default Query;