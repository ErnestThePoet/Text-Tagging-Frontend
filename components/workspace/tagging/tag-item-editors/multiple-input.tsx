import React from "react";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { Space, AutoComplete,Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "../../../../styles/workspace.module.scss";
import type { TagItemEditorProps } from "./types";
import taggingData from "../../../../states/tagging-data";

const MultipleInputEditor: React.FC<TagItemEditorProps> = observer(
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
                    <Space direction="vertical">
                        {
                            taggingData.texts[props.textIndex]
                                .tag.tagItems[props.tagItemIndex].value
                                .map((x, i) => (
                                    <Space key={i}>
                                        <AutoComplete placeholder="请输入" value={x}
                                            options={
                                                (taggingData.suggestions[props.textIndex] ?? {})[
                                                props.tagItemMeta.id
                                                ]??[]}
                                            className={styles.inTagItem}
                                            onChange={e => taggingData.setTagItemValueElement(
                                                props.textIndex,
                                                props.tagItemIndex,
                                                i,
                                                e
                                            )} />
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => taggingData.removeTagItemValueElement(
                                                props.textIndex,
                                                props.tagItemIndex,
                                                i
                                            )}
                                        />
                                    </Space>
                                ))
                        }
                        <Button
                            block
                            type="dashed"
                            onClick={() => taggingData.addTagItemValueElement(
                                props.textIndex,
                                props.tagItemIndex,
                                ""
                            )}
                            icon={<PlusOutlined />}
                        >
                            添加
                        </Button>
                    </Space>
                </div>
            </div>
        )
    });

export default MultipleInputEditor;