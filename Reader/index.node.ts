import { File as _File } from "./File"
import { Folder as _Folder } from "./Folder"
import { Reader as _Reader } from "./index"

export type Reader = _Reader
export const Reader = Object.assign(_Reader, {
	File: _File,
	Folder: _Folder,
}) as typeof _Reader & {
	File: typeof _File
	Folder: typeof _Folder
}
export namespace Reader {
	export type File = _File
	export type Folder = _Folder
	export type Buffered = _Reader.Buffered
	export type Prefix = _Reader.Prefix
	export type String = _Reader.String
	export type Till = _Reader.Till
	export type Until = _Reader.Until
}
