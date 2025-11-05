import * as fs from "fs"
import * as util from "util"

const close = util.promisify(fs.close)
const fsync = util.promisify(fs.fsync)
const open = util.promisify(fs.open)
const write = util.promisify(fs.write)

const lstatSync = fs.lstatSync
const readdirSync = fs.readdirSync
const readFileSync = fs.readFileSync

export { close, fsync, open, write, lstatSync, readdirSync, readFileSync }
