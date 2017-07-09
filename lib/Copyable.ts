// Copyable.ts
// Provide base class and copy method for conveniently creating new objects
// as modified copies of originals.  Intended to be used with immutable type.

export abstract class Copyable<T> {
  public copy(props?: Partial<T>): T {
    const pdm: PropertyDescriptorMap = {};
    Object.getOwnPropertyNames(this).forEach( (name) => {
      let pd = Object.getOwnPropertyDescriptor(this, name);
      if (props && typeof props[name] !== "undefined") {
        pd.value = props[name];
      }
      pdm[name] = pd;
    });
    return Object.create(Object.getPrototypeOf(this), pdm);
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
      return obj.copy(props);
    },
  };
}
