import axios from "axios";
import APIS from "../../modules/apis";
import userData from "../../states/user-data";
import taskData from "../../states/task-data";
import ui from "../../states/ui";

export const updateDatasetStat = (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    taskData.updateDatasetStat(
        () => { setLoading(true); },
        () => { setLoading(false); });
}