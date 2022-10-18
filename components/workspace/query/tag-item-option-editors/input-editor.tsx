import React from "react";
import { observer } from "mobx-react-lite";
import { Space, Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "../../../../styles/workspace.module.scss";
import type { TagItemQueryOptionEditorProps } from "./types";
import queryData from "../../../../states/query-data";

const InputEditor: React.FC<TagItemQueryOptionEditorProps> = observer(
    (props: TagItemQueryOptionEditorProps) => {
        return (
            <div className={styles.divTagItemEditorWrapper}>
                <div className={styles.divTagItemEditor}>
                    <label className="lbl-editor-title">{props.tagItemMeta.editorTitle}</label>
                    <Space direction="vertical">
                        {
                            queryData.tagItems[props.tagItemIndex].value
                                .map((x, i) => (
                                    <Space key={i}>
                                        <Input placeholder="请输入" value={x}
                                            className={styles.inTagItem}
                                            onChange={e => queryData.setTagItemValueElement(
                                                props.tagItemIndex,
                                                i,
                                                e.target.value
                                            )} />
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => queryData.removeTagItemValueElement(
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
                            onClick={() => queryData.addTagItemValueElement(
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

export default InputEditor;