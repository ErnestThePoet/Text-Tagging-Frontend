import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import * as L from "../../../logics/workspace/query";
import { SearchOutlined } from '@ant-design/icons';
import {
    Form,
    Space,
    Button,
    Spin,
    Radio,
    Input,
    Select,
    DatePicker,
    TimePicker,
    Checkbox,
    Tag
} from 'antd';
import { checkIsAdmin } from "../../../logics/router-checks";
import taskData from "../../../states/task-data";
import uiState from "../../../states/ui-state";
import userManagementData from "../../../states/user-management-data";
import queryData from "../../../states/query-data";
import ChoiceEditor from "./tag-item-option-editors/choice-editor";
import InputEditor from "./tag-item-option-editors/input-editor";

const { Option } = Select;

const QueryForm: React.FC = observer(() => {
    const [isQueryLoading, setIsQueryLoading] = useState(false);

    useEffect(() => {
        checkIsAdmin();
        taskData.updateDatasetStat();
        userManagementData.updateUsersInfo();
    }, []);

    return (
        <Spin spinning={uiState.isDatasetStatLoading||uiState.isUsersInfoLoading}>
            <Form
                name="text_query"
                layout="vertical"
                onFinish={()=>L.quertTexts(setIsQueryLoading)}
            >
                <Form.Item
                    name="text_query_filename"
                    label="限定文件:"
                >
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="为空表示不限文件"
                        value={queryData.fileNames}
                        onChange={e=>queryData.setFileNames(e)}
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
                    <Radio.Group value={queryData.tagStatus}
                    onChange={e=>queryData.setTagStatus(e.target.value)}>
                        <Radio.Button value={0}>不限</Radio.Button>
                        <Radio.Button value={1}>已完成</Radio.Button>
                        <Radio.Button value={2}>未完成</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="text_query_text_part"
                    label="文本包含:"
                >
                    <Input placeholder="部分文本，为空表示不限"
                        value={queryData.textPart}
                        onChange={e => queryData.setTextPart(e.target.value)} />
                </Form.Item>

                <Form.Item
                    name="text_query_tagger"
                    label="限定标注者:"
                >
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="为空表示不限标注者"
                        value={queryData.taggerNames}
                        onChange={e => queryData.setTaggerNames(e)}
                    >
                        {
                            userManagementData.usersInfo.map((x, i) => (
                                <Option value={x.name} key={i}>{x.name}</Option>
                            ))
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    name="text_query_should_filter_tagtime"
                >
                    <Checkbox
                        value={queryData.shouldFilterTagTime}
                        onChange={e => queryData.setShouldFilterTagTime(e.target.checked)}>
                        限定标注时间
                    </Checkbox>
                </Form.Item>

                <Form.Item
                    name="text_query_tagtime_start"
                    label="标注时间不早于:"
                >
                    <Space>
                        <DatePicker allowClear={false}
                            onChange={e => queryData.setTagTimeStartDate(e!)}
                            value={queryData.tagTimeStartDate}
                            disabled={!queryData.shouldFilterTagTime}
                            status={queryData.isTagTimeValid ? "" : "error"} />
                        <TimePicker allowClear={false}
                            format="HH:mm"
                            onChange={e => queryData.setTagTimeStartTime(e!)}
                            value={queryData.tagTimeStartTime}
                            disabled={!queryData.shouldFilterTagTime}
                            status={queryData.isTagTimeValid ? "" : "error"}/>
                    </Space>
                </Form.Item>

                <Form.Item
                    name="text_query_tagtime_end"
                    label="标注时间不晚于:"
                >
                    <Space>
                        <DatePicker allowClear={false}
                            onChange={e => queryData.setTagTimeEndDate(e!)}
                            value={queryData.tagTimeEndDate}
                            disabled={!queryData.shouldFilterTagTime}
                            status={queryData.isTagTimeValid ? "" : "error"}/>
                        <TimePicker allowClear={false}
                            format="HH:mm"
                            onChange={e => queryData.setTagTimeEndTime(e!)}
                            value={queryData.tagTimeEndTime}
                            disabled={!queryData.shouldFilterTagTime}
                            status={queryData.isTagTimeValid ? "" : "error"}/>
                    </Space>
                </Form.Item>

                <Form.Item
                    name="text_query_tagtime_end"
                    label="限定标注项(为空表示不限):"
                >
                    <Space direction="vertical">
                        {
                            taskData.tagItemMetas.map((x, i) => {
                                switch (x.type) {
                                    case 0:
                                    case 1:
                                        return (
                                            <ChoiceEditor
                                                key={i}
                                                // queryData.tagItems由taskData.tagItemMetas
                                                // 直接映射而来，下标值相同
                                                tagItemIndex={i}
                                                tagItemMeta={x} />
                                        );
                                    case 2:
                                    case 3:
                                        return (
                                            <InputEditor
                                                key={i}
                                                // queryData.tagItems由taskData.tagItemMetas
                                                // 直接映射而来，下标值相同
                                                tagItemIndex={i}
                                                tagItemMeta={x} />
                                        );
                                    default:
                                        return (
                                            <Tag color="magenta">标注项类型不支持</Tag>
                                        );
                                }
                            })
                        }
                    </Space>
                </Form.Item>

                <Form.Item
                    validateStatus="error"
                    help={queryData.resultMsg}>
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