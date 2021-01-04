
export function copyMatchingSourceKeyValues(target: any, source: any): any {
    Object.keys(source).forEach(key => {
        if (target[key].constructor === source[key].constructor) {
            target[key] = source[key];
        }
    });

    return target;
}
