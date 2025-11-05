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

import * as Uri from "../Uri"
import { Writer } from "./Writer"
import { Enumerator } from "../Utilities"

export class StringWriter extends Writer {
	private content = ""
	get result(): string { return this.content }
	readonly writable = true
	readonly autoFlush = true
	readonly opened = true
	private constructor(readonly resource: Uri.Locator) {
		super()
	}
	protected async writeImplementation(buffer: Enumerator<string>): Promise<boolean> {
		this.content += buffer.reduce((r, item) => r + item, "")
		return true
	}
	async flush(): Promise<boolean> {
		return true
	}
	async close(): Promise<boolean> {
		return true
	}
	static create(resource?: Uri.Locator): Writer {
		return new StringWriter(resource || Uri.Locator.empty)
	}
}
