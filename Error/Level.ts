export type Level = typeof Level.values[number]

export namespace Level {
	export const values = ["logging", "debug", "warning", "recoverable", "critical"] as const
}
