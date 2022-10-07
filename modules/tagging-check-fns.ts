import type { TagItemTaggingValueCheckFn } from "../states/task-data";
import type { TagItemMetaOption } from "./objects/task";

// 生成单选（单个值，取值限定的标注项）标注项检查方法
export const createSingleChoiceValueCheck:
    (choices: any[]) => TagItemTaggingValueCheckFn
    = (choices: any[]) => (
        (x: string[]) => {
            
            if (x.some(u => !choices.includes(u))) {
                return {
                    ok: false,
                    msg: "包含非法选项"
                }
            }

            return {
                ok: true,
                msg: ""
            }
        }
    );

// 生成多选（多个值，取值限定的标注项）标注项检查方法
export const createMultipleChoiceValueCheck:
    (choices: any[], options?: TagItemMetaOption) => TagItemTaggingValueCheckFn
    = (choices: any[], options?: TagItemMetaOption) => (
        (x: string[]) => {
            if (x.some(u => !choices.includes(u))) {
                return {
                    ok: false,
                    msg: "包含非法选项"
                }
            }

            if (options?.minCount !== undefined
                && x.length < options.minCount) {
                return {
                    ok: false,
                    msg: `至少选择${options.minCount}个`
                }
            }

            if (options?.maxCount !== undefined
                && x.length > options.maxCount) {
                return {
                    ok: false,
                    msg: `至多选择${options.maxCount}个`
                }
            }

            if (!options?.allowDuplicate &&
                x.some(u => x.filter(v => u === v).length > 1)) {
                return {
                    ok: false,
                    msg: "包含重复元素"
                }
            }

            return {
                ok: true,
                msg: ""
            }
        }
    );

// 生成单元素（单个值，取值不限定的标注项）标注项检查方法
export const createSingleElementCheck:
    (options?: TagItemMetaOption) => TagItemTaggingValueCheckFn
    = (options?: TagItemMetaOption) => (
        (x: string[]) => {
            return {
                ok: true,
                msg: ""
            }
        }
    );

// 生成多元素标注项检查方法
export const createMultipleElementCheck:
    (options?: TagItemMetaOption) => TagItemTaggingValueCheckFn
    = (options?: TagItemMetaOption) => (
        (x: string[]) => {
            if (options?.minCount !== undefined
                && x.length < options.minCount) {
                return {
                    ok: false,
                    msg: `至少选择${options.minCount}个`
                }
            }

            if (options?.maxCount !== undefined
                && x.length > options.maxCount) {
                return {
                    ok: false,
                    msg: `至多选择${options.maxCount}个`
                }
            }

            if (!options?.allowDuplicate
                && x.some(u => x.filter(v => u === v).length > 1)) {
                return {
                    ok: false,
                    msg: "包含重复元素"
                }
            }

            return {
                ok: true,
                msg: ""
            }
        }
    );