import React from "react";
import { Checkbox, Space } from 'antd';
import styles from "../../../styles/workspace.module.scss";

type onChangeFn = (value: string[]) => void;
interface MultipleChoiceEditorProps {
    tagItemName: string;
    value: string[];
    choices: Array<{ value: string; label: string; }>;
    onChange: onChangeFn;
}

const MultipleChoiceEditor: React.FC<MultipleChoiceEditorProps> =
    (props: MultipleChoiceEditorProps) => {

        return (
            <div className={styles.divTagItemEditor}>
                <label>{props.tagItemName}</label>
                <Checkbox.Group onChange={e => props.onChange(e as string[])}
                    value={props.value}>
                    <Space direction="vertical">
                        {
                            props.choices.map((x, i) => (
                                <Checkbox value={x.value} key={i}>{x.label}</Checkbox>
                            ))
                        }
                    </Space>
                </Checkbox.Group>
            </div>
        )
    }

export default MultipleChoiceEditor;