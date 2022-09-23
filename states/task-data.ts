import { makeAutoObservable } from "mobx";
import axios from "axios";
import userData from "./user-data";
import APIS from "../modules/apis";
import { message } from "antd";
import type { TaskId } from "../modules/tasks";

export interface SingleDatasetStat{
    fileName: string;
    totalTextCount: number;
    totalTagItemCount: number;
    taggedTextCount: number;

    taggedTextProgress: number;
    totalTagItemProgress: number;
}

interface DatasetStat{
    tagItemCount: number;
    targetTagsPerText: number;

    stats: SingleDatasetStat[];
}

class TaskData{
    constructor() {
        makeAutoObservable(this);
    }

    taskId: TaskId = 1;

    datasetStat: DatasetStat = {
        tagItemCount: 0,
        targetTagsPerText: 0,
        stats: [{
            fileName: "",
            totalTextCount:0,
            totalTagItemCount: 0,
            taggedTextCount: 0,
            
            taggedTextProgress: 0,
            totalTagItemProgress:0
        }]
    };

    setTaskId(taskId: TaskId) {
        this.taskId = taskId;
    }

    updateDatasetStat(onStart:()=>void,onFinish:()=>void) {
        if (!userData.isAdmin) {
            return;
        }

        onStart();

        axios.postForm(APIS.getDatasetStat, {
            accessId: userData.accessId,
            taskId: this.taskId
        }).then(res => {
            if (!res.data.success) {
                message.error("获取数据库信息失败：" + res.data.msg);
                console.log(res.data);
            }
            else {
                this.datasetStat.tagItemCount = res.data.tagItemCount;
                this.datasetStat.targetTagsPerText = res.data.targetTagsPerText;
                this.datasetStat.stats = res.data.stats;
            }
        }).catch(reason => {
            message.error("获取数据库信息失败：" + reason);
            console.log(reason);
        }).finally(onFinish);
    }
}

export default new TaskData();