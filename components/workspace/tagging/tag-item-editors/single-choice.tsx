import React from "react";
import { Radio, Space } from 'antd';
import styles from "../../../styles/workspace.module.scss";

type onChangeFn = (value: string) => void;
interface SingleChoiceEditorProps {
    key: string | number;
    tagItemName: string;
    value: string;
    choices: Array<{ value: string; label: string; }>;
    onChange: onChangeFn;
}

const SingleChoiceEditor: React.FC<SingleChoiceEditorProps> =
    (props: SingleChoiceEditorProps) => {

        return (
            <div className={styles.divTagItemEditor}>
                <label>{ props.tagItemName }</label>
                <Radio.Group onChange={e=>props.onChange(e.target.value)} value={props.value}>
                    <Space direction="vertical">
                        {
                            props.choices.map((x, i) => (
                                <Radio value={x.value} key={i}>{x.label }</Radio>
                            ))
                        }
                    </Space>
                </Radio.Group>
            </div>
        )
    }

export default SingleChoiceEditor;