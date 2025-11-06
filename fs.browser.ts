import * as fs from "node:fs"

async function close(fd: number): Promise<void> {}
async function fsync(fd: number): Promise<void> {}
async function open(path: string, flags: string | number, mode?: string | number | undefined | null): Promise<number> {
	return 0
}

async function write<TBuffer extends NodeJS.ArrayBufferView<ArrayBufferLike>>(
	fd: number,
	buffer?: TBuffer,
	offset?: number,
	length?: number,
	position?: number | null
): Promise<{
	bytesWritten: number
	buffer: TBuffer
}>
async function write<TBuffer extends NodeJS.ArrayBufferView>(
	fd: number,
	buffer?: TBuffer,
	options?: fs.WriteOptions
): Promise<{
	bytesWritten: number
	buffer: TBuffer
}>
async function write(
	fd: number,
	string: string,
	position?: number | null,
	encoding?: BufferEncoding | null
): Promise<{
	bytesWritten: number
	buffer: string
}>
async function write(
	fd: number,
	buffer?: Buffer | string,
	offset?: fs.WriteOptions | number | undefined | null,
	length?: BufferEncoding | number | undefined | null,
	position?: number | null
): Promise<{ bytesWritten: number; buffer: Buffer | string }> {
	return { bytesWritten: 0, buffer: Buffer.alloc(0) }
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
