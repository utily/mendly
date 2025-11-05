import { Enumerator } from "./Enumerator"

export class BufferedEnumerator<T> extends Enumerator<T> {
	private buffer: T[] = []
	constructor(private backend: Enumerator<T>) {
		super(() => {
			const result = this.peek(0)
			if (this.buffer.length > 0)
				this.buffer.shift()
			return result
		})
	}
	peek(position?: number): T | undefined {
		if (!position)
			position = 0
		let next: T | undefined
		while (position > this.buffer.length - 1 && (next = this.backend.fetch()))
			this.buffer.push(next)
		return position > this.buffer.length - 1 ? undefined : this.buffer[position]
	}
}
export namespace BufferedEnumerator {}
