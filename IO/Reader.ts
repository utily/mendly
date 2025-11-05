import * as Error from "../Error";
import * as Uri from "../Uri";
import { InDevice } from "./InDevice";

export abstract class Reader extends InDevice {
	abstract get location(): Error.Location;
	abstract get region(): Error.Region;
	abstract tabSize: number;
	abstract read(): string | undefined;
	abstract mark(): Error.Region;
	private static openers: {
		open: (locator: Uri.Locator) => Reader | undefined;
		priority: number;
	}[] = [];
	static addOpener(
		open: (locator: Uri.Locator) => Reader | undefined,
		priority?: number
	) {
		if (!priority) priority = 0;
		Reader.openers.push({ open, priority });
		Reader.openers = Reader.openers.sort(
			(left, right) => right.priority - left.priority
		);
	}
	static open(locator: Uri.Locator): Reader | undefined {
		let result: Reader | undefined;
		let i = 0;
		do result = Reader.openers[i++].open(locator);
		while (!result && i < Reader.openers.length);
		return result;
	}
}
