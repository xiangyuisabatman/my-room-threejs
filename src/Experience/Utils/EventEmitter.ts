interface Callbacks {
    base: Object;
    [key: string]: any;
}
interface NewName {
    original: string;
    value: string;
    namespace: string;
}
export default class {
    callbacks: Callbacks;
    constructor() {
        this.callbacks = {
            base: {},
        };
    }

    /**
     * 挂载
     * @param _names
     * @param callback
     * @returns
     */
    on(_names: string, callback: Function) {
        if (typeof _names === 'undefined' || _names === '') {
            console.warn('wrong names');
            return false;
        }

        if (typeof callback === 'undefined') {
            console.warn('wrong callback');
            return;
        }

        const names = this.resolveNames(_names);

        names.forEach((_name) => {
            // 格式化name
            const name = this.resolveName(_name);

            // 如果namespace不存在，则创建空对象
            if (!(this.callbacks[name.namespace] instanceof Object)) {
                this.callbacks[name.namespace] = {};
            }
            // 如果callback不存在，则创建空数组
            if (
                !(this.callbacks[name.namespace][name.value] instanceof Array)
            ) {
                let newArray: Function[] = [];
                this.callbacks[name.namespace][name.value] = newArray;
            }

            this.callbacks[name.namespace][name.value].push(callback);
        });
    }

    /**
     * 卸载
     * @param _names
     * @returns
     */
    off(_names: string) {
        if (typeof _names === 'undefined' || _names === '') {
            console.warn('wrong name');
            return;
        }

        const names = this.resolveNames(_names);

        names.forEach((_names) => {
            const name = this.resolveName(_names);

            if (name.namespace !== 'base' && name.value === '') {
                delete this.callbacks[name.namespace];
            } else {
                if (name.namespace === 'base') {
                    for (const namespace in this.callbacks) {
                        delete this.callbacks[namespace][name.value];
                        if (
                            Object.keys(this.callbacks[namespace]).length === 0
                        ) {
                            delete this.callbacks[namespace];
                        }
                    }
                } else if (this.callbacks[name.namespace] instanceof Object) {
                    delete this.callbacks[name.namespace][name.value];

                    if (Object.keys(this.callbacks[name.namespace]).length) {
                        delete this.callbacks[name.namespace];
                    }
                }
            }
        });

        return this;
    }

    /**
     * 通知
     * @param _name
     * @param _args
     * @returns
     */
    emit(_name: string, _args?: any[] | string) {
        if (typeof _name === 'undefined' || _name === '') {
            console.warn('wrong name');
            return;
        }

        let finalResult: any = null;
        let result: any = null;

        const args = !(_args instanceof Array) ? [] : _args;

        let name = this.resolveName(this.resolveNames(_name)[0]);

        if (name.namespace === 'base') {
            for (const namespace in this.callbacks) {
                if (
                    this.callbacks[namespace] instanceof Object &&
                    this.callbacks[namespace][name.value] instanceof Array
                ) {
                    this.callbacks[namespace][name.value].forEach(
                        (callback: Function) => {
                            result = callback.apply(this, args);
                            if (typeof finalResult === 'undefined') {
                                finalResult = result;
                            }
                        }
                    );
                }
            }
        } else if (this.callbacks[name.namespace] instanceof Object) {
            if (name.value === '') {
                console.warn('wrong name');
                return;
            }

            this.callbacks[name.namespace][name.value].forEach(
                (callback: Function) => {
                    result = callback.apply(this, args);
                    if (typeof finalResult === 'undefined') {
                        finalResult = result;
                    }
                }
            );
        }

        return finalResult;
    }

    /**
     * 处理name
     * 1. 清除所有不为字母数字空格逗号斜杠点
     * 2. 清除掉所有,/
     */
    resolveNames(_names: string): string[] {
        let names: string[] = _names
            .replace(/[^a-zA-Z0-9 ,/.]/g, '')
            .replace(/[,/]+/g, '')
            .split(' ');
        return names;
    }
    resolveName(name: string): NewName {
        const newName: NewName = {
            original: '',
            value: '',
            namespace: 'base',
        };
        const parts: string[] = name.split('.');

        newName.original = name;
        newName.value = parts[0];
        newName.namespace = 'base';

        if (parts.length > 1 && parts[1] !== '') {
            newName.namespace = parts[1];
        }

        return newName;
    }
}
