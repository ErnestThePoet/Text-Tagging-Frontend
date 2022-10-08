import { message } from "antd";
import axios from "axios";
import APIS from "../../modules/apis";
import {cloneDeep} from "lodash-es";
import taggingData from "../../states/tagging-data";
import taskData from "../../states/task-data";
import userData from "../../states/user-data";
import type { Text } from "../../modules/objects/text";

export const openGetTextsDialog =
    (setIsGetTextsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
        setIsDatasetStatLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
        setIsGetTextsDialogOpen(true);
        taskData.updateDatasetStat(() => setIsDatasetStatLoading(true),
            () => setIsDatasetStatLoading(false));
}

export const getTextsToTag = (options:
    {
        targetTextCount: number;
        targetFile: string;
        moreTagsFirst: boolean;
    },
    setIsGetTextsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setIsGetTextsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    
    setIsGetTextsLoading(true);

    axios.postForm(APIS.getTextsToTag, {
        accessId: userData.accessId,
        taskId: taskData.taskId,
        count: options.targetTextCount,
        targetFile: options.targetFile,
        moreTagsFirst: options.moreTagsFirst
    }).then(res => {
        if (res.data.success) {
            taggingData.setTexts(res.data.texts);
            setIsGetTextsDialogOpen(false);
            message.success(`获取到${res.data.texts.length}条文本，标注愉快哦~`);
        }
        else {
            message.error(res.data.msg);
        }
    }).catch(reason => {
        console.log(reason);
        message.error(reason.message);
    }).finally(() => {
        setIsGetTextsLoading(false);
    });
}
    
export const saveTaggingProgress = (onSuccess?:()=>void) => {
    if (!taggingData.hasUnsavedChanges) {
        return;
    }

    // 存在错误的标注项则不能继续操作
    for (const i in taggingData.texts) {
        if (taggingData.getTextTagStatus(i) === "ERROR") {
            message.error(`第${parseInt(i) + 1}个文本有非法标注项，无法提交`);
            return;
        }
    }

    // 筛掉单输入和多输入标注项的空值
    const textsCopy: Array<Text> = cloneDeep(taggingData.texts);

    for (const i of textsCopy) {
        for (const j of i.tag.tagItems) {
            switch (taskData.idMetaMap[j.id].type) {
                case 2:
                case 3:
                    j.value = j.value.filter(x => x !== "");
                    break;
            }
        }
    }
    
    axios.post(APIS.addTags, {
        accessId: userData.accessId,
        taskId: taskData.taskId,
        texts: textsCopy
    }).then(res => {
        if (res.data.success) {
            taggingData.setNoUnsavedChanges();
            message.success("提交成功");
            if (onSuccess !== undefined) {
                onSuccess();
            }
        }
        else {
            message.error(res.data.msg);
        }
    }).catch(reason => {
        console.log(reason);
        message.error(reason.message);
    });
}
