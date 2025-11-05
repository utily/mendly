import * as Uri from "../Uri"
export abstract class Device {
	abstract get resource(): Uri.Locator
	abstract get opened(): boolean
	abstract close(): Promise<boolean>
}
