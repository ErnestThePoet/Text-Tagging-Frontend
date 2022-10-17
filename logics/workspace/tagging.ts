import { message } from "antd";
import axios from "axios";
import APIS from "../../modules/apis";
import {cloneDeep} from "lodash-es";
import taggingData from "../../states/tagging-data";
import taskData from "../../states/task-data";
import userData from "../../states/user-data";
import getTextsDialogState from "../../states/component-states/get-texts-dialog-state";
import changeTextDialogState from "../../states/component-states/change-text-dialog-state";
import type { Text } from "../../modules/objects/text";

export const openGetTextsDialog =() => {
    getTextsDialogState.setIsOpen(true);
    taskData.updateDatasetStat(() => getTextsDialogState.setIsDatasetStatLoading(true),
        () => getTextsDialogState.setIsDatasetStatLoading(false));
}

export const getTextsToTag = () => {
    
    getTextsDialogState.setIsConfirmLoading(true);

    axios.postForm(APIS.getTextsToTag, {
        accessId: userData.accessId,
        taskId: taskData.taskId,
        count: getTextsDialogState.targetTextCount,
        targetFile: getTextsDialogState.targetFile,
        moreTagsFirst: getTextsDialogState.moreTagsFirst
    }).then(res => {
        if (res.data.success) {
            if (res.data.texts.length === 0) {
                message.info("未获取到任何文本");
            }
            else {
                taggingData.setTexts(res.data.texts);
                message.success(`获取到${res.data.texts.length}条文本，标注愉快哦~`);
            }
            
            getTextsDialogState.setIsOpen(false);
        }
        else {
            message.error(res.data.msg);
        }
    }).catch(reason => {
        console.log(reason);
        message.error(reason.message);
    }).finally(() => {
        getTextsDialogState.setIsConfirmLoading(false);
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
            message.success("提交成功，辛苦啦~");
            
            for (let i = 0; i < taggingData.texts.length; i++){
                taggingData.texts[i].tag.id = res.data.tagIds[i];
            }
            
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

export const changeText = () => {
    if (changeTextDialogState.text === "") {
        message.error("新文本不能为空");
        return;
    }

    changeTextDialogState.setIsConfirmLoading(true);

    axios.postForm(APIS.changeText, {
        accessId: userData.accessId,
        taskId: taskData.taskId,
        textId: taggingData.texts[changeTextDialogState.selectedTextIndex].id,
        newText: changeTextDialogState.text
    }).then(res => {
        if (res.data.success) {
            taggingData.changeText(changeTextDialogState.selectedTextIndex,
                changeTextDialogState.text);
            changeTextDialogState.setIsOpen(false);
            message.success("修改成功");
        }
        else {
            message.error(res.data.msg);
        }
    }).catch(reason => {
        console.log(reason);
        message.error(reason.message);
    }).finally(() => {
        changeTextDialogState.setIsConfirmLoading(false);
    });
}