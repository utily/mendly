import { Uri } from "../Uri"
import { Position } from "./Position"
import { Region } from "./Region"

describe("mendly.Error.Region", () => {
	const resource = new Uri([], undefined, ["file.txt"])

	it.each([
		{
			name: "combines both contents",
			left: new Region(resource, new Position(1, 1), new Position(1, 2), "ab"),
			right: new Region(resource, new Position(1, 3), new Position(1, 4), "cd"),
			expected: "abcd"
		},
		{
			name: "keeps left content when right content is missing",
			left: new Region(resource, new Position(1, 1), new Position(1, 2), "ab"),
			right: new Region(resource, new Position(1, 3), new Position(1, 4), undefined),
			expected: "ab"
		},
		{
			name: "keeps right content when left content is missing",
			left: new Region(resource, new Position(1, 1), new Position(1, 2), undefined),
			right: new Region(resource, new Position(1, 3), new Position(1, 4), "cd"),
			expected: "cd"
		}
	])("merge $name", ({ left, right, expected }) => expect(left.merge(right)?.content).toEqual(expected))

	it("merge without other returns itself", () => {
		const region = new Region(resource, new Position(1, 1), new Position(1, 2), "ab")
		expect(region.merge()).toBe(region)
	})

	it.each([
		{
			name: "with range and content",
			region: new Region(resource, new Position(2, 3), new Position(2, 4), "xy"),
			expected: `${resource.toString()} (Ln 2, Col 3 - Ln 2, Col 4) xy`
		},
		{ name: "without range and content", region: new Region(resource), expected: resource.toString() }
	])("toString $name", ({ region, expected }) => expect(region.toString()).toEqual(expected))
})
