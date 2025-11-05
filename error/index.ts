import { ConsoleHandler as _ConsoleHandler } from "./ConsoleHandler"
import { Handler as _Handler } from "./Handler"
import { Level as _Level } from "./Level"
import { Location as _Location } from "./Location"
import { Message as _Message } from "./Message"
import { Position as _Position } from "./Position"
import { Region as _Region } from "./Region"

export namespace error {
	export import ConsoleHandler = _ConsoleHandler
	export import Handler = _Handler
	export import Level = _Level
	export import Location = _Location
	export import Message = _Message
	export import Position = _Position
	export import Region = _Region
}
