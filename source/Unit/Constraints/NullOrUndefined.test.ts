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

import { Fixture } from "../Fixture"
import { Is } from "../Is"

export class NullOrUndefinedTest extends Fixture {
	constructor() {
		super("Unit.Constraints.NullOrUndefined")
		this.add("null or undefined 1", () => {
			this.expect(null, Is.NullOrUndefined())
		})
		this.add("null or undefined 2", () => {
			this.expect(undefined, Is.NullOrUndefined())
		})
		this.add("null or undefined 3", () => {
			var s: string = null
			this.expect(s, Is.NullOrUndefined())
		})
		this.add("null or undefined 4", () => {
			var s: string = undefined
			this.expect(s, Is.NullOrUndefined())
		})
		this.add("null or undefined 5", () => {
			var s: string = ""
			this.expect(s, Is.Not().NullOrUndefined())
		})
	}
}
Fixture.add(new NullOrUndefinedTest())
