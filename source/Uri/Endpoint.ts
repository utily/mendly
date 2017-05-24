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

export class Endpoint {
	get isEmpty() {
		return this.host.length == 0 && !this.port
	}
	constructor(readonly host: string[] = [], readonly port?: number) {
	}
	toString(): string {
		let result = this.host.join(".")
		if (this.port)
			result += ":" + this.port.toString()
		return result
	}
	static parse(data?: string): Endpoint {
		let result: Endpoint
		if (data) {
			const splitted = data.split(":", 2)
			result = new Endpoint(splitted[0].split("."), splitted.length > 1 ? parseInt(splitted[1]) : undefined)
		} else
			result = new Endpoint()
		return result
	}
}
