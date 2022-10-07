import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { Radio, Space } from 'antd';
import styles from "../../../../styles/workspace.module.scss";
import type { TagItemEditorProps, ValidationResult } from "./types";
import taggingData from "../../../../states/tagging-data";
import * as L from "../../../../logics/workspace/tagging";

const SingleChoiceEditor: React.FC<TagItemEditorProps> = observer(
    (props: TagItemEditorProps) => {
        const [validationResult, setValidationResult] = useState<ValidationResult>({
            status: "EMPTY",
            msg: ""
        });

        useEffect(() => {
            L.changeTagAndValidate(
                setValidationResult,
                props.textIndex,
                props.tagItemIndex,
                taggingData.texts[props.textIndex].tag.tagItems[props.tagItemIndex].value);
        }, []);

        return (
            <div className={styles.divTagItemEditorWrapper}>
                {
                    validationResult.status === "ERROR" &&
                    <label className="lbl-error-msg">{validationResult.msg}</label>
                }
                <div className={classNames(styles.divTagItemEditor,
                    { [styles.divTagItemEditorError]: validationResult.status === "ERROR" })}>
                    <label className="lbl-editor-title">{props.tagItemMeta.editorTitle}</label>
                    <Radio.Group onChange={e => L.changeTagAndValidate(
                        setValidationResult,
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