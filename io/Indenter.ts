import { Uri } from "../Uri"
import { utilities } from "../utilities"
import { Writer } from "./Writer"

export class Indenter extends Writer {
	get resource(): Uri {
		return this.backend.resource
	}
	get opened(): boolean {
		return this.backend.opened
	}
	get writable(): boolean {
		return this.backend.writable
	}
	autoFlush: boolean = true
	indentionSymbol = "\t"
	private indentionCount = 0
	private indentNext = false
	constructor(private readonly backend: Writer) {
		super()
	}
	flush(): Promise<boolean> {
		return this.backend.flush()
	}
	close(): Promise<boolean> {
		return this.backend.close()
	}
	increase(): boolean {
		this.indentionCount++
		return true
	}
	decrease(): boolean {
		this.indentionCount--
		return this.indentionCount >= 0
	}
	private getIndention(): string {
		return this.indentionSymbol.repeat(this.indentionCount)
	}
	protected writeImplementation(buffer: utilities.Enumerator<string>): Promise<boolean> {
		const result: Promise<boolean>[] = []
		let item: string | undefined
		let next = buffer.fetch()
		if (next)
			do {
				item = next
				next = buffer.fetch()
				if (this.indentNext)
					item = this.getIndention() + item
				this.indentNext = item.endsWith(this.newLineSymbol)
				item = item.replace(this.newLineSymbol, this.newLineSymbol + this.getIndention())
				if (this.indentNext)
					item = item.substring(0, item.length - this.indentionCount * this.indentionSymbol.length)
				result.push(this.backend.write(item))
			} while (next)
		return Promise.all(result).then(r => r.reduce((previous, current) => previous && current, true))
	}
}
export namespace Indenter {}
