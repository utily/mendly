function* generate<T>(next: () => T | undefined): Iterator<T> {
	let result: T | undefined;
	while ((result = next()) != undefined) yield result;
}
function isIterator<T>(item: any | Iterator<T>): item is Iterator<T> {
	return (item as Iterator<T>).next instanceof Function;
}
function* merge<T>(left: Iterator<T>, right: T | Iterator<T>): Iterator<T> {
	let result: IteratorResult<T>;
	while (!(result = left.next()).done) yield result.value;
	if (isIterator(right))
		while (!(result = right.next()).done) yield result.value;
	else yield right;
}
export class Enumerator<T> implements Iterator<T> {
	private readonly iterator: Iterator<T>;
	get length(): number {
		let result = 0;
		while (!this.next().done) result++;
		return result;
	}
	private nextValue: IteratorResult<T> | undefined;
	get last(): T | undefined {
		return this.nextValue && !this.nextValue.done
			? this.nextValue.value
			: undefined;
	}
	constructor(backend: (() => T | undefined) | Iterator<T>) {
		this.iterator = backend instanceof Function ? generate(backend) : backend;
	}
	fetch(): T | undefined {
		const result = this.next();
		return result.done ? undefined : result.value;
	}
	next(value?: any): IteratorResult<T> {
		return (this.nextValue = this.iterator.next(value));
	}
	append(item: T | Iterator<T>): Enumerator<T> {
		return new Enumerator(merge(this, item));
	}
	map<S>(mapping: (item: T) => S): Enumerator<S> {
		return new Enumerator<S>(() => {
			const item = this.fetch();
			return item != undefined ? mapping(item) : undefined;
		});
	}
	reduce<S>(reduce: (result: S, item: T) => S, result: S): S {
		const item = this.fetch();
		return item ? this.reduce(reduce, reduce(result, item)) : result;
	}
	apply(apply: (item: T) => void): void {
		const item = this.fetch();
		if (item) {
			apply(item);
			this.apply(apply);
		}
	}
	filter(filter: (item: T) => boolean): Enumerator<T> {
		return new Enumerator<T>(() => {
			let item: T | undefined;
			do item = this.fetch();
			while (item != undefined && !filter(item));
			return item;
		});
	}
	toArray(): T[] {
		const item = this.fetch();
		let result: T[];
		if (!item) result = [];
		else {
			result = this.toArray();
			result.unshift(item);
		}
		return result;
	}
	static from<T>(backend: (() => T | undefined) | Iterator<T>): Enumerator<T> {
		return new Enumerator(backend);
	}
	static readonly empty = Enumerator.from(() => undefined as never);
}
