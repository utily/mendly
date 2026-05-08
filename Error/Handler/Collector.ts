import type { Error } from ".."
import type { Handler } from "."

export class Collector implements Handler {
	private _errors: Error[] = []
	get errors(): readonly Error[] {
		return this._errors
	}
	raise(error: Error): void {
		this._errors.push(error)
	}
	flush(): readonly Error[] {
		const snapshot = this._errors
		this._errors = []
		return snapshot
	}
	toJSON(): readonly { description: string; level: string; type: string; region: string | undefined }[] {
		return this._errors.map(e => ({
			description: e.description,
			level: e.level,
			type: e.type,
			region: e.region?.toString()
		}))
	}
	toString(): string {
		return this._errors.map(e => e.toString()).join("\n")
	}
}
export namespace Collector {}
