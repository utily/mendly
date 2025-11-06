import { Error } from "../Error"
import { Uri } from "../Uri"
import { Buffered } from "./Buffered"
import { Reader } from "./Reader"

export class Till extends Reader {
	get tabSize(): number {
		return this.backend.tabSize
	}
	set tabSize(size: number) {
		this.backend.tabSize = size
	}
	private backend: Buffered
	private done = false
	get readable(): boolean {
		return this.backend.readable
	}
	get opened(): boolean {
		return !this.done && this.backend.opened
	}
	get empty() {
		return this.done || this.backend.empty
	}
	get resource(): Uri {
		return this.backend.resource
	}
	get location(): Error.Location {
		return this.backend.location
	}
	get region(): Error.Region {
		return this.backend.region
	}
	private constructor(backend: Reader, private endMark: string | string[]) {
		super()
		this.backend = backend instanceof Buffered ? backend : Buffered.create(backend)
		this.done = this.backend.peekIs(this.endMark) != undefined
	}
	close(): Promise<boolean> {
		const result = !this.done
		if (result)
			this.done = true
		return Promise.resolve(result)
	}
	read(): string | undefined {
		let result: string | undefined
		if (!this.done) {
			result = this.backend.read()
			this.done = this.backend.peekIs(this.endMark) != undefined
		}
		return result
	}
	mark(): Error.Region {
		return this.backend.mark()
	}
	static create(backend: undefined, endMark?: string | string[]): undefined
	static create(backend: Reader, endMark?: string | string[]): Reader
	static create(backend: Reader | undefined, endMark?: string | string[]): Reader | undefined {
		return backend && endMark ? new Till(backend, endMark) : backend
	}
}
export namespace Till {}
