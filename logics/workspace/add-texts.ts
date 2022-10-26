import axios from "axios";
import APIS from "../../modules/apis";
import addTextsData from "../../states/add-texts-data";
import { message } from "antd";
import userData from "../../states/user-data";
import taskData from "../../states/task-data";

export const addTexts = () => {
    if (addTextsData.texts.length === 0) {
        return;
    }
    
    for (let i = 0; i < addTextsData.texts.length;i++) {
        if (!addTextsData.isValid(i)) {
            message.error(`第${i + 1}条文本的自定义ID或文本内容非法`);
            return;
        }
    }

    axios.post(APIS.addTexts, {
        accessId: userData.accessId,
        taskId: taskData.taskId,
        texts:addTextsData.texts
    }).then(res => {
        if (res.data.success) {
            message.success(`成功添加${addTextsData.texts.length}条文本`);
            addTextsData.clear();
        }
        else {
            message.error(res.data.msg);
        }
    }).catch(reason => {
        console.log(reason);
        message.error(reason.message);
    });
}

export const onListItemClick = (index: number) => {
    const targetOffsetTop =
        document.getElementById(`space-single-added-text-${index}`)?.offsetTop;

    if (targetOffsetTop === undefined) {
        return;
    }

    document.getElementById("content-added-texts")?.scrollTo({
        top: targetOffsetTop - 100
    });
}