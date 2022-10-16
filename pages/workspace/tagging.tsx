import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import * as L from "../../logics/workspace/tagging";
import { checkIsLoggedIn } from "../../logics/router-checks";
import {
    CheckCircleTwoTone,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { List, Space, Layout, Button, Modal, Empty, Tag } from 'antd';
import WorkspaceNav from "../../components/workspace/workspace-nav";
import SingleTaggingBox from "../../components/workspace/tagging/single-tagging-box";
import styles from "../../styles/workspace.module.scss";
import taggingData from "../../states/tagging-data";
import GetTextsDialog from "../../components/workspace/tagging/dialogs/get-texts-dialog";
import ChangeTextDialog from "../../components/workspace/tagging/dialogs/change-text-dialog";

const { Content } = Layout;
const { confirm } = Modal;


const WorkspaceTaggingPage: React.FC = observer(() => {
    useEffect(() => {
        checkIsLoggedIn();
    }, []);

    const showSaveDialog = () => {
        confirm({
            title: "保存标注",
            okText: "提交并继续获取",
            cancelText:"返回",
            icon: <ExclamationCircleOutlined />,
            content: "存在尚未提交的标注。是否提交所做标注？",
            onOk() {
                L.saveTaggingProgress(() => {
                    L.openGetTextsDialog();
                });
            }
        });
    };

    return (
        <div className={styles.divMainWrapper}>
            <Layout>
                <WorkspaceNav defaultSelectedKey="0" />
                <Layout hasSider>
                    <aside className={styles.asideTextList}>
                        <List
                            className={styles.listTextList}
                            dataSource={taggingData.texts}
                            renderItem={(x,i) => (
                                <List.Item className={styles.listItemText}>
                                    <span>
                                        <Tag color="geekblue">{i + 1}</Tag>
                                        {`${taggingData.getTextPreview(i)}`}
                                    </span>
                                    
                                    {
                                        taggingData.getTextTagStatus(i)==="FINISHED" &&
                                        <CheckCircleTwoTone twoToneColor="#52c41a"
                                            className={styles.fadeInTag} />
                                    }
                                </List.Item>
                            )}
                        />

                        <Space direction="vertical"
                            size={5}
                            className={styles.spaceAsideBottomButtonWrapper}>
                            {
                                taggingData.texts.length > 0 &&
                                <label>{
                                    `${taggingData.taggedTextCount}`
                                        + `/${taggingData.texts.length} `
                                        + `(${Math.round((taggingData.taggedTextCount
                                            / taggingData.texts.length)*100)}%)`}</label>
                            }

                            <Button block disabled={!taggingData.hasUnsavedChanges}
                                onClick={() => L.saveTaggingProgress()}>
                                提交标注进度
                            </Button>
                            <Button className={styles.btnGetTexts} type="primary" block
                                onClick={() => {
                                    if (taggingData.hasUnsavedChanges) {
                                        showSaveDialog();
                                    }
                                    else {
                                        L.openGetTextsDialog();
                                    }
                                }}>
                                获取待标注文本
                            </Button>
                        </Space>
                    </aside>
                    <Layout className={styles.layoutContent}>
                        <Content className={styles.content}>
                            {
                                taggingData.texts.length === 0
                                    ?
                                <Empty description="快去获取一批待标注文本吧"/>
                                    :
                                taggingData.texts.map((_, i) => (
                                    <SingleTaggingBox textIndex={i} key={i} />
                                ))
                            }
                        </Content>
                    </Layout>
                </Layout>
            </Layout>

            <GetTextsDialog/>
            <ChangeTextDialog/>
            
        </div>
    );
});

export default WorkspaceTaggingPage;