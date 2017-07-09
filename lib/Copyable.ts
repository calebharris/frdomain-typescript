// Copyable.ts
// Provide base class and copyWith method for conveniently creating new objects
// as modified copies of originals.  Intended to be used with immutable type.

type _MutableInner<T extends { [x: string]: any }, K extends string> = {
  [P in K]: T[P];
};

type Mutable<T> = _MutableInner<T, keyof T>;

export abstract class Copyable<T> {
  // We need the subtype to tell us how to make a copy, because there is no
  // general algorithm to map object properties to positional parameters in
  // the constructor, outside of some truly ugly function.toString() parsing
  public abstract copy(): T;

  public copyWith(props: Partial<T>): T {
    // Temporarily consider the copy mutable in order to apply the passed-in
    // property overrides
    const c = this.copy() as Mutable<T>;
    let k: keyof T;
    for (k in props) {
      if (typeof props[k] !== "undefined") {
        c[k] = props[k]!;
      }
    }
    return c as T;
  }
}

export interface ILens<O, V> {
  get(obj: O): V;
  set(obj: O, value: V): O;
}

export function Lens<T extends Copyable<T>>(prop: keyof T): ILens<T, T[keyof T]> {
  return {
    get: (obj: T) => {
      return obj[prop];
    },
    set: (obj: T, value: T[keyof T]) => {
      const props: Partial<T> = {};
      props[prop] = value;
      return obj.copyWith(props);
    },
  };
}
