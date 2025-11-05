import * as Error from "../Error"
import * as Uri from "../Uri"
import { Reader } from "./Reader"

export { Reader } from "./Reader"
export class BufferedReader extends Reader {
	get tabSize(): number {
		return this.backend.tabSize
	}
	set tabSize(size: number) {
		this.backend.tabSize = size
	}
	get readable(): boolean {
		return !!this.backend
	}
	get opened(): boolean {
		return !!this.backend
	}
	private buffer: { data: string; location: Error.Location }[] = []
	private lastMark: Error.Location
	private lastContent: string = ""
	get empty(): boolean {
		return (this.buffer.length == 0 || this.buffer[0]!.data == "\0") && this.backend.empty
	}
	get resource(): Uri.Locator {
		const location = this.location
		return location ? location.resource : Uri.Locator.empty
	}
	private locationValue: Error.Location
	get location(): Error.Location {
		return this.locationValue
	}
	get region(): Error.Region {
		return new Error.Region(this.resource, this.lastMark, this.location, this.lastContent)
	}
	protected constructor(private backend: Reader) {
		super()
		this.lastMark = this.locationValue = this.backend.location
	}
	close(): Promise<boolean> {
		return this.backend.close()
	}
	peek(length?: number): string | undefined {
		if (!length)
			length = 1
		let next: string | undefined
		while (length > this.buffer.length && (next = this.backend.read()))
			this.buffer.push({ data: next, location: this.backend.location })
		return this.buffer.length == 0
			? undefined
			: this.buffer
					.slice(0, length > this.buffer.length ? this.buffer.length : length)
					.map(value => value.data)
					.join("")
	}
	read(length?: number): string | undefined {
		if (!length)
			length = 1
		const result = this.peek(length)
		if (result && result.length > 0) {
			this.locationValue = this.buffer[result.length - 1]!.location
			this.buffer.splice(0, result.length)
			this.lastContent += result
		}
		return result
	}
	peekIs(value: string | string[] | undefined, count?: number): string | undefined {
		let result: string | undefined
		if (value)
			if (typeof value == "string") {
				const v = value
				while (count && count-- > 0)
					value += v
				result = this.peek(value.length) == value ? value : undefined
			} else if (value.length > 0 && !(result = this.peekIs(value[0])) && value.length)
				result = this.peekIs(value.slice(1))
		return result
	}
	readIf(value: string | string[] | undefined): string | undefined {
		let result: string | undefined
		if (value)
			if (typeof value == "string")
				result = (this.peek(value.length) == value && this.read(value.length)) || undefined
			else if (value.length > 0 && !(result = this.readIf(value[0])) && value.length)
				result = this.readIf(value.slice(1))
		return result
	}
	readAll(): string | undefined {
		let result = ""
		while (this.peek())
			result += this.read()
		return result != "" ? result : undefined
	}
	mark(): Error.Region {
		const result = this.region
		this.lastMark = this.location
		this.lastContent = ""
		return result
	}
	static create(backend: undefined): undefined
	static create(backend: Reader): BufferedReader
	static create(backend: Reader | undefined): BufferedReader | undefined {
		return backend ? new BufferedReader(backend) : undefined
	}
}
