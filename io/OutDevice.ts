import { Device } from "./Device"

export abstract class OutDevice extends Device {
	abstract get writable(): boolean
	abstract get autoFlush(): boolean
	abstract flush(): Promise<boolean>
}
export namespace OutDevice {}
