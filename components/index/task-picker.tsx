import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Radio, Button, Spin } from 'antd';
import * as L from "../../logics/index";
import styles from '../../styles/index.module.scss';
import type { Task } from '../../modules/objects/task';

const TaskPicker: React.FC = observer(() => {
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTaskIndex, setSelectedTaskIndex] = useState(-1);

    useEffect(() => {
        L.fetchTasks(setTasks, setLoading);
    }, []);

    return (
        loading ?
            <Spin />
            :
            <Radio.Group className={styles.radGroupTasks}
                onChange={e => setSelectedTaskIndex(e.target.value as number)}
                value={selectedTaskIndex}>
                <div className={styles.divTaskList}>
                    {
                        tasks.map((x, i) => (
                            <Radio.Button key={i} value={i}>{x.name}</Radio.Button>
                        ))
                    }
                </div>
                <Button className={styles.btnEnterSystem} type="primary" block
                    onClick={() => L.enterSystem(tasks,selectedTaskIndex)}>
                    进入系统
                </Button>
            </Radio.Group>
    )
});

export default TaskPicker;