import "./File"
import "./Folder"
import { Buffered as _Buffered } from "./Buffered"
import { Prefix as _Prefix } from "./Prefix"
import { Reader as _Reader } from "./Reader"
import { String as _String } from "./String"
import { Till as _Till } from "./Till"
import { Until as _Until } from "./Until"

// Export both the type and the value
export type Reader = _Reader

// Use declaration merging to add namespace to the imported class
export const Reader = _Reader as typeof _Reader & {
	Buffered: typeof _Buffered
	Prefix: typeof _Prefix
	String: typeof _String
	Till: typeof _Till
	Until: typeof _Until
}

// Assign the classes to the constructor function
Object.assign(Reader, {
	Buffered: _Buffered,
	Prefix: _Prefix,
	String: _String,
	Till: _Till,
	Until: _Until,
})

export namespace Reader {
	export type Buffered = _Buffered
	export type Prefix = _Prefix
	export type String = _String
	export type Till = _Till
	export type Until = _Until
}
