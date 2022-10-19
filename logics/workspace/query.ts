import axios from "axios";
import APIS from "../../modules/apis";
import { message } from "antd";
import queryData from "../../states/query-data";
import taskData from "../../states/task-data";
import userData from "../../states/user-data";
import { copyAndFilterEmptyInputValues } from "../../modules/utils/tagging";
import { pbkdf2Hash } from "../../modules/utils/hash";
import { cloneDeep } from "lodash-es";
import type { Text } from "../../modules/objects/text";
import taggingData from "../../states/tagging-data";

export const quertTexts = (
    setIsQueryLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (!queryData.isTagTimeValid) {
        queryData.setResultMsg("限定标注开始时间不能晚于结束时间");
        return;
    }

    setIsQueryLoading(true);

    axios.post(APIS.queryTexts, {
        accessId: userData.accessId,
        taskId: taskData.taskId,
        query: {
            fileNames: queryData.fileNames,
            tagStatus: queryData.tagStatus,
            textPart: queryData.textPart,

            taggerNames: queryData.taggerNames,
            tagTimeStart: queryData.shouldFilterTagTime ? queryData.tagTimeStartStr : "",
            tagTimeEnd: queryData.shouldFilterTagTime ? queryData.tagTimeEndStr : "",
            tagItems: copyAndFilterEmptyInputValues(queryData.tagItems)
        }
    }).then(res => {
        if (res.data.success) {
            if (res.data.texts.length > 0) {
                queryData.setTexts(res.data.texts);
                message.success(`查询到${res.data.texts.length}条符合条件的文本`);
            }
            else {
                message.info("未查询到任何符合条件的文本");
            }
        }
        else {
            message.error(res.data.msg);
        }
    }).catch(reason => {
        console.log(reason);
        message.error(reason.message);
    }).finally(() => {
        setIsQueryLoading(false);
    });
}

export const deleteTexts = (indexes: number[],
    enteredPassword: string,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setDeleteResultMsg: React.Dispatch<React.SetStateAction<string>>,
    setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>) => {

    setLoading(true);

    axios.post(APIS.deleteTexts, {
        accessId: userData.accessId,
        pwHashed: pbkdf2Hash(enteredPassword),
        taskId: taskData.taskId,
        textIds: indexes.map(x => queryData.texts[x].id)
    }).then(res => {
        if (res.data.success) {
            message.success("成功删除所选文本");
            setDeleteResultMsg("");
            setIsOpen(false);
            // 防止删除选中的数据集后，渲染列表出现read prop of undefined情况
            setSelectedRowKeys([]);
            queryData.removeTexts(indexes);
        }
        else {
            setDeleteResultMsg(res.data.msg);
        }
    }).catch(reason => {
        console.log(reason);
        message.error(reason.message);
    }).finally(() => {
        setLoading(false);
    });
}

export const startChangeTag = (index: number,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (queryData.isChangeTagTextPushed) {
        message.warn("修改标注未退出");
        return;
    }

    taggingData.pushText(queryData.texts[index]);
    queryData.setIsChangeTagTextPushed(true);
    setIsOpen(true);
}

export const popTaggingDataTexts = () => {
    queryData.setIsChangeTagTextPushed(false);
    taggingData.popText();
}

export const endChangeTag = (
    submit: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!queryData.isChangeTagTextPushed) {
        message.warn("修改标注已退出");
        return;
    }

    if (!submit) {
        setIsOpen(false);
        popTaggingDataTexts();
        taggingData.setNoUnsavedChanges();
        return;
    }

    // 存在错误的标注项则不能继续操作
    if (taggingData.getTextTagStatus(taggingData.texts.length-1) === "ERROR") {
        message.error("文本有非法标注项，无法修改标注");
        return;
    }

    // 筛掉单输入和多输入标注项的空值
    const text: Text = cloneDeep(taggingData.texts[taggingData.texts.length - 1]);
    text.tag.tagItems = copyAndFilterEmptyInputValues(text.tag.tagItems);

    setLoading(true);

    axios.post(APIS.changeTag, {
        accessId: userData.accessId,
        taskId: taskData.taskId,
        text
    }).then(res => {
        if (res.data.success) {
            message.success("成功修改标注");
            setIsOpen(false);
            popTaggingDataTexts();
            taggingData.setNoUnsavedChanges();
        }
        else {
            message.error(res.data.msg);
        }
    }).catch(reason => {
        console.log(reason);
        message.error(reason.message);
    }).finally(() => {
        setLoading(false);
    });
}