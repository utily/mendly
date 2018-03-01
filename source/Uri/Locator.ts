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

import { Authority } from "./Authority"

export class Locator {
	constructor(readonly scheme: string[] = [], readonly authority: Authority = new Authority(), readonly path: string[] = [], readonly query: { [key: string]: string } = {}, readonly fragment?: string) {
	}
	get isRelative(): boolean {
		return this.path[0] == "." || this.path[0] == ".."
	}
	get isFolder(): boolean {
		return this.path[this.path.length - 1] == ""
	}
	get folder(): Locator {
		return this.isFolder ? this : new Locator(this.scheme, this.authority, this.path.filter((value, index) => index < this.path.length - 1), this.query, this.fragment)
	}
	get name(): string {
		return this.path[this.path.length - 1]
	}
	get extension(): string {
		const splitted = this.name.split(".")
		return splitted.length > 1 ? splitted[splitted.length - 1] : ""
	}
	private createArray<T>(value: T, count: number): T[] {
		const result: T[] = []
		while (count-- > 0)
			result.push(value)
		return result
	}
	normalize(): Locator {
		let skip = 0
		const path = this.path.reverse().filter((item, index) => {
					let r = false
					if ((item == "" || item == ".") && index < this.path.length - 1)
						r = false // do nothing
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
	resolve(absolute?: Locator): Locator {
		return !absolute ? this : new Locator(this.scheme.length > 0 ? this.scheme : absolute.scheme, !this.authority.isEmpty ? this.authority : absolute.authority, this.isRelative ? absolute.folder.path.concat(this.path) : this.path, this.query, this.fragment).normalize()
	}
	toString(): string {
		let result = ""
		if (this.scheme.length > 0)
			result += this.scheme.join("+") + ":"
		if (!this.authority.isEmpty)
			result += "//" + this.authority.toString()
		else if (this.scheme.length > 0)
			result += "//"
		if (this.path) {
			let path = this.path.join("/")
			if (path[0] != "." || result.length > 0)
				path = "/" + path
			result += path
		}
		if (Object.keys(this.query).length > 0)
			result += "?" + this.query.toString()
		if (this.fragment)
			result += "#" + this.fragment
		return result
	}
	static readonly empty = new Locator(undefined, undefined, undefined, undefined, undefined)
	static parse(data?: string): Locator | undefined {
		let result: Locator | undefined
		switch (data) {
			case "":
			case null:
			case undefined:
				break
			default:
				let hasAuthority = true
				let scheme: string[] = []
				let splitted = data.split("://", 2)
				if (splitted.length > 1) {
					scheme = (splitted.shift() || "").split("+")
					data = splitted.shift()
				} else if (data.slice(0, 2) == "//")
					data = data.slice(2)
				else
					hasAuthority = false
				let index: number
				let fragment: string | undefined
				if (data && (index = data.lastIndexOf("#")) > -1) {
					fragment = data.slice(index + 1)
					data = data.slice(0, index)
				}
				let query: { [key: string]: string } = {}
				if (data && (index = data.lastIndexOf("?")) > -1) {
					query = new Object() as { [key: string]: string }
					data.slice(index + 1).split(";").forEach(element => {
						splitted = element.split("=")
						const key = splitted.shift()
						const value = splitted.shift()
						if (key && value)
							query[key] = value
					})
					data = data.slice(0, index)
				}
				let authority: Authority | undefined
				let path: string[] = []
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
								if (hasAuthority)
									authority = Authority.parse(splitted.shift())
								else
									splitted.unshift(".")
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
