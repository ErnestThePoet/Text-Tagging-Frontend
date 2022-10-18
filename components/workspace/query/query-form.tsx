import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import * as L from "../../../logics/workspace/query";
import { SearchOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Space, Layout, Button, Spin, Radio, Input, Select } from 'antd';
import { checkIsAdmin, checkIsLoggedIn } from "../../../logics/router-checks";
import styles from "../../../styles/workspace.module.scss";
import WorkspaceNav from "../../../components/workspace/workspace-nav";
import ChangePwDialog from "../../../components/workspace/change-pw-dialog";
import addTextsData from "../../../states/add-texts-data";
import taskData from "../../../states/task-data";
import uiState from "../../../states/ui-state";
import userManagementData from "../../../states/user-management-data";

const { Content } = Layout;
const { Option } = Select;

const QueryForm: React.FC = observer(() => {
    const [isQueryLoading, setIsQueryLoading] = useState(false);

    useEffect(() => {
        checkIsAdmin();
        taskData.updateDatasetStat();
        userManagementData.updateUsersInfo();
    }, []);

    return (
        <Spin spinning={uiState.isDatasetStatLoading}>
            <Form
                name="text_query"
                layout="vertical"
                onFinish={() => { }}
            >
                <Form.Item
                    name="text_query_filename"
                    label="限定文件:"
                >
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="为空表示不限文件"
                        onChange={e=>console.log(e)}
                    >
                        {
                            taskData.datasetStats.slice(1).map((x, i) => (
                                <Option value={x.fileName} key={i}>{ x.fileName}</Option>
                            ))
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    name="text_query_tag_status"
                    label="标注状态:"
                >
                    <Radio.Group>
                        <Radio.Button value={0}>不限</Radio.Button>
                        <Radio.Button value={1}>已完成</Radio.Button>
                        <Radio.Button value={2}>未完成</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item>
                    <label>
                        {`共查询到${addTextsData.texts.length}条文本`}
                    </label>
                    <Button
                        type="primary" htmlType="submit" block
                        icon={<SearchOutlined />}
                        loading={isQueryLoading}>
                        提交查询
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    );
});

export default QueryForm;