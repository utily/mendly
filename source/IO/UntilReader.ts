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

import * as Uri from "../Uri"
import * as Error from "../Error"
import { Reader } from "./Reader"
import { BufferedReader } from "./BufferedReader"

export class UntilReader extends Reader {
	private done = -1
	private backend: BufferedReader
	get readable(): boolean { return this.backend.readable }
	get opened(): boolean { return !this.done && this.backend.opened }
	private async isEmptyHelper(): Promise<boolean> { return this.done == 0 || this.backend.isEmpty }
	get isEmpty(): Promise<boolean> { return this.isEmptyHelper() }
	get resource(): Uri.Locator { return this.backend.resource }
	get location(): Error.Location { return this.backend.location }
	get region(): Error.Region { return this.backend.region }
	private constructor(backend: Reader, private endMark: string | string[]) {
		super()
		this.backend = backend instanceof BufferedReader ? backend : BufferedReader.create(backend)
		const peeked = this.backend.peekIs(this.endMark)
		if (peeked)
			this.done = peeked.length
	}
	close(): Promise<boolean> {
		const result = this.done > 0
		if (result)
			this.done = 0
		return Promise.resolve(result)
	}
	read(): string | undefined {
		let result: string | undefined
		if (this.done != 0) {
			result = this.backend.read()
			let peeked: string | undefined
			if (this.done > 0)
				this.done--
			else if (peeked = this.backend.peekIs(this.endMark))
				this.done = peeked.length
		}
		return result
	}
	mark(): Error.Region { return this.backend.mark() }
	static create(backend: undefined, endMark?: string | string[]): undefined
	static create(backend: Reader, endMark?: string | string[]): Reader
	static create(backend: Reader | undefined, endMark?: string | string[]): Reader | undefined {
		return backend && endMark ? new UntilReader(backend, endMark) : backend
	}
}
