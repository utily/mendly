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

import { Iterator, ArrayIterator } from "../Utilities"
import { OutDevice } from "./OutDevice"

export abstract class Writer extends OutDevice {
	newLineSymbol = "\n"
	async write(message: string | string[] | Iterator<string>): Promise<boolean> {
		return message instanceof Iterator ? this.writeImplementation(message) :
			message instanceof Array ? this.writeImplementation(new ArrayIterator(message)) :
			this.writeImplementation(new ArrayIterator([message]))
	}
	async writeLine(message: string | string[] | Iterator<string>): Promise<boolean> {
		return message instanceof Iterator ? this.writeImplementation(message.append(this.newLineSymbol)) :
			message instanceof Array ? this.writeImplementation(new ArrayIterator([...message, this.newLineSymbol])) :
			this.writeImplementation(new ArrayIterator([message, this.newLineSymbol]))
	}
	protected abstract writeImplementation(buffer: Iterator<string>): Promise<boolean>
	private static openers: { open: ((path: string, extension: string) => Writer | undefined), priority: number }[] = []
	static addOpener(open: (path: string, extension: string) => Writer | undefined, priority?: number) {
		if (!priority)
			priority = 0
		Writer.openers.push({ open, priority})
		Writer.openers = Writer.openers.sort((left, right) => right.priority - left.priority)
	}
	static open(path: string, extension: string): Writer | undefined {
		let result: Writer | undefined
		let i = 0
		do
			result = Writer.openers[i++].open(path, extension)
		while (!result && i < Writer.openers.length)
		return result
	}
}
