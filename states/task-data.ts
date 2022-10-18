import { makeAutoObservable } from "mobx";
import axios from "axios";
import userData from "./user-data";
import APIS from "../modules/apis";
import { message } from "antd";
import type { TagItemMeta } from "../modules/objects/task";
import * as IMPORT_CHECK_FNS from "../modules/import-check-fns";
import * as TAGGING_CHECK_FNS from "../modules/tagging-check-fns";
import uiState from "./ui-state";

export interface SingleDatasetStat{
    fileName: string;
    totalTextCount: number;
    totalTagItemCount: number;
    taggedTextCount: number;

    taggedTextProgress: number;
    totalTagItemProgress: number;
}

export interface CheckResult { ok: boolean; msg: string; }

export type TagItemImportValueCheckFn = (x: any) => CheckResult;
export type TagItemTaggingValueCheckFn = (x: string[]) => CheckResult;

interface SingleTagItemTaggingValidation{
    id: number;
    valueCheck: TagItemTaggingValueCheckFn;
}

export interface TagItemImportValidation {
    // 标注项数量
    tagItemCount: number;
    // 各标注项名称与取值检查方法
    tagItemMetas: Array<{
        name: string;
        valueCheck: TagItemImportValueCheckFn;
    }>
}

const getTagItemTaggingValidations = (tagItemMetas: TagItemMeta[]) => {
    const validation: SingleTagItemTaggingValidation[] = [];

    for (const i of tagItemMetas) {
        let valueCheck: TagItemTaggingValueCheckFn;
        switch (i.type) {
            case 0:
                valueCheck = TAGGING_CHECK_FNS.createSingleChoiceValueCheck(
                    i.choices!.map(x => x.internal)
                );
                break;
            case 1:
                valueCheck = TAGGING_CHECK_FNS.createMultipleChoiceValueCheck(
                    i.choices!.map(x => x.internal),
                    i.options
                );
                break;
            case 2:
                valueCheck = TAGGING_CHECK_FNS.createSingleElementCheck(i.options);
                break;
            case 3:
                valueCheck = TAGGING_CHECK_FNS.createMultipleElementCheck(i.options);
                break;
            default:
                valueCheck = (x: string[]) => ({ ok: false, msg: "标注项类型不受支持" });
                break;
        }

        validation.push({
            id: i.id,
            valueCheck
        });
    }

    return validation;
}

const getTagItemImportValidation = (tagItemMetas:TagItemMeta[]) => {
    const validation: TagItemImportValidation = {
        tagItemCount: tagItemMetas.length,
        tagItemMetas: []
    };

    for (const i of tagItemMetas) {
        let valueCheck: TagItemImportValueCheckFn;
        switch (i.type) {
            case 0:
                valueCheck = IMPORT_CHECK_FNS.createSingleChoiceValueCheck(
                    i.choices!.map(x => x.external)
                );
                break;
            case 1:
                valueCheck = IMPORT_CHECK_FNS.createMultipleChoiceValueCheck(
                    i.choices!.map(x => x.external),
                    i.options
                );
                break;
            case 2:
                valueCheck = IMPORT_CHECK_FNS.createSingleElementCheck(i.options);
                break;
            case 3:
                valueCheck = IMPORT_CHECK_FNS.createMultipleElementCheck(i.options);
                break;
            default:
                valueCheck = (x: any) => ({ ok: false, msg: "标注项类型不受支持" });
                break;
        }

        validation.tagItemMetas.push({
            name: i.name,
            valueCheck
        });
    }

    return validation;
}

class TaskData{
    constructor() {
        makeAutoObservable(this);
    }

    // 任务ID
    taskId: number = -1;
    // 任务名称
    name: string = "";
    // 任务中每个文本的目标标注数量
    targetTagsPerText: number = 0;
    // 标注项元数据
    tagItemMetas: TagItemMeta[] = [];
    // 标注项ID-标注项元数据映射表
    idMetaMap: { [id: number]: TagItemMeta } = {};
    // 标注项名称-标注项元数据映射表
    nameMetaMap: { [name: string]: TagItemMeta } = {};

    // 导入标注项对象验证器列表
    importValidation: TagItemImportValidation = {
        tagItemCount: 0,
        tagItemMetas: []
    };

    // 标注标注项对象验证器列表
    taggingValidations: SingleTagItemTaggingValidation[] = [];
    // 标注项ID-标注项验证器映射表
    idTaggingValidationMap: { [id: number]: SingleTagItemTaggingValidation } = {};

    // 数据库统计信息
    // 其中第一个元素为全库统计
    datasetStats: SingleDatasetStat[] = [{
        fileName: "",
        totalTextCount: 0,
        totalTagItemCount: 0,
        taggedTextCount: 0,
            
        taggedTextProgress: 0,
        totalTagItemProgress: 0
    }];

    get tagItemCount(): number{
        return this.tagItemMetas.length;
    }

    setTaskId(taskId: number) {
        this.taskId = taskId;
    }

    setName(name: string) {
        this.name = name;
    }

    setTargetTagsPerText(targetTagsPerText: number) {
        this.targetTagsPerText = targetTagsPerText;
    }

    setTagItemMetas(tagItemMetas: TagItemMeta[]) {
        this.tagItemMetas = tagItemMetas;
        this.importValidation = getTagItemImportValidation(this.tagItemMetas);
        this.taggingValidations = getTagItemTaggingValidations(this.tagItemMetas);

        // 构建两种标注项元数据的映射表
        this.nameMetaMap = {};
        this.idMetaMap = {};
        for (const i of this.tagItemMetas) {
            this.nameMetaMap[i.name] = i;
            this.idMetaMap[i.id] = i;
        }

        // 构建标注标注项映射表
        for (const i of this.taggingValidations) {
            this.idTaggingValidationMap[i.id] = i;
        }
    }

    updateDatasetStat() {
        if (!userData.isAdmin) {
            return;
        }

        uiState.setIsDatasetStatLoading(true);

        axios.postForm(APIS.getDatasetStat, {
            accessId: userData.accessId,
            taskId: this.taskId
        }).then(res => {
            if (res.data.success) {
                this.datasetStats = res.data.stats;
            }
            else {
                message.error("获取数据库信息失败：" + res.data.msg);
            }
        }).catch(reason => {
            message.error("获取数据库信息失败：" + reason);
            console.log(reason);
        }).finally(() => {
            uiState.setIsDatasetStatLoading(false);
        });
    }
}

export default new TaskData();