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

export class NotTest extends Fixture {
	constructor() {
		super("Unit.Constraints.Not")
		this.add("foobar is not null", () => {
			this.expect("foobar", Is.Not().Null())
		})
		this.add("foobar is not equal to moobar", () => {
			this.expect("foobar", Is.Not().Equal().To("moobar"))
		})
		this.add("foo === bar is not true", () => {
			var foo: string = "foo"
			var bar: string = "bar"
			this.expect(foo === bar, Is.Not().True())
		})
		this.add("foo !== bar is not false", () => {
			var foo: string = "foo"
			var bar: string = "bar"
			this.expect(foo !== bar, Is.Not().False())
		})
		this.add("null is not undefined", () => {
			this.expect(null, Is.Not().Undefined())
		})
		this.add("undefined is not null", () => {
			this.expect(undefined, Is.Not().Null())
		})
		this.add("empty string is not null nor undefined", () => {
			this.expect("", Is.Not().NullOrUndefined())
		})
	}
}
Fixture.add(new NotTest())
