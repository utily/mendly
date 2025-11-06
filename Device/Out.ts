import type { Device } from "./"

export interface Out extends Device {
	get writable(): boolean
	get autoFlush(): boolean
	flush(): Promise<boolean>
}
export namespace Out {}
