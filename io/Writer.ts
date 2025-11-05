import { uri } from "../uri"
import { utilities } from "../utilities"
import { OutDevice } from "./OutDevice"

export abstract class Writer extends OutDevice {
	newLineSymbol = "\n"
	async write(message: string | string[] | utilities.Enumerator<string>): Promise<boolean> {
		return message instanceof utilities.Enumerator
			? this.writeImplementation(message)
			: message instanceof Array
			? this.writeImplementation(new utilities.ArrayEnumerator(message))
			: this.writeImplementation(new utilities.ArrayEnumerator([message]))
	}
	async writeLine(message?: string | string[] | utilities.Enumerator<string>): Promise<boolean> {
		return message instanceof utilities.Enumerator
			? this.writeImplementation(message.append(this.newLineSymbol))
			: message instanceof Array
			? this.writeImplementation(new utilities.ArrayEnumerator([...message, this.newLineSymbol]))
			: message
			? this.writeImplementation(new utilities.ArrayEnumerator([message, this.newLineSymbol]))
			: this.writeImplementation(new utilities.ArrayEnumerator([this.newLineSymbol]))
	}
	protected abstract writeImplementation(buffer: utilities.Enumerator<string>): Promise<boolean>
	private static openers: { open: (resource: uri.Locator) => Promise<Writer | undefined>; priority: number }[] = []
	static register(open: (resource: uri.Locator) => Promise<Writer | undefined>, priority?: number) {
		if (!priority)
			priority = 0
		Writer.openers.push({ open, priority })
		Writer.openers = Writer.openers.sort((left, right) => right.priority - left.priority)
	}
	static async open(resource: uri.Locator | string): Promise<Writer | undefined> {
		let result: Writer | undefined
		if (typeof resource == "string") {
			const r = uri.Locator.parse(resource)
			result = r ? await Writer.open(r) : undefined
		} else
			for (const opener of Writer.openers)
				if ((result = await opener.open(resource)))
					break
		return result
	}
}
export namespace Writer {}
