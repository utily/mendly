import { uri } from "../uri"

export abstract class Device {
	abstract get resource(): uri.Locator
	abstract get opened(): boolean
	abstract close(): Promise<boolean>
}
export namespace Device {}
