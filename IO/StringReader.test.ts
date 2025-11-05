import { StringReader } from "./StringReader";

describe("IO.StringReader", () => {
	it("empty", async () => {
		const reader = StringReader.create("");
		expect(await reader.isEmpty);
	});
	it("state check", () => {
		const reader = StringReader.create("");
		expect(reader.location).toBeTruthy();
		expect(reader.resource).toBeTruthy();
	});
	it("simple string", () => {
		const reader = StringReader.create("abcdef");
		expect(reader.read()).toEqual("a");
		expect(reader.read()).toEqual("b");
		expect(reader.read()).toEqual("c");
		expect(reader.read()).toEqual("d");
		expect(reader.read()).toEqual("e");
		expect(reader.read()).toEqual("f");
	});
	it("simple string with location", async () => {
		const reader = StringReader.create("abc\ndef");
		expect(reader.location.column).toEqual(1);
		expect(reader.location.line).toEqual(1);
		reader.read();
		expect(reader.location.column).toEqual(2);
		expect(reader.location.line).toEqual(1);
		reader.read();
		expect(reader.location.column).toEqual(3);
		expect(reader.location.line).toEqual(1);
		reader.read();
		expect(reader.location.column).toEqual(4);
		expect(reader.location.line).toEqual(1);
		reader.read();
		expect(reader.location.column).toEqual(1);
		expect(reader.location.line).toEqual(2);
		reader.read();
		expect(reader.location.column).toEqual(2);
		expect(reader.location.line).toEqual(2);
		reader.read();
		expect(reader.location.column).toEqual(3);
		expect(reader.location.line).toEqual(2);
		reader.read();
		expect(await reader.isEmpty);
	});
	it("tabs and newlines", async () => {
		const reader = StringReader.create("\t\t\t\n\t\t\t");
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
		const reader = StringReader.create("abc\0");
		expect(reader.mark()).toBeTruthy();
		reader.read();
		reader.read();
		reader.read();
		const region = reader.region;
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
	});
});
