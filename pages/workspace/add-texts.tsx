import React, { useEffect } from "react";
import Head from 'next/head';
import { observer } from "mobx-react-lite";
import * as L from "../../logics/workspace/add-texts";
import { CloseCircleTwoTone, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { List, Space, Layout, Button, Empty, Tag, Input, Divider } from 'antd';
import { checkIsLoggedIn } from "../../logics/router-checks";
import styles from "../../styles/workspace.module.scss";
import WorkspaceNav from "../../components/workspace/workspace-nav";
import ChangePwDialog from "../../components/workspace/change-pw-dialog";
import addTextsData from "../../states/add-texts-data";

const { Content } = Layout;
const { TextArea } = Input;

const AddTexts: React.FC = observer(() => {
    useEffect(() => {
        checkIsLoggedIn();
    }, []);

    return (
        <div className={styles.divMainWrapper}>
            <Head>
                <title>文本标注系统 - 添加文本</title>
            </Head>
            <Layout>
                <WorkspaceNav defaultSelectedKey="1" />
                <Layout hasSider>
                    <aside className={styles.asideTextList}>
                        <List
                            className={styles.listAddedTextList}
                            dataSource={addTextsData.texts}
                            renderItem={(_, i) => (
                                <List.Item className={styles.listItemAddTexts}
                                    onClick={() => L.onListItemClick(i)}>
                                    <span>
                                        <Tag color="purple">{i + 1}</Tag>
                                        {`${addTextsData.getTextPreview(i)}`}
                                    </span>

                                    {
                                        !addTextsData.isValid(i) &&
                                        <CloseCircleTwoTone twoToneColor="#f50"
                                            className={styles.fadeInTag} />
                                    }
                                </List.Item>
                            )}
                        />

                        <Space direction="vertical"
                            size={5}
                            className={styles.spaceAsideBottomButtonWrapper}>
                            <label>
                                {`共${addTextsData.texts.length}条文本`}
                            </label>

                            <Button
                                className={styles.btnAddTexts}
                                type="primary"
                                block
                                disabled={addTextsData.texts.length === 0}
                                onClick={() => L.addTexts()}>
                                添加到数据库
                            </Button>
                        </Space>
                    </aside>
                    <Layout className={styles.layoutContent}>
                        <Content id="content-added-texts"
                            className={styles.content}>
                            {
                                addTextsData.texts.length === 0
                                    ?
                                    <Empty description="添加一条文本吧" >
                                        <Button type="primary" onClick={() => addTextsData.add()}
                                            icon={<PlusOutlined />} >
                                            添加一条文本
                                        </Button>
                                    </Empty>
                                    :
                                    <>
                                        {
                                            addTextsData.texts.map((x, i) => (
                                                <Space id={`space-single-added-text-${i}`}
                                                    key={i} direction="vertical">
                                                    <div className={styles.divAddedTextBoxFirstRow}>
                                                        <Space>
                                                            <Tag color="blue">{i + 1}</Tag>

                                                            <Space>
                                                                <label>自定义ID:</label>
                                                                <Input placeholder="自定义ID"
                                                                    width={300}
                                                                    className={styles.inTagItem}
                                                                    value={x.userId}
                                                                    status={addTextsData.isUserIdValid(i) ? "" : "error"}
                                                                    onChange={e => addTextsData.changeUserId(i, e.target.value)} />
                                                            </Space>
                                                        </Space>

                                                        <MinusCircleOutlined
                                                            onClick={() => addTextsData.remove(i)} />
                                                    </div>

                                                    <TextArea
                                                        rows={6}
                                                        placeholder="输入一条文本"
                                                        value={x.text}
                                                        status={addTextsData.isTextValid(i) ? "" : "error"}
                                                        onChange={e => addTextsData.changeText(i, e.target.value)} />

                                                    <Divider />
                                                </Space>
                                            ))
                                        }

                                        <Button type="dashed" block
                                            onClick={() => addTextsData.add()}
                                            icon={<PlusOutlined />} >
                                            添加一条文本
                                        </Button>
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

export default AddTexts;