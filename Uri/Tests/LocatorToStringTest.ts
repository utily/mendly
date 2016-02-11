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

/// <reference path="../../Unit/Fixture" />
/// <reference path="../../Unit/Constraints/Is" />
/// <reference path="../Locator" />

module U10sil.Uri.Tests {
	import Is = Unit.Constraints.Is
	export class LocatorToStringTest extends Unit.Fixture {
		constructor() {
			super("Uri.Locator.toString")
			this.add("full https", () => {
				var absolute = Locator.parse("https://server.example.com/folder0/folder1/")
				this.expect(absolute.toString(), Is.Equal().To("https://server.example.com/folder0/folder1/"))
			})
			this.add("absolute file", () => {
				var relative = Locator.parse("/folder2/file.extension")
				this.expect(relative.toString(), Is.Equal().To("/folder2/file.extension"))
			})
			this.add("relative", () => {
				var relative = Locator.parse("./folder2/file.extension")
				this.expect(relative.toString(), Is.Equal().To("./folder2/file.extension"))
			})
		}
	}
	Unit.Fixture.add(new LocatorToStringTest())
}
