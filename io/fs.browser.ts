async function close(fd: number): Promise<void> {}
async function fsync(fd: number): Promise<void> {}
async function open(path: string, flags: string | number, mode?: string | number | undefined | null): Promise<number> {
	return 0
}
async function write(
	fd: number,
	buffer: Buffer | string,
	offset: number | undefined | null,
	encoding: "utf8"
): Promise<{ bytesWritten: number }> {
	return { bytesWritten: 0 }
}

function lstatSync(
	path: string | number,
	options?: { encoding?: null; flag?: string } | null
): { isDirectory: () => boolean } {
	return { isDirectory: () => false }
}
function readdirSync(path: string): string[] {
	return []
}
function readFileSync(path: string | number, encoding: "utf-8"): string {
	return ""
}

export { close, fsync, open, write, lstatSync, readdirSync, readFileSync }
