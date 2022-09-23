import axios from "axios";
import { message } from "antd";
import type { UploadProps } from "antd";
import APIS from "../../modules/apis";
import userData from "../../states/user-data";
import taskData from "../../states/task-data";

export const updateDatasetStat = (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    taskData.updateDatasetStat(
        () => { setLoading(true); },
        () => { setLoading(false); });
}

export const uploadProps: UploadProps = {
    customRequest: (options) => {
        
    }
};