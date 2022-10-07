import axios from "axios";
import { message } from "antd";
import type { UploadProps } from "antd";
import APIS from "../../modules/apis";
import userData from "../../states/user-data";
import taskData from "../../states/task-data";
import { checkImportDataset } from "../../modules/import-check";
import { toImportTextsTags } from "../../modules/import-convert";
import { getCurrentDateTimeStr } from "../../modules/utils/date-time";

export const updateDatasetStat = (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    taskData.updateDatasetStat(
        () => { setLoading(true); },
        () => { setLoading(false); });
}

export const uploadProps: UploadProps = {
    customRequest: options => {
        const reader = new FileReader();

        reader.onload = () => {
            let importObj: any;

            try {
                importObj = JSON.parse(reader.result as string);
            }
            catch (e) {
                message.error("JSON解析错误，请检查JSON语法");
                console.log(e);
                return;
            }

            const checkResult = checkImportDataset(importObj);

            if (!checkResult.ok) {
                message.error("JSON不符合导入要求：" + checkResult.msg,10);
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
                    taskData.updateDatasetStat(() => { }, () => { });
                    message.success(`恭喜！成功上传` +
                        `${(<File>options.file).name}中的${(<any[]>importObj).length}个文本`);
                }
                else {
                    message.error(res.data.msg);
                }
            }).catch(reason => {
                console.log(reason);
                message.error(reason.message);
            });
        }

        reader.readAsText(options.file as File);
    }
};