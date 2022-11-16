import axios from "axios";
import { message } from "antd";
import type { UploadProps } from "antd";
import APIS from "../../modules/apis";
import userData from "../../states/user-data";
import taskData from "../../states/task-data";
import { checkImportDataset } from "../../modules/import-check";
import { toImportTextsTags, toUploadTexts } from "../../modules/import-convert";
import { getCurrentDateTimeStr, getExportTimeStr } from "../../modules/utils/date-time";
import userManagementData from "../../states/user-management-data";
import { UserLevel } from "../../modules/objects/types";
import { getUserLevelLabel } from "../../modules/utils/user-level-utils";
import addUserDialogState from "../../states/component-states/add-user-dialog-state";
import { pbkdf2Hash } from "../../modules/utils/hash";
import uiState from "../../states/ui-state";

export const uploadProps: UploadProps = {
    customRequest: options => {
        const reader = new FileReader();

        reader.onload = () => {
            if (taskData.datasetStats.some(x => x.fileName === (<File>options.file).name)) {
                message.warn("已存在相同文件名");
                return;
            }

            let importObj: any;

            try {
                importObj = JSON.parse(reader.result as string);
            }
            catch (e) {
                message.error("JSON解析错误，请检查JSON语法");
                console.log(e);
                return;
            }

            uiState.setIsImportDatasetLoading(true);

            const checkResult = checkImportDataset(importObj);

            if (!checkResult.ok) {
                message.error("JSON不符合导入要求：" + checkResult.msg, 10);
                uiState.setIsImportDatasetLoading(false);
                return;
            }

            const convertedObj = toImportTextsTags(
                (<File>options.file).name,
                userData.name,
                getCurrentDateTimeStr(),
                importObj
            );

            axios.post(APIS.importDataset, {
                accessId: userData.accessId,
                taskId: taskData.taskId,
                ...convertedObj
            }).then(res => {
                if (res.data.success) {
                    taskData.updateDatasetStat();
                    message.success(`恭喜！成功上传` +
                        `【${(<File>options.file).name}】中的${(<any[]>importObj).length}个文本`);
                }
                else {
                    message.error(res.data.msg);
                }
            }).catch(reason => {
                console.log(reason);
                message.error(reason.message);
            }).finally(() => {
                uiState.setIsImportDatasetLoading(false);
            });
        }

        reader.readAsText(options.file as File);
    }
};

export const createUser = () => {
    if (userManagementData.usersInfo.some(
        x => x.account === addUserDialogState.account)) {
        addUserDialogState.setResultMsg("登录名已存在");
        return;
    }

    addUserDialogState.setIsConfirmLoading(true);

    axios.postForm(APIS.createUser, {
        accessId: userData.accessId,
        account: addUserDialogState.account,
        name: addUserDialogState.name,
        level: addUserDialogState.level
    }).then(res => {
        if (res.data.success) {
            userManagementData.addUser(addUserDialogState.account,
                addUserDialogState.name,
                addUserDialogState.level);

            addUserDialogState.setAccount("");
            addUserDialogState.setLevel(0);
            addUserDialogState.setName("");
            addUserDialogState.setResultMsg("");
            addUserDialogState.setIsOpen(false);
            message.success("成功添加账号");
        }
        else {
            addUserDialogState.setResultMsg(res.data.msg);
        }
    }).catch(reason => {
        console.log(reason);
        message.error(reason.message);
    }).finally(() => {
        addUserDialogState.setIsConfirmLoading(false);
    });
}

export const deleteUsers = (indexes: number[]) => {
    axios.post(APIS.deleteUsers, {
        accessId: userData.accessId,
        accounts: indexes.map(x => userManagementData.usersInfo[x].account)
    }).then(res => {
        if (res.data.success) {
            userManagementData.removeUsers(indexes);
            message.success(`成功删除${indexes.length}个账号`);
        }
        else {
            message.error(res.data.msg);
        }
    }).catch(reason => {
        console.log(reason);
        message.error(reason.message);
    });
}

export const resetPassword = (index: number) => {
    axios.postForm(APIS.resetPassword, {
        accessId: userData.accessId,
        account: userManagementData.usersInfo[index].account
    }).then(res => {
        if (res.data.success) {
            message.success(`成功重置【${userManagementData.usersInfo[index].name}】的密码`);
        }
        else {
            message.error(res.data.msg);
        }
    }).catch(reason => {
        console.log(reason);
        message.error(reason.message);
    });
}

