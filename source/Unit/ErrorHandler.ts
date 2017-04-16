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

import * as Error from "../Error/Handler"
import * as IO from "../IO/BufferedReader"

export class ErrorHandler implements Error.Handler {
	constructor(private errorHandler: Error.Handler, private region: Error.Region) {
	}
	raise(message: string | Error.Message, level?: Error.Level, type?: Error.Type, region?: Error.Region): void {
		if (!level)
			level = Error.Level.Recoverable
		if (!type)
			type = Error.Type.SelfTest
		if (!(message instanceof Error.Message)) {
			if (!region)
				region = this.region
			message = new Error.Message(<string>message, level, type, region)
		}
		this.errorHandler.raise(<Error.Message>message)
	}
}
