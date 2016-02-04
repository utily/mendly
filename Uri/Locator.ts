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

/// <reference path="Authority" />

module U10sil.Uri {
	export class Locator {
		constructor(private scheme: string[], private authority: Authority, private path: string[], private query: Object, private fragment: string) {
		}
		getScheme(): string[] {
			return this.scheme
		}
		getAuthority(): Authority {
			return this.authority
		}
		getPath(): string[] {
			return this.path
		}
		getQuery(): Object {
			return this.query
		}
		getFragment(): string {
			return this.fragment
		}
		toString(): string {
			var result: string
			if (this.scheme)
				result = this.scheme.join("+") + "://"
			if (this.authority)
				result += this.authority.toString()
			if (this.path)
				result += this.path.join("/")
			if (this.query)
				result += "?" + this.query.toString()
			if (this.fragment)
				result += "#" + this.fragment
			return result
		}
		static parse(data: string): Locator {
			var result: Locator
			switch (data) {
				case "":
				case undefined:
					break
				case null:
					result = null
					break
				default:
					var splitted = data.split("://", 2)
					var scheme = splitted.length > 1 ? splitted.pop().split("+") : undefined
					data = splitted.pop()
					var index: number
					var fragment: string
					if (data && (index = data.lastIndexOf("#")) > -1) {
						fragment = data.slice(index + 1)
						data = data.slice(0, index)
					}
					var query: { [key: string]: string }
					if (data && (index = data.lastIndexOf("?")) > -1) {
						query = <{ [key: string]: string }> new Object()
						data.slice(index + 1).split(";").forEach(element => {
							splitted = element.split("=")
							query[splitted.pop()] = splitted.pop()
						});
						data = data.slice(0, index)
					}
					var authority: Authority
					if (data && !data.match(/^(.\/|..\/|\//)) {
						splitted = data.split("/")
						authority = Authority.parse(splitted.pop())
						data = data.length > 0 ? "/" + splitted.pop() : undefined
					}
					var path: string[]
					if (data)
						path = splitted.pop().split("/")
					result = new Locator(scheme, authority, path, query, fragment)
					break
			}
			return result
		}
	}
}
