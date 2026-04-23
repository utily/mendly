import { Uri } from "../Uri"
import { Position } from "./Position"
import { Region } from "./Region"

describe("mendly.Error.Region", () => {
	it("merge combines content from both regions", () => {
		const resource = new Uri([], undefined, ["file.txt"])
		expect(
			new Region(resource, new Position(1, 1), new Position(1, 2), "ab").merge(
				new Region(resource, new Position(1, 3), new Position(1, 4), "cd")
			)?.content
		).toEqual("abcd")
	})
})
