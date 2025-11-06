import { Array as _Array } from "./Array"
import { Buffered as _Buffered } from "./Buffered"
import { Enumerator as _Enumerator } from "./Enumerator"

// Export both the type and the value
export type Enumerator<T> = _Enumerator<T>

// Use declaration merging to add namespace to the imported class
export const Enumerator = _Enumerator as typeof _Enumerator & {
	Array: typeof _Array
	Buffered: typeof _Buffered
}

// Assign the classes to the constructor function
Object.assign(Enumerator, {
	Array: _Array,
	Buffered: _Buffered,
})

export namespace Enumerator {
	export type Array<T> = _Array<T>
	export type Buffered<T> = _Buffered<T>
}
