import React, { useEffect, useState } from "react";
import { Divider } from "antd";
import { FormOutlined } from "@ant-design/icons"
import { observer } from "mobx-react-lite";
import * as L from "../../../logics/workspace/tagging";
import styles from "../../../styles/workspace.module.scss";
import { Text } from "../../../modules/objects/text";

const SingleTaggingBox: React.FC<{ text: Text; }> =
    observer((props: { text: Text; }) => {
    
    return (
        <div className={styles.divSingleTaggingBox}>
            <div className="div-tagging-box-text">
                <span className="span-edit-icon">
                    <FormOutlined />
                </span>
                {props.text.text}
            </div>

            <Divider/>

            <div className="div-tagging-box-tag-items-wrapper">

            </div>
        </div>
    );
});

export default SingleTaggingBox;