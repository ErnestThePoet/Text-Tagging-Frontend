import type { ValueCheckFn } from "./import-check";
import type { TagItemMetaOption } from "./objects/task";

// 生成单选（单个值，取值限定的标注项）标注项检查方法
export const createSingleChoiceValueCheck:
    (choices: any[]) => ValueCheckFn
    = (choices: any[]) => (
        (x: any) => {
            if (!choices.includes(x)) {
                return {
                    ok: false,
                    msg: `不是[${choices}]之一`
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
    (choices: any[], options?: TagItemMetaOption) => ValueCheckFn
    = (choices: any[], options?: TagItemMetaOption) => (
        (x: any) => {
            if (!Array.isArray(x)) {
                return {
                    ok: false,
                    msg: "不是数组类型"
                }
            }

            if (x.some(u => !choices.includes(u))) {
                return {
                    ok: false,
                    msg: `不是全部由[${choices}]中的选项组成`
                }
            }

            if (options?.minCount !== undefined
                && x.length < options.minCount) {
                return {
                    ok: false,
                    msg: "元素数量过少"
                }
            }

            if (options?.maxCount !== undefined
                && x.length > options.maxCount) {
                return {
                    ok: false,
                    msg: "元素数量过多"
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
    (options?: TagItemMetaOption) => ValueCheckFn
    = (options?: TagItemMetaOption) => (
        (x: any) => {
            if (options?.type !== undefined
                && typeof (x) !== options.type[0]) {
                return {
                    ok: false,
                    msg: "元素类型不是" + options.type[0]
                }
            }

            return {
                ok: true,
                msg: ""
            }
        }
    );

// 生成多元素标注项检查方法
export const createMultipleElementCheck:
    (options?: TagItemMetaOption) => ValueCheckFn
    = (options?: TagItemMetaOption) => (
        (x: any) => {
            if (!Array.isArray(x)) {
                return {
                    ok: false,
                    msg: "不是数组类型"
                }
            }

            if (options?.minCount !== undefined
                && x.length < options.minCount) {
                return {
                    ok: false,
                    msg: "元素数量过少"
                }
            }

            if (options?.maxCount !== undefined
                && x.length > options.maxCount) {
                return {
                    ok: false,
                    msg: "元素数量过多"
                }
            }

            if (!options?.allowDuplicate
                && x.some(u => x.filter(v => u === v).length > 1)) {
                return {
                    ok: false,
                    msg: "包含重复元素"
                }
            }

            if (options?.type !== undefined) {
                if ((options.type.length === 1
                    && x.some(u => typeof (u) !== options.type![0]))
                    || (options.type.length > 1
                        && x.some((u, i) => typeof (u) !== options.type![i]))) {
                    return {
                        ok: false,
                        msg: "元素类型不符合要求"
                    }
                }
            }

            return {
                ok: true,
                msg: ""
            }
        }
    );