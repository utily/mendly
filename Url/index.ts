import { Authority as _Authority } from "./Authority.js"
import { Endpoint as _Endpoint } from "./Endpoint.js"
import { User as _User } from "./User.js"

export class Url {
	/**
	 * @param scheme Protocol segments before `:` (for example: `https`, `git+ssh`).
	 * @param authority Network authority component (`//user@host:port`).
	 * @param path Dot and slash separated URL path segments.
	 * @param query Decoded query parameters represented as key/value pairs.
	 * @param fragment Fragment identifier after `#`, without the `#` prefix.
	 */
	constructor(
		readonly scheme: string[] = [],
		readonly authority: Url.Authority = new _Authority(),
		readonly path: string[] = [],
		readonly query: { [key: string]: string } = {},
		readonly fragment?: string
	) {}
	/** True when the path starts with `.` or `..`. */
	get isRelative(): boolean {
		return this.path[0] == "." || this.path[0] == ".."
	}
	/** True when the URL path points to a folder-shaped location. */
	get isFolder(): boolean {
		return this.path[this.path.length - 1] == ""
	}
	/** Folder form of this URL (`this` when already folder-shaped, otherwise parent). */
	get folder(): Url {
		return this.isFolder ? this : this.parent
	}
	/** Parent URL created by removing the final path segment. */
	get parent(): Url {
		return this.path.length > 0
			? new Url(this.scheme, this.authority, this.path.slice(0, this.path.length - 1), this.query, this.fragment)
			: this
	}
	/** Final path segment, preserved exactly as stored in `path`. */
	get filename(): string {
		return this.path[this.path.length - 1] ?? ""
	}
	/** Portion of `filename` before the first `.` (or full name when no dot exists). */
	get stem(): string {
		const name = this.filename
		const firstDot = name.indexOf(".")
		return firstDot < 0 ? name : name.slice(0, firstDot)
	}
	/** Portion of `filename` before the last `.` (empty when no dot exists). */
	get base(): string {
		const name = this.filename
		const lastDot = name.lastIndexOf(".")
		return lastDot < 0 ? "" : name.slice(0, lastDot)
	}
	/** Portion of `filename` after the last `.` (empty when no dot exists). */
	get extension(): string {
		const name = this.filename
		const lastDot = name.lastIndexOf(".")
		return lastDot < 0 ? "" : name.slice(lastDot + 1)
	}
	/** All dot-separated segments after the first `.` in `filename`. */
	get suffix(): string {
		const name = this.filename
		const firstDot = name.indexOf(".")
		return firstDot < 0 ? "" : name.slice(firstDot + 1)
	}
	private createArray<T>(value: T, count: number): T[] {
		const result: T[] = []
		while (count-- > 0) result.push(value)
		return result
	}
	normalize(): Url {
		let skip = 0
		const path = this.path
			.reverse()
			.filter((item, index) => {
				let r = false
				if ((item == "" || item == ".") && index < this.path.length - 1)
					r = false // do nothing
				else if (item == "..") skip++
				else if (skip > 0) skip--
				else r = true
				return r
			})
			.concat(this.createArray("..", skip))
			.reverse()
		return new Url(this.scheme, this.authority, path, this.query, this.fragment)
	}
	resolve(absolute?: Url): Url {
		return !absolute
			? this
			: new Url(
					this.scheme.length > 0 ? this.scheme : absolute.scheme,
					!this.authority.empty ? this.authority : absolute.authority,
					this.isRelative ? absolute.folder.path.concat(this.path) : this.path,
					this.query,
					this.fragment
				).normalize()
	}
	appendPath(path: string | string[]): Url {
		return new Url(
			this.scheme,
			this.authority,
			path instanceof Array ? [...this.path, ...path] : [...this.path, path],
			this.query,
			this.fragment
		)
	}
	toJSON(): string {
		return this.toString()
	}
	toString(): string {
		let result = ""
		if (this.scheme.length > 0) result += this.scheme.join("+") + ":"
		if (!this.authority.empty) result += "//" + this.authority.toString()
		else if (this.scheme.length > 0) result += "//"
		if (this.path) {
			let path = this.path.join("/")
			if (path[0] != "." || result.length > 0) path = "/" + path
			result += path
		}
		const query = Object.entries(this.query)
			.filter(([key]) => key.length > 0)
			.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value ?? "")}`)
			.join("&")
		if (query.length > 0) result += "?" + query
		if (this.fragment) result += "#" + this.fragment
		return result
	}
	static readonly empty = new Url(undefined, undefined, undefined, undefined, undefined)
	static parse(data: string | Url | undefined): Url | undefined {
		let result: Url | undefined
		if (data instanceof Url) result = data
		else if (typeof data == "string" && data.length > 0) {
			let hasAuthority = true
			let scheme: string[] = []
			let splitted = data.split("://", 2)
			if (splitted.length > 1) {
				scheme = (splitted.shift() || "").split("+")
				data = splitted.shift()
			} else if (data.slice(0, 2) == "//") data = data.slice(2)
			else hasAuthority = false
			let index: number
			let fragment: string | undefined
			if (data && (index = data.lastIndexOf("#")) > -1) {
				fragment = data.slice(index + 1)
				data = data.slice(0, index)
			}
			let query: { [key: string]: string } = {}
			if (data && (index = data.lastIndexOf("?")) > -1) {
				query = Object.fromEntries(
					data
						.slice(index + 1)
						.split(/[&;]/)
						.map(element => element.split("=", 2).map(decodeURIComponent))
						.filter(([key]) => !!key)
						.map(([key, value = ""]) => [key, value])
				) as { [key: string]: string }
				data = data.slice(0, index)
			}
			let authority: Url.Authority | undefined
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
							if (hasAuthority) authority = Url.Authority.parse(splitted.shift())
							else splitted.unshift(".")
							break
					}
					path = splitted
				}
			}
			result = new Url(scheme, authority, path, query, fragment)
		}
		return result
	}
}
export namespace Url {
	export import Authority = _Authority
	export import Endpoint = _Endpoint
	export import User = _User
}
