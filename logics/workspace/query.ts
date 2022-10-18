import axios from "axios";
import APIS from "../../modules/apis";
import queryData from "../../states/query-data";

export const quertTexts = () => {
    if (!queryData.isTagTimeValid) {
        queryData.setResultMsg("限定标注开始时间不能晚于结束时间");
        return;
    }
}