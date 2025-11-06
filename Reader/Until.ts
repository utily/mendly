import { Error } from "../Error"
import { Uri } from "../Uri"
import { Buffered } from "./Buffered"
import { Reader } from "./Reader"

export class Until extends Reader {
	get tabSize(): number {
		return this.backend.tabSize
	}
	set tabSize(size: number) {
		this.backend.tabSize = size
	}
	private done = -1
	private backend: Buffered
	get readable(): boolean {
		return this.backend.readable
	}
	get opened(): boolean {
		return !this.done && this.backend.opened
	}
	get empty(): boolean {
		return this.done == 0 || this.backend.empty
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
		const peeked = this.backend.peekIs(this.endMark)
		if (peeked)
			this.done = peeked.length
	}
	close(): Promise<boolean> {
		const result = this.done > 0
		if (result)
			this.done = 0
		return Promise.resolve(result)
	}
	read(): string | undefined {
		let result: string | undefined
		if (this.done != 0) {
			result = this.backend.read()
			let peeked: string | undefined
			if (this.done > 0)
				this.done--
			else if ((peeked = this.backend.peekIs(this.endMark)))
				this.done = peeked.length
		}
		return result
	}
	mark(): Error.Region {
		return this.backend.mark()
	}
	static create(backend: undefined, endMark?: string | string[]): undefined
	static create(backend: Reader, endMark?: string | string[]): Reader
	static create(backend: Reader | undefined, endMark?: string | string[]): Reader | undefined {
		return backend && endMark ? new Until(backend, endMark) : backend
	}
}
export namespace Until {}
