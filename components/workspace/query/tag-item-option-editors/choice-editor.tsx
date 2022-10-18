import React from "react";
import { observer } from "mobx-react-lite";
import { Checkbox, Space } from 'antd';
import styles from "../../../../styles/workspace.module.scss";
import type { TagItemQueryOptionEditorProps } from "./types";
import queryData from "../../../../states/query-data";

const ChoiceEditor: React.FC<TagItemQueryOptionEditorProps> = observer(
    (props: TagItemQueryOptionEditorProps) => {
        return (
            <div className={styles.divTagItemEditorWrapper}>
                <div className={styles.divTagItemEditor}>
                    <label className="lbl-editor-title">{props.tagItemMeta.editorTitle}</label>
                    <Checkbox.Group onChange={e => queryData.setTagItemValue(
                        props.tagItemIndex,
                        e as string[])}
                        value={queryData.tagItems[props.tagItemIndex].value}>
                        <Space direction="vertical">
                            {
                                props.tagItemMeta.choices!.filter(x => x.internal !== undefined)
                                    .map((x, i) => (
                                        <Checkbox value={x.internal} key={i}>{x.editorLabel}</Checkbox>
                                    ))
                            }
                        </Space>
                    </Checkbox.Group>
                </div>
            </div>
        )
    });

export default ChoiceEditor;