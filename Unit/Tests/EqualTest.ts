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

/// <reference path="../Fixture" />
/// <reference path="../Constraints/Is" />

module U10sil.Unit.Tests {
	import Is = Constraints.Is
	export class EqualTest extends Fixture {
		constructor() {
			super("EqualTest")
			this.add("true is true", () => {
				this.expect(true, Is.Equal().To(true))
			})
			this.add("false is false", () => {
				this.expect(false, Is.Equal().To(false))
			})
			this.add("true is not false", () => {
				this.expect(true === false, Is.Equal().To(false))
			})
			this.add("false is not true", () => {
				this.expect(false === true, Is.Equal().To(false))
			})
			this.add("foo equals foo", () => {
				this.expect("foo" === "foo", Is.Equal().To(true))
			})
			this.add("foo does not equal bar", () => {
				this.expect("foo" === "bar", Is.Equal().To(false))
			})
			this.add("null === null", () => {
				this.expect(null, Is.Equal().To(null))
			})
			this.add("undefined === undefined", () => {
				this.expect(undefined, Is.Equal().To(undefined))
			})
		}
	}
}
