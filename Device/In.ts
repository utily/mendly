import { Device } from "./Device"

export abstract class In extends Device {
	abstract get readable(): boolean
	abstract get empty(): boolean
}
export namespace In {}
