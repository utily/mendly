import { Device as _Device } from "./Device"
import { In as _In } from "./In"
import { Out as _Out } from "./Out"

// Export both the type and the value
export type Device = _Device

// Use declaration merging to add namespace to the imported class
export const Device = _Device as typeof _Device & {
	In: typeof _In
	Out: typeof _Out
}

// Assign the classes to the constructor function
Object.assign(Device, {
	In: _In,
	Out: _Out,
})

export namespace Device {
	export type In = _In
	export type Out = _Out
}
