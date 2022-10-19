import axios from "axios";
import APIS from "../../modules/apis";
import { message } from "antd";
import queryData from "../../states/query-data";
import taskData from "../../states/task-data";
import userData from "../../states/user-data";
import { copyAndFilterEmptyInputValues } from "../../modules/utils/tagging";

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