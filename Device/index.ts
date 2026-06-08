import { Url } from "../Url/index.js"
import { In as _In } from "./In.js"
import { Out as _Out } from "./Out.js"

// Export both the type and the value
export interface Device {
	get resource(): Url
	get opened(): boolean
	close(): Promise<boolean>
}

export namespace Device {
	export import In = _In
	export import Out = _Out
}
