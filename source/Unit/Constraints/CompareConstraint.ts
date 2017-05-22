// The MIT License (MIT)
//
// Copyright (c) 2016 Simon Mika
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

import { Constraint } from "./Constraint"
import { Modifier } from "./Modifier"

export class CompareConstraint extends Constraint {
	get expectedValue(): any { return this.correct }
	constructor(private correct: any, parent?: Modifier) {
		super(parent)
	}
	test(value: any): boolean {
		return this.compare(value, this.correct)
	}
	compare(left: any, right: any): boolean {
		var result = false
		var type = typeof(left)
		if (type == typeof(right)) {
			switch(type) {
				case "number":
				case "string":
				case "boolean":
					result = left == right
					break
				case "object":
					if (!(result = left == right)) {
						if (left instanceof(Array) && right instanceof(Array)) {
							if (result = (<Array<any>>left).length == (<Array<any>>right).length)
								for (var i = 0; result && i < (<Array<any>>left).length; i++)
									result = this.compare((<Array<any>>left)[i], (<Array<any>>right)[i])
						} else
							console.log(type)
					}
					break
				case "undefined":
					result = true
					break
				default:
					console.log(type)
					break
			}
		}
		return result
	}
}
