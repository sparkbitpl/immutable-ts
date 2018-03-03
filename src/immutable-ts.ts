export type Immutable<T> = {
    readonly [P in keyof T]: Immutable<T[P]>;
}


export class ImmutableUtils {
    public static setValue<T,K extends keyof T>(obj: Immutable<T>, key: K, val: T[K]): Immutable<T> {
        const copy = new (obj.constructor as { new (): Immutable<T> })();
        (<any>Object).assign(copy, obj);
        (<any>copy)[key] = val;
        return copy;
    }

    public static setValue2<T,K extends keyof T, K2 extends keyof T[K]>(obj: Immutable<T>, key: K, key2: K2, val: T[K][K2]): Immutable<T> {
        const copy = new (obj.constructor as { new (): Immutable<T> })();
        (<any>Object).assign(copy, obj);
        (<any>copy)[key] = ImmutableUtils.setValue(obj[key], key2, val);
        return copy;
    }

    public static setValue3<T,K extends keyof T, K2 extends keyof T[K], K3 extends keyof T[K][K2]>
            (obj: Immutable<T>, key: K, key2: K2, key3:K3, val: T[K][K2][K3]): Immutable<T> {
        const copy = new (obj.constructor as { new (): Immutable<T> })();
        (<any>Object).assign(copy, obj);
        (<any>copy)[key] = ImmutableUtils.setValue2(obj[key], key2, key3, val);
        return copy;
    }

    public static setValue4<T,K extends keyof T, K2 extends keyof T[K], K3 extends keyof T[K][K2], K4 extends keyof T[K][K2][K3]>
            (obj: Immutable<T>, key: K, key2: K2, key3: K3, key4: K4, val: T[K][K2][K3][K4]): Immutable<T> {
        const copy = new (obj.constructor as { new (): Immutable<T> })();
        (<any>Object).assign(copy, obj);
        (<any>copy)[key] = ImmutableUtils.setValue3(obj[key], key2, key3, key4, val);
        return copy;
    }

    public static asImmutable<T>(obj: T): Immutable<T> {
        const copy = new (obj.constructor as { new (): Immutable<T> })();
        (<any>Object).assign(copy, obj);
        return copy;
    }
}
