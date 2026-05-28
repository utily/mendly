import { Buffered as _Buffered } from "./Buffered.js"
import { Prefix as _Prefix } from "./Prefix.js"
import { Reader as _Reader } from "./Reader.js"
import { String as _String } from "./String.js"
import { Till as _Till } from "./Till.js"
import { Until as _Until } from "./Until.js"

export type Reader = _Reader
export const Reader = Object.assign(_Reader, {
	Buffered: _Buffered,
	Prefix: _Prefix,
	String: _String,
	Till: _Till,
	Until: _Until
}) as typeof _Reader & {
	Buffered: typeof _Buffered
	Prefix: typeof _Prefix
	String: typeof _String
	Till: typeof _Till
	Until: typeof _Until
}
export namespace Reader {
	export type Buffered = _Buffered
	export type Prefix = _Prefix
	export type String = _String
	export type Till = _Till
	export type Until = _Until
}
