import React from 'react';
import { observer } from 'mobx-react-lite';
import { Radio,Button } from 'antd';
import tagData from '../../states/tag-data';
import * as L from "../../logics/index";
import styles from '../../styles/index.module.scss';

export default class TaskPicker extends React.Component{
    constructor(props: {}) {
        super(props);
    }

    thisCompnoent = observer(() => (
        <Radio.Group style={{ width: "100%" }}
            onChange={e => tagData.setTaskId(e.target.value)}
            value={tagData.taskId}>
            <div className={styles.divTaskList}>
                <Radio.Button value={1}>2209文本价值观标注任务</Radio.Button>
            </div>
            <Button className={styles.btnEnterSystem} type="primary" block
            onClick={()=>L.enterSystem()}>
                进入系统
            </Button>
        </Radio.Group>
    ));

    render = () => (
        <this.thisCompnoent />
    );
}