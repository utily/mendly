import type { Device } from "./index.js"

export interface In extends Device {
	get readable(): boolean
	get empty(): boolean
}
export namespace In {}
