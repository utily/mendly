// The MIT License (MIT)
//
// Copyright (c) 2018 Simon Mika
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
	private constructor(private readonly get: () => Enumerator<T>) {
	}
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
		return isIterable(get) ? new Enumerable(() => new Enumerator(get[Symbol.iterator]())) : new Enumerable(() => {
				const r = get()
				return r instanceof Enumerator ? r as Enumerator<T> : new Enumerator(r)
			})
	}
	static readonly empty = Enumerable.from([])
}
