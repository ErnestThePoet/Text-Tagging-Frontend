import React from 'react';
import { observer } from 'mobx-react-lite';
import { Radio,Button } from 'antd';
import taskData from '../../states/task-data';
import * as L from "../../logics/index";
import styles from '../../styles/index.module.scss';

const TaskPicker: React.FC = observer(() => (
    <Radio.Group style={{ width: "100%" }}
        onChange={e => taskData.setTaskId(e.target.value as number)}
        value={taskData.taskId}>
        <div className={styles.divTaskList}>
            <Radio.Button value={1}>2209文本价值观标注任务</Radio.Button>
        </div>
        <Button className={styles.btnEnterSystem} type="primary" block
            onClick={() => L.enterSystem()}>
            进入系统
        </Button>
    </Radio.Group>
));

export default TaskPicker;