export type ImmutableWrapper<T> = T extends any[] ? ReadonlyArray<Immutable<T[0]>> : Immutable<T>;

export type Immutable<T> = {
    readonly [P in keyof T]: ImmutableWrapper<T[P]>;
}

export type PropOrIndex<T> = T extends any[] ? number : keyof T;

export class Proxy<T, P, R> {

    constructor(private proxied: Immutable<T>, private parentProxy: Proxy<P, any, R>, private prop: any) {}
    public at<K extends PropOrIndex<T>>(prop: K): Proxy<T[K & keyof T], T, R> {
        return new Proxy(<any>this.proxied[<any>prop], this, prop);
    }
    public set<K extends PropOrIndex<T>>(prop: K, val: T[K & keyof T]): Immutable<R> {
        const copy = new (this.proxied.constructor as { new (): Immutable<T> })();
        (<any>Object).assign(copy, this.proxied);
        (<any>copy)[prop] = val;

        if (this.parentProxy == null) {
            return <any>copy;
        }
        return this.parentProxy.set(this.prop, <any>copy);
    }
}

export class ImmutableUtils {
    public static unshift<T>(arr: ReadonlyArray<T>, ...elements: (T | Immutable<T>)[]): ReadonlyArray<T> {
        const copy = [...(arr as Array<any>)];
        copy.unshift(...elements);
        return copy;
    }

    public static removeElements<T>(arr: ReadonlyArray<T>, index: number, toRemove: number): ReadonlyArray<T> {
        const copy = [...(arr as Array<T>)];
        copy.splice(index, toRemove);
        return copy;
    }

    public static asImmutable<T>(obj: T): Immutable<T> {
        const copy = new (obj.constructor as { new (): Immutable<T> })();
        (<any>Object).assign(copy, obj);
        return copy;
    }

    public static update<T>(obj: Immutable<T>): Proxy<T, never, T> {
        return new Proxy(obj, null, null);
    }
}
