import { BufferedReader as _BufferedReader } from "./BufferedReader"
import { Device as _Device } from "./Device"
import { FileReader as _FileReader } from "./FileReader"
import { FileWriter as _FileWriter } from "./FileWriter"
import { FolderReader as _FolderReader } from "./FolderReader"
import { Indenter as _Indenter } from "./Indenter"
import { InDevice as _InDevice } from "./InDevice"
import { OutDevice as _OutDevice } from "./OutDevice"
import { PrefixReader as _PrefixReader } from "./PrefixReader"
import { Reader as _Reader } from "./Reader"
import { StringReader as _StringReader } from "./StringReader"
import { StringWriter as _StringWriter } from "./StringWriter"
import { TillReader as _TillReader } from "./TillReader"
import { UntilReader as _UntilReader } from "./UntilReader"
import { Writer as _Writer } from "./Writer"

export namespace io {
	export import BufferedReader = _BufferedReader
	export import Device = _Device
	export import FileReader = _FileReader
	export import FolderReader = _FolderReader
	export import Indenter = _Indenter
	export import InDevice = _InDevice
	export import OutDevice = _OutDevice
	export import PrefixReader = _PrefixReader
	export import Reader = _Reader
	export import StringReader = _StringReader
	export import StringWriter = _StringWriter
	export import FileWriter = _FileWriter
	export import TillReader = _TillReader
	export import UntilReader = _UntilReader
	export import Writer = _Writer
}
