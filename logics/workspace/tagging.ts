import { message } from "antd";
import axios from "axios";
import APIS from "../../modules/apis";
import taggingData from "../../states/tagging-data";
import taskData from "../../states/task-data";
import userData from "../../states/user-data";

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
}