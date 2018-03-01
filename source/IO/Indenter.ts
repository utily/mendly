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

import { Writer } from "./Writer"
import { Iterator } from "../Utilities"

export class Indenter extends Writer {
	get writable(): boolean { return this.backend.writable }
	autoFlush: boolean = true
	indentionSymbol = "\t"
	private indentionCount = 0
	constructor(private readonly backend: Writer) {
		super()
	}
	increase(): boolean {
		this.indentionCount++
		return true
	}
	decrease(): boolean {
		this.indentionCount--
		return this.indentionCount >= 0
	}
	protected writeImplementation(buffer: Iterator<string>): Promise<boolean> {
		let item: string | undefined
		const result: Promise<boolean>[] = []
		while (item = buffer.next())
			result.push(this.backend.write(item.replace(this.newLineSymbol, this.indentionSymbol.repeat(this.indentionCount) + this.newLineSymbol)))
		return Promise.all(result).then(r => r.reduce((previous, current) => previous && current, true))
	}
	flush(): Promise<boolean> {
		return this.backend.flush()
	}
}
