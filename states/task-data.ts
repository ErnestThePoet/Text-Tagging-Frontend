import { makeAutoObservable } from "mobx";
import axios from "axios";
import userData from "./user-data";
import APIS from "../modules/apis";
import { message } from "antd";
import type { TagItemMeta } from "../modules/objects/task";

export interface SingleDatasetStat{
    fileName: string;
    totalTextCount: number;
    totalTagItemCount: number;
    taggedTextCount: number;

    taggedTextProgress: number;
    totalTagItemProgress: number;
}

class TaskData{
    constructor() {
        makeAutoObservable(this);
    }

    // 任务ID
    taskId: number = -1;
    // 任务名称
    name: string = "";
    // 任务中每个文本的目标标注数量
    targetTagsPerText: number = 0;
    // 标注项信息
    tagItemMetas: TagItemMeta[] = [];

    // 数据库统计信息
    datasetStats: SingleDatasetStat[] = [{
        fileName: "",
        totalTextCount: 0,
        totalTagItemCount: 0,
        taggedTextCount: 0,
            
        taggedTextProgress: 0,
        totalTagItemProgress: 0
    }];

    get tagItemCount(): number{
        return this.tagItemMetas.length;
    }

    setTaskId(taskId: number) {
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
                this.datasetStats = res.data.stats;
            }
        }).catch(reason => {
            message.error("获取数据库信息失败：" + reason);
            console.log(reason);
        }).finally(onFinish);
    }
}

export default new TaskData();