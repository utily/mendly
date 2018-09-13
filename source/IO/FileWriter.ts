// The MIT License (MIT)
//
// Copyright (c) 2018 Simon Mika
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as fs from "fs"
import * as util from "util"
import * as path from "path"

import * as Uri from "../Uri"
import { Enumerator } from "../Utilities"
import { Writer } from "./Writer"

const open = util.promisify(fs.open)
const fsync = util.promisify(fs.fsync)
const close = util.promisify(fs.close)
const write = util.promisify(fs.write)

export class FileWriter extends Writer {
	get opened(): boolean { return this.descriptor > 0 }
	get writable(): boolean { return this.descriptor > 0 }
	autoFlush: boolean = false
	constructor(readonly resource: Uri.Locator, private descriptor: number) {
		super()
	}
	async flush(): Promise<boolean> {
		let result = true
		try {
			await fsync(this.descriptor)
		} catch (error) {
			result = false
		}
		return result
	}
	async close(): Promise<boolean> {
		let result = this.opened
		if (result) {
			try {
				await close(this.descriptor)
			} catch (error) {
				result = false
			}
			this.descriptor = 0
		}
		return result
	}
	protected async writeImplementation(buffer: Enumerator<string>): Promise<boolean> {
		let result = true
		const content = new Buffer(buffer.reduce((r, item) => r + item, ""))
		try {
			const r = await write(this.descriptor, content, 0, "utf8")
			result = r.bytesWritten == content.length
		} catch (error) {
			result = false
		}
		return result && (!this.autoFlush || await this.flush())
	}
	static async open(resource: Uri.Locator): Promise<Writer | undefined> {
		let backend: number | undefined
		if (resource && (resource.scheme.length == 0 || resource.scheme.length == 1 && resource.scheme[0] == "file"))
			try {
				backend = await open((resource.isRelative ? "" : path.sep) + resource.path.join(path.sep), "w")
			} catch (error) {
				backend = undefined
			}
		return backend ? new FileWriter(resource, backend) : undefined
	}
}
Writer.addOpener(FileWriter.open)
