import axios from "axios";
import Router from "next/router";
import APIS from "../modules/apis";
import userData from "../states/user-data";
import { pbkdf2Hash } from "../modules/utils/hash";
import type { Task } from "../modules/objects/task";
import taskData from "../states/task-data";
import { message } from "antd";
import queryData from "../states/query-data";

export const tryAutoLogin = () => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId !== null && sessionId.length > 25) {
        axios.postForm(APIS.autoLogin, { sessionId })
            .then(res => {
                if (res.data.success) {
                    userData.setAccount(res.data.userData.account);
                    userData.setName(res.data.userData.name);
                    userData.setLevel(res.data.userData.level);
                    userData.setAccessId(res.data.accessId);
                    userData.setIsLoggedIn(true);
                }
            });
    }
}

export const login = (
    setIsLoggingIn: React.Dispatch<React.SetStateAction<boolean>>,
    setLoginResult: React.Dispatch<React.SetStateAction<{
        success: boolean;
        msg: string;
    }>>) => {
    const account
        = (<HTMLInputElement>document.getElementById("in-login-account")).value;

    const password
        = (<HTMLInputElement>document.getElementById("in-login-password")).value;

    const remember = (<HTMLInputElement>document.getElementById("cb-remember")).checked;

    setIsLoggingIn(true);

    axios.postForm(APIS.login, {
        account,
        pwHashed: pbkdf2Hash(password),
        remember
    }).then(res => {
        if (res.data.success) {
            userData.setAccount(res.data.userData.account);
            userData.setName(res.data.userData.name);
            userData.setLevel(res.data.userData.level);
            userData.setAccessId(res.data.accessId);
            userData.setIsLoggedIn(true);

            if (remember) {
                localStorage.setItem("sessionId", res.data.sessionId);
            }

            setLoginResult({
                success: true,
                msg: ""
            });
        }
        else {
            setLoginResult({
                success: false,
                msg: res.data.msg
            });
        }
    }).catch(reason => console.log(reason))
        .finally(() => setIsLoggingIn(false));
}

export const fetchTasks = (
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    
    setLoading(true);
    
    axios.postForm(APIS.getTasks, {
        accessId: userData.accessId
    }).then(res => {
        if (res.data.success) {
            let tagItemMetaDetails;
            try {
                tagItemMetaDetails = JSON.parse(res.data.tagItemMetaDetailsJsonStr);
            }
            catch (e) {
                console.log(e);
                message.error("标注项详情JSON数据解析失败");
                return;
            }
            setTasks(mergeTaskTagItemMetas(res.data.tasks, tagItemMetaDetails));
            setLoading(false);
        }
        else {
            message.error(res.data.msg);
        }
    }).catch(reason => {
        console.log(reason);
        message.error(reason.message);
    });
}

export const enterSystem = (tasks: Task[], selectedTaskIndex: number) => {
    if (!(selectedTaskIndex in tasks)) {
        message.warn("请选择一个标注任务");
        return;
    }

    const selectedTask = tasks[selectedTaskIndex];

    // 将选择的标注任务信息注入系统
    taskData.setTaskId(selectedTask.id);
    taskData.setName(selectedTask.name);
    taskData.setTargetTagsPerText(selectedTask.targetTagsPerText);
    taskData.setTagItemMetas(selectedTask.tagItemMetas);
    queryData.setTagItems(taskData.tagItemMetas.map(x => ({ id: x.id, value: [] })));

    Router.push("/workspace/tagging");
}

const mergeTaskTagItemMetas = (tasks: any[],tagItemMetaDetails:any) => {
    for (const i of tasks) {
        const tagItemMetaDetail = tagItemMetaDetails[i.id];
        for (const j of i.tagItemMetas){
            Object.assign(j, tagItemMetaDetail.tagItemMetas.find(x => x.name === j.name));
        }
    }
    
    return tasks;
}