import React from "react";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { AutoComplete } from 'antd';
import styles from "../../../../styles/workspace.module.scss";
import type { TagItemEditorProps } from "./types";
import taggingData from "../../../../states/tagging-data";

const SingleInputEditor: React.FC<TagItemEditorProps> = observer(
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
                    <AutoComplete placeholder="请输入"
                        className={styles.inTagItem}
                        options={
                            (taggingData.suggestions[props.textIndex] ?? {})[
                            props.tagItemMeta.id
                            ] ?? []}
                        value={taggingData.texts[props.textIndex]
                            .tag.tagItems[props.tagItemIndex].value[0] ?? ""}
                        onChange={e => taggingData.setTagItemValueElement(
                            props.textIndex,
                            props.tagItemIndex,
                            0, e)} />
                </div>
            </div>
        )
    });

export default SingleInputEditor;