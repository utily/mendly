export class Endpoint {
	get empty() {
		return this.host.length == 0 && !this.port
	}
	constructor(readonly host: string[] = [], readonly port?: number) {}
	toString(): string {
		let result = this.host.join(".")
		if (this.port)
			result += ":" + this.port.toString()
		return result
	}
	static parse(data?: string): Endpoint {
		let result: Endpoint
		if (data) {
			const splitted = data.split(":", 2)
			result = new Endpoint(splitted[0]?.split("."), splitted.length > 1 ? parseInt(splitted[1] ?? "") : undefined)
		} else
			result = new Endpoint()
		return result
	}
}
export namespace Endpoint {}
