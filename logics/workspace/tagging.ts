import { message } from "antd";
import axios from "axios";
import APIS from "../../modules/apis";
import taggingData from "../../states/tagging-data";
import taskData from "../../states/task-data";
import userData from "../../states/user-data";
import getTextsDialogState from "../../states/component-states/get-texts-dialog-state";
import changeTextDialogState from "../../states/component-states/change-text-dialog-state";
import type { Text } from "../../modules/objects/text";
import { copyAndFilterEmptyInputValuesInTexts } from "../../modules/utils/tagging";
import {
    MIN_TARGET_TEXT_COUNT,
    MAX_TARGET_TEXT_COUNT,
    EMPTY_TARGET_TEXT_COUNT
} from "../../modules/get-text-configs";

export const openGetTextsDialog = () => {
    getTextsDialogState.setIsOpen(true);
    taskData.updateDatasetStat();
}

export const getTextsToTag = () => {
    if (getTextsDialogState.targetTextCount === EMPTY_TARGET_TEXT_COUNT
        || getTextsDialogState.targetTextCount < MIN_TARGET_TEXT_COUNT
        || getTextsDialogState.targetTextCount > MAX_TARGET_TEXT_COUNT) {
        return;
    }

    getTextsDialogState.setIsConfirmLoading(true);

    axios.postForm(APIS.getTextsToTag, {
        accessId: userData.accessId,
        taskId: taskData.taskId,
        count: getTextsDialogState.targetTextCount,
        targetFile: getTextsDialogState.targetFile,
        moreTagsFirst: getTextsDialogState.moreTagsFirst
    }).then(res => {
        if (res.data.success) {
            if (res.data.texts.length > 0) {
                taggingData.setTexts(res.data.texts);
                message.success(
                    `获取到${res.data.texts.length}条文本，标注愉快~请尽量在5小时内提交进度哦`);
            }
            else {
                message.info("未获取到任何文本");
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

export const saveTaggingProgress = (
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    onSuccess?: () => void) => {
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
    const texts: Array<Text> = copyAndFilterEmptyInputValuesInTexts(taggingData.texts);

    if (setLoading !== undefined) {
        setLoading(true);
    }

    axios.post(APIS.addTags, {
        accessId: userData.accessId,
        taskId: taskData.taskId,
        texts
    }).then(res => {
        if (res.data.success) {
            taggingData.setNoUnsavedChanges();
            message.success("提交成功，辛苦啦~");

            for (let i = 0; i < taggingData.texts.length; i++) {
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
    }).finally(() => {
        if (setLoading !== undefined) {
            setLoading(false);
        }
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

export const onListItemClick = (index: number) => {
    const targetOffsetTop =
        document.getElementById(`div-single-tagging-box-${index}`)?.offsetTop;

    if (targetOffsetTop === undefined) {
        return;
    }

    document.getElementById("content-tagging-boxes")?.scrollTo({
        top: targetOffsetTop - 100
    });
}