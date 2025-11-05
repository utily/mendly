import * as Error from "../Error"
import * as Uri from "../Uri"
import { InDevice } from "./InDevice"

export abstract class Reader extends InDevice {
	abstract get location(): Error.Location
	abstract get region(): Error.Region
	abstract tabSize: number
	abstract read(): string | undefined
	abstract mark(): Error.Region
	private static openers: {
		open: (locator: Uri.Locator) => Reader | undefined
		priority: number
	}[] = []
	static register(open: (locator: Uri.Locator) => Reader | undefined, priority?: number) {
		if (!priority)
			priority = 0
		Reader.openers.push({ open, priority })
		Reader.openers = Reader.openers.sort((left, right) => right.priority - left.priority)
	}
	static open(resource: Uri.Locator): Reader | undefined {
		let result: Reader | undefined
		for (const opener of Reader.openers)
			if ((result = opener.open(resource)))
				break
		return result
	}
}
