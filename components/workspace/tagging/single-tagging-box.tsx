import React from "react";
import { Divider, Tag } from "antd";
import { EditTwoTone } from "@ant-design/icons"
import { observer } from "mobx-react-lite";
import SingleChoiceEditor from "./tag-item-editors/single-choice";
import MultipleChoiceEditor from "./tag-item-editors/multiple-choice";
import SingleInputEditor from "./tag-item-editors/single-input";
import MultipleInputEditor from "./tag-item-editors/multiple-input";
import styles from "../../../styles/workspace.module.scss";
import taskData from "../../../states/task-data";
import taggingData from "../../../states/tagging-data";
import changeTextDialogState from "../../../states/component-states/change-text-dialog-state";

interface SingleTaggingBoxProps {
    textIndex: number;
    // 是否隐藏左上角的文本总数标签（用在修改标签对话框时，关闭）
    hideCount?: boolean;
    // 是否隐藏文本编辑图标（用在修改标签对话框时，关闭）
    hideEditText?: boolean;
}

const SingleTaggingBox: React.FC<SingleTaggingBoxProps> =
    observer((props: SingleTaggingBoxProps) => {
        // 防止修改标注对话框关闭时出现read prop of undefined问题
        if (props.textIndex >= taggingData.texts.length) {
            return <div />;
        }

        const tagStatus = taggingData.getTextTagStatus(props.textIndex);

        return (
            <div className={styles.divSingleTaggingBox}>
                <div>
                    {
                        !props.hideCount&&
                        <Tag color="blue">{`${props.textIndex + 1}/${taggingData.texts.length}`}</Tag>
                    }
                    {
                        tagStatus==="FINISHED" &&
                        <Tag className={styles.fadeInTag} color="green">标注完成</Tag>
                    }
                    {
                        tagStatus === "UNFINISHED" &&
                        <Tag className={styles.fadeInTag} color="gold">标注未完成</Tag>
                    }
                    {
                        tagStatus === "ERROR" &&
                        <Tag className={styles.fadeInTag} color="red">标注项非法</Tag>
                    }
                </div>
                
                <div className="div-tagging-box-text">
                    {
                        !props.hideEditText &&
                        <span className="span-edit-icon"
                            onClick={() => {
                                changeTextDialogState.setSelectedTextIndex(props.textIndex);
                                changeTextDialogState.setText(taggingData.texts[props.textIndex].text);
                                changeTextDialogState.setIsOpen(true);
                            }}>
                            <EditTwoTone />
                        </span>
                    }
                    
                    {taggingData.texts[props.textIndex].text}
                </div>

                <Divider />

                <div className="div-tagging-box-tag-items-wrapper">
                    {
                        taskData.tagItemMetas.map((x, i) => {
                            switch (x.type) {
                                case 0:
                                    return (
                                        <SingleChoiceEditor
                                            key={i}
                                            textIndex={props.textIndex}
                                            tagItemIndex={taggingData.texts[props.textIndex]
                                            .tag.tagItems.findIndex(u=>u.id===x.id)}
                                            tagItemMeta={x} />
                                    );
                                case 1:
                                    return (
                                        <MultipleChoiceEditor
                                            key={i}
                                            textIndex={props.textIndex}
                                            tagItemIndex={taggingData.texts[props.textIndex]
                                                .tag.tagItems.findIndex(u => u.id === x.id)}
                                            tagItemMeta={x} />
                                    );
                                case 2:
                                    return (
                                        <SingleInputEditor
                                            key={i}
                                            textIndex={props.textIndex}
                                            tagItemIndex={taggingData.texts[props.textIndex]
                                                .tag.tagItems.findIndex(u => u.id === x.id)}
                                            tagItemMeta={x} />
                                    );
                                case 3:
                                    return (
                                        <MultipleInputEditor
                                            key={i}
                                            textIndex={props.textIndex}
                                            tagItemIndex={taggingData.texts[props.textIndex]
                                                .tag.tagItems.findIndex(u => u.id === x.id)}
                                            tagItemMeta={x} />
                                    );
                                default:
                                    return (
                                        <Tag color="magenta">标注项类型不支持</Tag>
                                    )
                            }
                        })
                    }
                </div>
            </div>
        );
    });

export default SingleTaggingBox;