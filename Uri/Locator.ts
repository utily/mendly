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
		constructor(private scheme: string[], private authority: Authority, private path: string[], private query: { [key: string]: string }, private fragment: string) {
		}
		isRelative(): boolean {
			return this.path[0] == "." || this.path[0] == ".."
		}
		isFolder(): boolean {
			return this.path[this.path.length - 1] == ""
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
		getQuery(): { [key: string]: string } {
			return this.query
		}
		getFragment(): string {
			return this.fragment
		}
		getFolder(): Locator {
			return this.isFolder() ? this : new Locator(this.scheme, this.authority, this.path.filter((value, index) => index < this.path.length - 2), this.query, this.fragment)
		}
		private createArray<T>(value: T, count: number): T[] {
			var result: T[] = []
			while (count-- > 0)
				result.push(value)
			return result
		}
		normalize(): Locator {
			var skip = 0
			var path = this.path.reverse().filter(item => {
						var r = false
						if (item == "." || item == "")
							;
						else if (item == "..")
							skip++
						else if (skip > 0)
							skip--
						else
							r = true
						return r
					}).concat(this.createArray("..", skip)).reverse()
			return new Locator(this.scheme, this.authority, path, this.query, this.fragment)
		}
		resolve(absolute: Locator): Locator {
			return (this.isRelative() ? new Locator(absolute.getScheme(), absolute.getAuthority(), absolute.getFolder().getPath().concat(this.path), this.query, this.fragment) : this).normalize()
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
					var scheme = splitted.length > 1 ? splitted.shift().split("+") : undefined
					data = splitted.shift()
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
							query[splitted.shift()] = splitted.shift()
						});
						data = data.slice(0, index)
					}
					var authority: Authority
					var path: string[]
					if (data) {
						splitted = data.split("/")
						if (splitted.length > 0) {
							switch (splitted[0]) {
								case ".":
								case "..":
									break
								case "":
									splitted.shift()
									break
								default:
									authority = Authority.parse(splitted.shift())
									break
							}
							path = splitted
						}
					}
					result = new Locator(scheme, authority, path, query, fragment)
					break
			}
			return result
		}
	}
}
