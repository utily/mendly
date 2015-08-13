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

/// <reference path="Iterator" />

module U10sil.Utilities {
	export class BufferedIterator<T> implements Iterator<T> {
		_buffer: T[]
		constructor(private _backend: Iterator<T>) {
		}
		peek(position: number = 0): IteratorResult<T> {
			var next: IteratorResult<T> = { done: true }
			while (position > this._buffer.length - 1 && !(next = this._backend.next()).done) {
				this._buffer.push(next.value)
			}
			return position > this._buffer.length - 1 ? { done: true } : { done: false, value: this._buffer[position] }
		}
		next(): IteratorResult<T> {
			var result = this.peek(0)
			if (this._buffer.length > 1) {
				this._buffer.slice()
			}
			return result
		}
	}
}
