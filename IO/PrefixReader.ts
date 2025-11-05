import * as Error from "../Error";
import * as Uri from "../Uri";
import { Reader } from "./Reader";
import { BufferedReader } from "./BufferedReader";

export class PrefixReader extends Reader {
	get tabSize(): number {
		return this.backend.tabSize;
	}
	set tabSize(size: number) {
		this.backend.tabSize = size;
	}
	private readonly backend: BufferedReader;
	private done = false;
	get readable(): boolean {
		return this.backend.readable;
	}
	get opened(): boolean {
		return this.backend.opened;
	}
	get isEmpty(): boolean {
		return this.done || this.backend.isEmpty;
	}
	get resource(): Uri.Locator {
		return this.backend.resource;
	}
	get location(): Error.Location {
		return this.backend.location;
	}
	get region(): Error.Region {
		return this.backend.region;
	}
	constructor(backend: Reader, private prefix: string | string[]) {
		super();
		this.backend =
			backend instanceof BufferedReader
				? backend
				: (BufferedReader.create(backend) as BufferedReader);
	}
	close(): Promise<boolean> {
		return this.backend.close();
	}
	read(): string | undefined {
		let result: string | undefined;
		if (!this.done) {
			result = this.backend.read();
			this.done =
				result == "\n" &&
				!this.backend.readIf(this.prefix) &&
				!this.backend.peekIs("\n");
		}
		return result;
	}
	mark(): Error.Region {
		return this.backend.mark();
	}
	static create(backend: undefined, prefix?: string | string[]): undefined;
	static create(backend: Reader, prefix?: string | string[]): Reader;
	static create(
		backend: Reader | undefined,
		prefix?: string | string[]
	): Reader | undefined {
		return backend && prefix ? new PrefixReader(backend, prefix) : backend;
	}
}
