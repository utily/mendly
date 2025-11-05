import { Endpoint } from "./Endpoint"
import { User } from "./User"

export class Authority {
	get empty() {
		return this.user.empty && this.endpoint.empty
	}
	constructor(readonly user: User = new User(), readonly endpoint: Endpoint = new Endpoint()) {}
	toString(): string {
		let result = ""
		if (!this.user.empty)
			result = this.user.toString() + "@"
		if (!this.endpoint.empty)
			result = result + this.endpoint.toString()
		return result
	}
	static parse(data: string | undefined): Authority | undefined {
		let result: Authority | undefined
		if (data) {
			const splitted = data.split("@", 2)
			result = new Authority(
				User.parse(splitted.length == 2 ? splitted.pop() : undefined),
				Endpoint.parse(splitted.pop())
			)
		}
		return result
	}
}
export namespace Authority {}
