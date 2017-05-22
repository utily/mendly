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

import * as Error from "../Error"

export abstract class Reader {
	abstract get isEmpty(): boolean
	abstract get resource(): string
	abstract get location(): Error.Location
	abstract get region(): Error.Region
	abstract read(): string
	abstract mark(): Error.Region
	private static openers: { open: ((path: string, extension: string) => Reader), priority: number }[] = []
	static addOpener(open: (path: string, extension: string) => Reader, priority?: number) {
		if (!priority)
			priority = 0
		Reader.openers.push({ open: open, priority: priority})
		Reader.openers = Reader.openers.sort((left, right) => right.priority - left.priority)
	}
	static open(path: string, extension: string): Reader {
		var result: Reader
		var i = 0
		do
			result = Reader.openers[i++].open(path, extension)
		while (!result && i < Reader.openers.length)
		return result
	}
}
