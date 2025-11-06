import type { Device } from "./"

export interface In extends Device {
	get readable(): boolean
	get empty(): boolean
}
export namespace In {}
