import React, { useEffect, useState } from "react";
import { Divider, Tag } from "antd";
import { EditTwoTone } from "@ant-design/icons"
import { observer } from "mobx-react-lite";
import SingleChoiceEditor from "./tag-item-editors/single-choice";
import MultipleChoiceEditor from "./tag-item-editors/multiple-choice";
import * as L from "../../../logics/workspace/tagging";
import styles from "../../../styles/workspace.module.scss";
import { Text } from "../../../modules/objects/text";
import { TagItemType } from "../../../modules/objects/task";
import taskData from "../../../states/task-data";
import taggingData from "../../../states/tagging-data";

interface SingleTaggingBoxProps {
    textIndex: number;
}

const SingleTaggingBox: React.FC<SingleTaggingBoxProps> =
    observer((props: SingleTaggingBoxProps) => {

        return (
            <div className={styles.divSingleTaggingBox}>
                <div className="div-tagging-box-text">
                    <span className="span-edit-icon">
                        <EditTwoTone />
                    </span>
                    <Tag color="blue">{`${props.textIndex+1}/${taggingData.texts.length}`}</Tag>
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
                            }
                        })
                    }
                </div>
            </div>
        );
    });

export default SingleTaggingBox;