import { Device } from "./Device"

export abstract class InDevice extends Device {
	abstract get readable(): boolean
	abstract get empty(): boolean
}
