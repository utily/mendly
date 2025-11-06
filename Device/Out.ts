import { Device } from "./Device"

export abstract class Out extends Device {
	abstract get writable(): boolean
	abstract get autoFlush(): boolean
	abstract flush(): Promise<boolean>
}
export namespace Out {}
