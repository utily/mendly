import { User } from "./User";
import { Endpoint } from "./Endpoint";

export class Authority {
	get isEmpty() {
		return this.user.isEmpty && this.endpoint.isEmpty;
	}
	constructor(
		readonly user: User = new User(),
		readonly endpoint: Endpoint = new Endpoint()
	) {}
	toString(): string {
		let result = "";
		if (!this.user.isEmpty) result = this.user.toString() + "@";
		if (!this.endpoint.isEmpty) result = result + this.endpoint.toString();
		return result;
	}
	static parse(data: string | undefined): Authority | undefined {
		let result: Authority | undefined;
		if (data) {
			const splitted = data.split("@", 2);
			result = new Authority(
				User.parse(splitted.length == 2 ? splitted.pop() : undefined),
				Endpoint.parse(splitted.pop())
			);
		}
		return result;
	}
}
