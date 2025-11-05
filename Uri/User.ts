export class User {
	get isEmpty() {
		return !this.name && !this.password;
	}
	constructor(readonly name?: string, readonly password?: string) {}
	toString(): string {
		let result = "";
		if (this.name) result = this.name;
		if (this.password) result += ":" + this.password;
		return result;
	}
	static parse(data: string | undefined): User {
		let result: User;
		if (data) {
			const splitted = data.split(":", 2);
			result = new User(splitted[0], splitted[1]);
		} else result = new User();
		return result;
	}
}
