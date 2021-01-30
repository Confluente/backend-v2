import {AbstractWebModel} from "../models/web/abstract.web.model";
import {GroupWeb} from "../models/web/group.web.model";

export function copyMatchingSourceKeyValues(target: any, source: any): any {
    if (target.constructor.prototype instanceof AbstractWebModel) {

        const copyable: string[] = target.getCopyable();
        // tslint:disable-next-line:forin
        for (const entry in source) {
            try {
                if (copyable.includes(entry)) {
                    if (source[entry] !== null) {
                        target[entry] = source[entry];
                    }
                }
            }
            finally {}
        }
        return target;
    } else {
        throw new Error("web.model.copy.helper.copyMatchingSourceKeyValues: target class was not a subclass of AbstractWebModel");
    }
}
