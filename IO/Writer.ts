import * as Uri from "../Uri"
import { ArrayEnumerator, Enumerator } from "../Utilities"
import { OutDevice } from "./OutDevice"

export abstract class Writer extends OutDevice {
	newLineSymbol = "\n"
	async write(message: string | string[] | Enumerator<string>): Promise<boolean> {
		return message instanceof Enumerator
			? this.writeImplementation(message)
			: message instanceof Array
			? this.writeImplementation(new ArrayEnumerator(message))
			: this.writeImplementation(new ArrayEnumerator([message]))
	}
	async writeLine(message?: string | string[] | Enumerator<string>): Promise<boolean> {
		return message instanceof Enumerator
			? this.writeImplementation(message.append(this.newLineSymbol))
			: message instanceof Array
			? this.writeImplementation(new ArrayEnumerator([...message, this.newLineSymbol]))
			: message
			? this.writeImplementation(new ArrayEnumerator([message, this.newLineSymbol]))
			: this.writeImplementation(new ArrayEnumerator([this.newLineSymbol]))
	}
	protected abstract writeImplementation(buffer: Enumerator<string>): Promise<boolean>
	private static openers: { open: (resource: Uri.Locator) => Promise<Writer | undefined>; priority: number }[] = []
	static register(open: (resource: Uri.Locator) => Promise<Writer | undefined>, priority?: number) {
		if (!priority)
			priority = 0
		Writer.openers.push({ open, priority })
		Writer.openers = Writer.openers.sort((left, right) => right.priority - left.priority)
	}
	static async open(resource: Uri.Locator | string): Promise<Writer | undefined> {
		let result: Writer | undefined
		if (typeof resource == "string") {
			const r = Uri.Locator.parse(resource)
			result = r ? await Writer.open(r) : undefined
		} else
			for (const opener of Writer.openers)
				if ((result = await opener.open(resource)))
					break
		return result
	}
}
