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

export class CompareConstraintTest extends Fixture {
	constructor() {
		super("Unit.Constraints.CompareConstraint")
		this.add("true is true", () => {
			this.expect(true, Is.equal.to(true))
		})
		this.add("false is false", () => {
			this.expect(false, Is.equal.to(false))
		})
		this.add("null equals null", () => {
			this.expect(null, Is.equal.to(null))
		})
		this.add("undefined equals undefined", () => {
			this.expect(undefined, Is.equal.to(undefined))
		})
		this.add("\"foo\" equals \"foo\"", () => {
			this.expect("foo", Is.equal.to("foo"))
		})
		this.add("empty object equals empty object", () => {
			this.expect({}, Is.equal.to({}))
		})
		this.add("object equals object", () => {
			this.expect({ meaning: 42, other: 13.37 }, Is.equal.to({ meaning: 42, other: 13.37 }))
		})
		this.add("object not equals object", () => {
			this.expect({ meaning: 42, other: 13.37 }, Is.not.equal.to({ meaning: 42, other: 1337 }))
		})
		this.add("object equals object with undefined property", () => {
			this.expect({ meaning: 42, other: 13.37 }, Is.equal.to({ meaning: 42, other: 13.37, not: undefined }))
		})
		this.add("empty array equals empty array", () => {
			this.expect([], Is.equal.to([]))
		})
		this.add("array equals array", () => {
			this.expect([42, 13.37], Is.equal.to([42, 13.37]))
		})
		this.add("recursive object equals recursive object", () => {
			this.expect({ meaning: 42, other: 13.37, array: [ 1337 ], object: { meaning: 42 }, empty: {} }, Is.equal.to({ meaning: 42, other: 13.37, array: [ 1337 ], object: { meaning: 42 }, empty: {} }))
		})
	}
}
Fixture.add(new CompareConstraintTest())
