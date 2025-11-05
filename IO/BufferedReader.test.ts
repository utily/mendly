import { StringReader } from "./StringReader";
import { BufferedReader } from "./BufferedReader";

describe("IO.BufferedReader", () => {
	it("empty", async () => {
		const br = BufferedReader.create(StringReader.create(""));
		expect(await br.isEmpty);
	});
	it("state check", () => {
		const br = BufferedReader.create(StringReader.create(""));
		expect(br.location).toBeTruthy();
		expect(br.region).toBeTruthy();
		expect(br.resource).toBeTruthy();
	});
	it("peek", () => {
		const br = BufferedReader.create(StringReader.create("foobar"));
		expect(br.peek(1)).toEqual("f");
		expect(br.peek(2)).toEqual("fo");
		expect(br.peek(3)).toEqual("foo");
		expect(br.peek(4)).toEqual("foob");
		expect(br.peek(5)).toEqual("fooba");
		expect(br.peek(6)).toEqual("foobar");
	});
	it("read one at a time", () => {
		const br = BufferedReader.create(StringReader.create("abcdef"));
		expect(br.read()).toEqual("a");
		expect(br.read()).toEqual("b");
		expect(br.read()).toEqual("c");
		expect(br.read()).toEqual("d");
		expect(br.read()).toEqual("e");
		expect(br.read()).toEqual("f");
	});
	it("read three at a time", () => {
		const br = BufferedReader.create(StringReader.create("abcdef"));
		expect(br.read(3)).toEqual("abc");
		expect(br.read(3)).toEqual("def");
	});
	it("read three at a time with a newline", () => {
		const br = BufferedReader.create(StringReader.create("abc\ndef"));
		expect(br.read(3)).toEqual("abc");
		expect(br.read(1)).toEqual("\n");
		expect(br.read(3)).toEqual("def");
	});
	it("string location", async () => {
		const br = BufferedReader.create(StringReader.create("abc\ndef"));
		expect(br.location.column).toEqual(1);
		expect(br.location.line).toEqual(1);
		br.read();
		expect(br.location.column).toEqual(2);
		expect(br.location.line).toEqual(1);
		br.read();
		expect(br.location.column).toEqual(3);
		expect(br.location.line).toEqual(1);
		br.read();
		expect(br.location.column).toEqual(4);
		expect(br.location.line).toEqual(1);
		br.read();
		expect(br.location.column).toEqual(1);
		expect(br.location.line).toEqual(2);
		br.read();
		expect(br.location.column).toEqual(2);
		expect(br.location.line).toEqual(2);
		br.read();
		expect(br.location.column).toEqual(3);
		expect(br.location.line).toEqual(2);
		br.read();
		expect(await br.isEmpty);
	});
	it("tabs and newlines location", async () => {
		const reader = BufferedReader.create(StringReader.create("\t\t\t\n\t\t\t"));
		reader.tabSize = 4;
		expect(reader.location.column).toEqual(1);
		expect(reader.location.line).toEqual(1);
		reader.read();
		expect(reader.location.column).toEqual(5);
		expect(reader.location.line).toEqual(1);
		reader.read();
		expect(reader.location.column).toEqual(9);
		expect(reader.location.line).toEqual(1);
		reader.read();
		expect(reader.location.column).toEqual(13);
		expect(reader.location.line).toEqual(1);
		reader.read();
		expect(reader.location.column).toEqual(1);
		expect(reader.location.line).toEqual(2);
		reader.read();
		expect(reader.location.column).toEqual(5);
		expect(reader.location.line).toEqual(2);
		reader.read();
		expect(reader.location.column).toEqual(9);
		expect(reader.location.line).toEqual(2);
		reader.read();
		expect(await reader.isEmpty);
	});
	it("mark", () => {
		const br = BufferedReader.create(StringReader.create("abc\0"));
		expect(br).toBeTruthy();
		if (br) {
			expect(br.mark()).toBeTruthy();
			br.read();
			br.read();
			br.read();
			const region = br.region;
			expect(region).toBeTruthy();
			if (region) {
				expect(region.start).toBeTruthy();
				if (region.start) {
					expect(region.start.line).toEqual(1);
					expect(region.start.column).toEqual(1);
				}
				expect(region.end).toBeTruthy();
				if (region.end) {
					expect(region.end.line).toEqual(1);
					expect(region.end.column).toEqual(4);
				}
			}
		}
	});
});
