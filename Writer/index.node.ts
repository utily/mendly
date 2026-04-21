import { File as _File } from "./File"
import { Writer as _Writer } from "./index"

export type Writer = _Writer
export const Writer = Object.assign(_Writer, {
	File: _File,
}) as typeof _Writer & {
	File: typeof _File
}
export namespace Writer {
	export type File = _File
	export type Indenter = _Writer.Indenter
	export type String = _Writer.String
	export type Writer = _Writer.Writer
}
