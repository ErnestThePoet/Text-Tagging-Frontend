import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Radio, Button, Spin } from 'antd';
import taskData from '../../states/task-data';
import * as L from "../../logics/index";
import styles from '../../styles/index.module.scss';
import type { Task } from '../../modules/types';

const TaskPicker: React.FC = observer(() => {
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        L.fetchTasks(setTasks, setLoading);
    }, []);

    return (
        loading ?
            <Spin spinning={loading} />
            :
            <Radio.Group className={styles.radGroupTasks}
                onChange={e => taskData.setTaskId(e.target.value as number)}
                value={taskData.taskId}>
                <div className={styles.divTaskList}>
                    {
                        tasks.map((x, i) => (
                            <Radio.Button key={i} value={x.id}>{x.name}</Radio.Button>
                        ))
                    }
                </div>
                <Button className={styles.btnEnterSystem} type="primary" block
                    onClick={() => L.enterSystem(tasks)}>
                    进入系统
                </Button>
            </Radio.Group>
    )
});

export default TaskPicker;