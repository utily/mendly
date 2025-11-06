import { Uri } from "../Uri"
import { In as _In } from "./In"
import { Out as _Out } from "./Out"

// Export both the type and the value
export interface Device {
	get resource(): Uri
	get opened(): boolean
	close(): Promise<boolean>
}

export namespace Device {
	export import In = _In
	export import Out = _Out
}
