import { Enumerator } from "./Enumerator"
function isIterable<T>(other: any): other is Iterable<T> {
	return other == null ? false : typeof other[Symbol.iterator] === "function"
}
export class Enumerable<T> implements Iterable<T> {
	get length(): number {
		return this.get().length
	}
	get first(): T | undefined {
		return this.get().fetch()
	}
	get last(): T | undefined {
		return this.get().last
	}
	private constructor(private readonly get: () => Enumerator<T>) {}
	getEnumerator(): Enumerator<T> {
		return new Enumerator(this.get())
	}
	[Symbol.iterator](): Iterator<T> {
		return this.getEnumerator()
	}
	append(item: T | Iterator<T>): Enumerable<T> {
		return new Enumerable(() => this.get().append(item))
	}
	map<S>(mapping: (item: T) => S): Enumerable<S> {
		return new Enumerable(() => this.get().map(mapping))
	}
	reduce<S>(reduce: (result: S, item: T) => S, result: S): S {
		return this.get().reduce(reduce, result)
	}
	apply(apply: (item: T) => void): void {
		this.get().apply(apply)
	}
	filter(filter: (item: T) => boolean): Enumerable<T> {
		return new Enumerable(() => this.get().filter(filter))
	}
	toArray(): T[] {
		return this.getEnumerator().toArray()
	}
	static from<T>(get: (() => Iterator<T>) | Iterable<T> | T[]): Enumerable<T> {
		return isIterable(get)
			? new Enumerable(() => new Enumerator(get[Symbol.iterator]()))
			: new Enumerable(() => {
					const r = get()
					return r instanceof Enumerator ? (r as Enumerator<T>) : new Enumerator(r)
			  })
	}
	static readonly empty = Enumerable.from([])
}
