// The MIT License (MIT)
//
// Copyright (c) 2016 Simon Mika
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

function *generate<T>(next: () => T | undefined): Iterator<T> {
	let result: T | undefined
	while ((result = next()) != undefined)
		yield result
}
function isIterator<T>(item: any | Iterator<T>): item is Iterator<T> {
	return (item as Iterator<T>).next instanceof Function
}
function* merge<T>(left: Iterator<T>, right: T | Iterator<T>): Iterator<T> {
	let result: IteratorResult<T>
	while (!(result = left.next()).done)
		yield result.value
	if (isIterator(right))
		while (!(result = right.next()).done)
			yield result.value
	else
		yield right
}
export class Enumerator<T> implements Iterator<T> {
	private readonly iterator: Iterator<T>
	get length(): number {
		let result = 0
		while (!this.next().done)
			result++
		return result
	}
	get last(): T | undefined {
		const next = this.next()
		return next.done ? undefined : this.last || next.value
	}
	constructor(backend: (() => T | undefined) | Iterator<T>) {
		this.iterator = backend instanceof Function ? generate(backend) : backend
	}
	fetch(): T | undefined {
		const result = this.next()
		return result.done ? undefined : result.value
	}
	next(value?: any): IteratorResult<T> {
		return this.iterator.next(value)
	}
	append(item: T | Iterator<T>): Enumerator<T> {
		return new Enumerator(merge(this, item))
	}
	map<S>(mapping: (item: T) => S): Enumerator<S> {
		return new Enumerator<S>(() => {
			const item = this.fetch()
			return (item != undefined) ? mapping(item) : undefined })
	}
	reduce<S>(reduce: (result: S, item: T) => S, result: S): S {
		const item = this.fetch()
		return item ? this.reduce(reduce, reduce(result, item)) : result
	}
	apply(apply: (item: T) => void): void {
		const item = this.fetch()
		if (item) {
			apply(item)
			this.apply(apply)
		}
	}
	filter(filter: (item: T) => boolean): Enumerator<T> {
		return new Enumerator<T>(() => {
			let item: T | undefined
			do
				item = this.fetch()
			while (item != undefined && !filter(item))
			return item
		})
	}
	toArray(): T[] {
		const item = this.fetch()
		let result: T[]
		if (!item)
			result = []
		else {
			result = this.toArray()
			result.unshift(item)
		}
		return result
	}
	static from<T>(backend: (() => T | undefined) | Iterator<T>): Enumerator<T> {
		return new Enumerator(backend)
	}
	static readonly empty = Enumerator.from(() => undefined as never)
}
