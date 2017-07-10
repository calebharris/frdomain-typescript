// Copyable.ts
// Provide base class and copy method for conveniently creating new objects
// as modified copies of originals.  Intended to be used with immutable type.
export abstract class Copyable {
  public copy(props?: Partial<this>): this {
    const pdm = Object.getOwnPropertyNames(this).reduce(
      (map, name) => {
        const pd = Object.getOwnPropertyDescriptor(this, name);
        if (props && typeof props[name] !== "undefined") {
          pd.value = props[name];
        }
        map[name] = pd;
        return map;
      },
      {} as PropertyDescriptorMap);
    return Object.create(Object.getPrototypeOf(this), pdm);
  }
}

export interface ILens<O, V> {
  get(obj: O): V;
  set(obj: O, value: V): O;
}

export function Lens<T extends Copyable>(prop: keyof T): ILens<T, T[keyof T]> {
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
