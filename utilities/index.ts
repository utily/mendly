import { ArrayEnumerator as _ArrayEnumerator } from "./ArrayEnumerator"
import { BufferedEnumerator as _BufferedEnumerator } from "./BufferedEnumerator"
import { Enumerable as _Enumerable } from "./Enumerable"
import { Enumerator as _Enumerator } from "./Enumerator"

export namespace utilities {
	export import Enumerator = _Enumerator
	export import Enumerable = _Enumerable
	export import ArrayEnumerator = _ArrayEnumerator
	export import BufferedEnumerator = _BufferedEnumerator
}
