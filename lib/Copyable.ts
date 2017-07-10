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

export function Lens<O extends Copyable>(prop: keyof O): ILens<O, O[keyof O]> {
  return {
    get: (obj: O) => {
      return obj[prop];
    },
    set: (obj: O, value: O[keyof O]) => {
      const props: Partial<O> = {};
      props[prop] = value;
      return obj.copy(props);
    },
  };
}

export function Compose<O, I, V>(
  outer: ILens<O, I>,
  inner: ILens<I, V>,
): ILens<O, V> {
  return {
    get: (obj: O) => {
     return inner.get(outer.get(obj));
    },
    set: (obj: O, value: V) => {
      return outer.set(obj, inner.set(outer.get(obj), value));
    },
  };
}
