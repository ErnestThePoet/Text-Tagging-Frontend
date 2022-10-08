import React from "react";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { Radio, Space } from 'antd';
import styles from "../../../../styles/workspace.module.scss";
import type { TagItemEditorProps } from "./types";
import taggingData from "../../../../states/tagging-data";

const SingleChoiceEditor: React.FC<TagItemEditorProps> = observer(
    (props: TagItemEditorProps) => {
        const tagItemStatus = taggingData.getTagItemStatus(props.textIndex, props.tagItemIndex);
        return (
            <div className={styles.divTagItemEditorWrapper}>
                {
                    tagItemStatus.status === "ERROR" &&
                    <label className="lbl-error-msg">{tagItemStatus.msg}</label>
                }
                <div className={classNames(styles.divTagItemEditor,
                    { [styles.divTagItemEditorError]: tagItemStatus.status === "ERROR" })}>
                    <label className="lbl-editor-title">{props.tagItemMeta.editorTitle}</label>
                    <Radio.Group onChange={e => taggingData.setTagItemValue(
                        props.textIndex,
                        props.tagItemIndex,
                        [e.target.value])}
                        value={taggingData.texts[props.textIndex]
                            .tag.tagItems[props.tagItemIndex].value[0]}>
                        <Space direction="vertical">
                            {
                                props.tagItemMeta.choices!.filter(x => x.internal !== undefined)
                                    .map((x, i) => (
                                        <Radio value={x.internal} key={i}>{x.editorLabel}</Radio>
                                    ))
                            }
                        </Space>
                    </Radio.Group>
                </div>
            </div>
        )
    });

export default SingleChoiceEditor;