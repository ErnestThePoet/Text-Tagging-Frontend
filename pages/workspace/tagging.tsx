import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import * as L from "../../logics/workspace/tagging";
import { checkIsLoggedIn } from "../../logics/router-checks";
import {
    CheckCircleTwoTone,
    ExclamationCircleOutlined,
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { Tag, Spin } from 'antd';
import { List, Space, Layout, Button, Modal, Input, Select, Switch, Empty } from 'antd';
import WorkspaceNav from "../../components/workspace/workspace-nav";
import SingleTaggingBox from "../../components/workspace/tagging/single-tagging-box";
import styles from "../../styles/workspace.module.scss";
import taggingData from "../../states/tagging-data";
import taskData from "../../states/task-data";

const { Header, Content, Sider } = Layout;
const { confirm } = Modal;
const { Option } = Select;

const WorkspaceTaggingPage: React.FC = observer(() => {
    const [isGetTextsDialogOpen, setIsGetTextsDialogOpen] = useState(false);
    const [isDatasetStatLoading, setIsDatasetStatLoading] = useState(false);
    const [isGetTextsLoading, setIsGetTextsLoading] = useState(false);

    const [targetTextCount, setTargetTextCount] = useState(30);
    const [targetFile, setTargetFile] = useState("");
    const [moreTagsFirst, setIsMoreTagsFirst] = useState(false);

    const trimTargetTextCount = (count: number) => {
        if (isNaN(count)) {
            count = 30;
        }

        if (count < 1) {
            count = 1;
        }

        if (count > 100) {
            count = 100;
        }

        setTargetTextCount(Math.floor(count));
    }

    useEffect(() => {
        checkIsLoggedIn();
    }, []);

    const showSaveDialog = () => {
        confirm({
            title: "保存标注",
            icon: <ExclamationCircleOutlined />,
            content: "存在尚未提交的标注。是否提交所做标注？",
            onOk() {
                L.saveTaggingProgress(() => {
                    L.openGetTextsDialog(setIsGetTextsDialogOpen,
                        setIsDatasetStatLoading);
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
                                        + `(${Math.round(taggingData.taggedTextCount
                                            / taggingData.texts.length)}%)`}</label>
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
                                        L.openGetTextsDialog(setIsGetTextsDialogOpen,
                                            setIsDatasetStatLoading);
                                    }
                                }}>
                                获取待标注文本
                            </Button>
                        </Space>
                    </aside>
                    <Layout className={styles.layoutContent}>
                        <Content className={styles.content}>
                            {
                                taggingData.texts.length === 0 &&
                                <Empty description="快去获取一批待标注文本吧"/>
                            }
                            {
                                taggingData.texts.map((_, i) => (
                                    <SingleTaggingBox textIndex={i} key={i}/>
                                ))
                            }
                        </Content>
                    </Layout>
                </Layout>
            </Layout>

            <Modal
                title="选项"
                okText="确定"
                cancelText="取消"
                open={isGetTextsDialogOpen}
                onOk={() => L.getTextsToTag(
                    { targetTextCount, targetFile, moreTagsFirst },
                    setIsGetTextsLoading,
                    setIsGetTextsDialogOpen)}
                onCancel={()=>setIsGetTextsDialogOpen(false)}
                confirmLoading={isGetTextsLoading}
            >
                {
                    isDatasetStatLoading
                        ?
                        <Spin />
                        :
                        <div className={styles.divGetTextsOptionsWrapper}>
                            <div>
                                <label>获取数量</label>
                                <Input min={1} max={100} defaultValue={30}
                                    type="number"
                                    value={targetTextCount}
                                    onChange={e => trimTargetTextCount(e.target.valueAsNumber)} />
                            </div>

                            <div>
                                <label>指定文件</label>
                                <Select defaultValue={""} onChange={e=>setTargetFile(e)}>
                                    {
                                        taskData.datasetStats.map((x, i) => (
                                            <Option key={i} value={i === 0 ? "" : x.fileName}>
                                                {
                                                    `${i === 0 ? "<全数据库>" : x.fileName}`
                                                    + ` (${x.totalTextCount - x.taggedTextCount}待标注)`
                                                }
                                            </Option>
                                        ))
                                    }
                                </Select>
                            </div>

                            <div>
                                <label>标注多的文本优先</label>
                                <Switch
                                    checkedChildren={<CheckOutlined />}
                                    unCheckedChildren={<CloseOutlined />}
                                    defaultChecked
                                    onChange={e=>setIsMoreTagsFirst(e)}
                                />
                            </div>
                        </div>
                }
            </Modal>
        </div>
    );
});

export default WorkspaceTaggingPage;