import { UserLevel } from "../objects/types";

export const getUserLevelLabel = (level: UserLevel) => {
    switch (level) {
        case 0:
            return "普通";
        case 1:
            return "管理员";
        default:
            return "N/A";
    }
}