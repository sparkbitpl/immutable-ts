export type ImmutableWrapper<T> = T extends any[] ? ReadonlyArray<Immutable<T[0]>> : Immutable<T>;

export type Immutable<T> = {
    readonly [P in keyof T]: ImmutableWrapper<T[P]>;

}

export type PropOrIndex<T> = T extends any[] ? number : keyof T;

export type ProxyWrapper<T, P, R> = T extends any[] ? ArrayProxy<T, P, R> : string extends keyof T ? DictProxy<T, P, R> : Proxy<T, P, R>;

export class Proxy<T, P, R> {

    constructor(protected proxied: Immutable<T>, protected parentProxy: Proxy<P, any, R>, protected prop: any) {}
    public at<K extends PropOrIndex<T>>(prop: K): ProxyWrapper<T[K & keyof T], T, R> {
        if (Array.isArray(this.proxied[<any>prop])) {
            return <any> new ArrayProxy(<any>this.proxied[<any>prop], this, prop);
        }
        return <any> new Proxy(<any>this.proxied[<any>prop], this, prop);
    }
    public set<K extends PropOrIndex<T>>(prop: K, val: ImmutableWrapper<T[K & keyof T]>): Immutable<R> {
        const copy = new (this.proxied.constructor as { new (): Immutable<T> })();
        (<any>Object).assign(copy, this.proxied);
        (<any>copy)[prop] = val;
        return this.plugInObject(copy);
    }

    protected plugInObject(copy: any): Immutable<R> {
        if (this.parentProxy == null) {
            return copy;
        }
        return this.parentProxy.set(this.prop, copy);
    }
}

export class ArrayProxy<T, P, R> extends Proxy<T, P, R> {
    public unshift(...elements: (T | Immutable<T>)[]): Immutable<R> {
        const copy = [...(<any>this.proxied as Array<any>)];
        copy.unshift(...elements);
        return this.plugInObject(copy);
    }

    public remove(index: number, count: number): Immutable<R> {
        const copy = [...(<any>this.proxied as Array<any>)];
        copy.splice(index, count);
        return this.plugInObject(copy);
    }
}

export class DictProxy<T, P, R> extends Proxy<T, P, R> {
    public del(): void {

    }
}

export class ImmutableUtils {
    public static asImmutable<T>(obj: T): Immutable<T> {
        const copy = new (obj.constructor as { new (): Immutable<T> })();
        (<any>Object).assign(copy, obj);
        return copy;
    }

    public static update<T>(obj: Immutable<T>): Proxy<T, never, T> {
        return new Proxy(obj, null, null);
    }
}