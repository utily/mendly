import { error } from "../error"
import { uri } from "../uri"
import { InDevice } from "./InDevice"

export abstract class Reader extends InDevice {
	abstract get location(): error.Location
	abstract get region(): error.Region
	abstract tabSize: number
	abstract read(): string | undefined
	abstract mark(): error.Region
	private static openers: {
		open: (locator: uri.Locator) => Reader | undefined
		priority: number
	}[] = []
	static register(open: (locator: uri.Locator) => Reader | undefined, priority?: number) {
		if (!priority)
			priority = 0
		Reader.openers.push({ open, priority })
		Reader.openers = Reader.openers.sort((left, right) => right.priority - left.priority)
	}
	static open(resource: uri.Locator): Reader | undefined {
		let result: Reader | undefined
		for (const opener of Reader.openers)
			if ((result = opener.open(resource)))
				break
		return result
	}
}
export namespace Reader {}
