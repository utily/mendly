import { Uri } from "../Uri"

export abstract class Device {
	abstract get resource(): Uri
	abstract get opened(): boolean
	abstract close(): Promise<boolean>
}
export namespace Device {}
