import { Enumerator } from "./Enumerator";

export class ArrayEnumerator<T> extends Enumerator<T> {
	private position = 0;
	constructor(private backend: T[]) {
		super(() =>
			this.position < this.backend.length
				? this.backend[this.position++]
				: undefined
		);
	}
}
