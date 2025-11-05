export class String {
	static pad(value: string, padding: string, width: number, side: "left" | "right" = "right") {
		const p = padding.repeat(Math.max(0, width - value.length))
		return side == "left" ? p + value : value + p
	}
}
export namespace String {}