export const changeUserLevel = (index: number, level: UserLevel,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {

    setLoading(true);

    const successMessage = `成功修改【${userManagementData.usersInfo[index].name}】`
        + `的权限为【${getUserLevelLabel(level)}】`;

    if (level === userManagementData.usersInfo[index].level) {
        message.success(successMessage);
        setLoading(false);
        setIsOpen(false);
        return;
    }

    axios.postForm(APIS.changeLevel, {
        accessId: userData.accessId,
        account: userManagementData.usersInfo[index].account,
        level
    }).then(res => {
        if (res.data.success) {
            userManagementData.changeUserLevel(index, level);
            message.success(successMessage);
            setIsOpen(false);
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

export const exportDataset = (indexes: number[], isTaggedOnly: boolean,
    setIsExportLoading: React.Dispatch<React.SetStateAction<boolean>>) => {

    setIsExportLoading(true);

    axios.post(APIS.exportDataset, {
        accessId: userData.accessId,
        taskId: taskData.taskId,
        fileNames: indexes.map(x => taskData.datasetStats[x].fileName),
        isTaggedOnly
    }).then(res => {
        if (res.data.success) {
            const convertedTexts = toUploadTexts(res.data.texts, res.data.tags);
            const downloadAnchor = document.createElement("a");
            downloadAnchor.download =
                `导出文本${isTaggedOnly ? "(仅标注完成的)" : ""}-${getExportTimeStr()}.json`;
            downloadAnchor.href = URL.createObjectURL(
                new Blob([JSON.stringify(convertedTexts,null,4)]));
            downloadAnchor.click();
            message.success("导出成功");
        }
        else {
            message.error(res.data.msg);
        }
    }).catch(reason => {
        console.log(reason);
        message.error(reason.message);
    }).finally(() => {
        setIsExportLoading(false);
    });
}

export const deleteDataset = (indexes: number[],
    enteredPassword: string,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setDeleteResultMsg: React.Dispatch<React.SetStateAction<string>>,
    setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>) => {

    setLoading(true);

    axios.post(APIS.deleteDataset, {
        accessId: userData.accessId,
        taskId: taskData.taskId,
        fileNames: indexes.map(x => taskData.datasetStats[x].fileName),
        pwHashed: pbkdf2Hash(enteredPassword)
    }).then(res => {
        if (res.data.success) {
            message.success("成功删除所选数据集");
            setDeleteResultMsg("");
            setIsOpen(false);
            // 防止删除选中的数据集后，渲染列表出现read prop of undefined情况
            setSelectedRowKeys([]);
            taskData.updateDatasetStat();
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

function quoteString(value: string | number) {
    return typeof (value) === "string" ? `"${value}"` : value;
}

export const getUploadFormatTagItemsSpec = () => {
    let specLines: string[] = [];

    for (const i in taskData.tagItemMetas) {
        const meta = taskData.tagItemMetas[i];
        let currentLine = `tag[${i}]: itemName="${meta.name}"，`;

        switch (meta.type) {
            case 0:
                currentLine +=
                    `value为[${meta.choices!
                        .map(x => quoteString(x.external))
                        .join(",")}]之一`
                    + `，其中${quoteString(meta.choices!
                        .find(x => x.internal === undefined)!
                        .external)}表示未标注`;
                break;
            case 1:
                currentLine +=
                    `value为[${meta.choices!
                        .map(x => quoteString(x.external))
                        .join(",")}]中的若干项组成的Array`
                    + `${meta.options?.minCount !== undefined
                        ? (`，最少${meta.options.minCount}项`)
                        : ""}`
                    + `${meta.options?.maxCount !== undefined
                        ? (`，最多${meta.options.maxCount}项`)
                        : ""}`
                    + "，设为空数组表示未标注";
                break;
            case 2:
                currentLine +=
                    `value为一个只有一个元素的Array，其元素是${meta.options?.type !== undefined
                        ? `一个${meta.options.type[0]}类型的值`
                        : "标注值"}`
                    + "，设为空数组表示未标注";
                break;
            case 3:
                if (meta.options?.minCount !== undefined
                    && meta.options?.maxCount !== undefined
                    && meta.options.minCount === meta.options.maxCount) {
                    currentLine += `value为包含${meta.options.minCount}个元素的数组`;
                }
                else {
                    currentLine +=
                        `value为包含若干元素的Array`;

                    currentLine +=
                        `${meta.options?.minCount !== undefined
                            ? (`，最少${meta.options.minCount}项`)
                            : ""}`
                        + `${meta.options?.maxCount !== undefined
                            ? (`，最多${meta.options.maxCount}项`)
                            : ""}`;
                }

                if (meta.options?.type !== undefined) {
                    if (meta.options.type.length === 1) {
                        currentLine += `，所有元素都是${meta.options.type[0]}类型`;
                    }
                    else if (meta.options.type.length > 1) {
                        currentLine +=
                            `，各元素类型分别为：[${meta.options.type.map(
                                (x, i) => `${i}:${x}`
                            ).join(",")}]`;
                    }
                }

                if (meta.options?.allowDuplicate === undefined
                    || meta.options.allowDuplicate === false) {
                    currentLine += "，不允许重复元素";
                }

                currentLine += "，设为空数组表示未标注";

                break;
        }

        currentLine += "；";

        specLines.push(currentLine);
    }

    return specLines;
}