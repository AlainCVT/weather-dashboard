type EntriesOfUnion<T> = T extends T ? [keyof T, T[keyof T]] : never
type KeysOfUnion<T> = T extends T ? keyof T : never
type ValuesOfUnion<T> = T extends T ? T[keyof T] : never

type ValueOf<T> = T[keyof T]

interface ObjectConstructor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fromEntries<K extends PropertyKey, T = any>(
    entries: Iterable<readonly [K, T]>,
  ): { [k in K]: T }
  entries<O extends object>(o: O): EntriesOfUnion<O>[]
  keys<O extends object>(o: O): KeysOfUnion<O>[]
  values<O extends object>(o: O): ValuesOfUnion<O>[]
}
