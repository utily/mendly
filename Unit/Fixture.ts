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

/// <reference path="Test" />
/// <reference path="TestFailedError" />
/// <reference path="../Error/ConsoleHandler" />
/// <reference path="./Constraints/Constraint" />
/// <reference path="./Constraints/TrueConstraint" />
/// <reference path="../Utilities/String" />
/// <reference path="ErrorHandler" />


module U10sil.Unit {
	export abstract class Fixture {
		private tests: Test[] = []
		private expectId = 0
		private errorHandler: Error.Handler
		constructor(private name: string, private reportOnPass = true) {
			this.errorHandler = new ErrorHandler(new Error.ConsoleHandler(), new Error.Region(name))
		}
		getName(): string { return this.name }
		add(name: string, action: () => void): void {
			this.tests.push(new Test(name, action))
		}
		run(): boolean {
			var failures: TestFailedError[] = []
			var result = true
			this.tests.forEach(test => {
				try {
					test.run()
				} catch (Error) {
					if (Error instanceof TestFailedError) {
						var e = <TestFailedError>Error
						e.setTest(test)
						e.setExpectId(this.expectId)
						failures.push(e)
						result = false
					} else {
						console.dir("[Fixture]", Error)
						throw Error
					}
				}
				this.expectId = 0
			})
			if ((result && this.reportOnPass) || !result)
				this.prettyPrintTestResult(result)

			if (!result) {
				failures.forEach(failure => {
					var expectedMessage = "expected '" + failure.getConstraint().getExpectedValue() + "', found '" + failure.getValue() + "'"
					var whereMessage = "[expect #" + failure.getExpectId() + " in '" + failure.getTest().toString() + "']"
					this.errorHandler.raise("  -> " + expectedMessage + " " + whereMessage)
				})
			}
			return result;
		}
		expect(value: any, constraint: Constraints.Constraint = null): void {
			this.expectId++
			if (constraint == null)
				constraint = new Constraints.TrueConstraint()
			if (!constraint.verify(value))
				throw new TestFailedError(value, constraint)
		}
		//
		// This is a temporary thing to make it easier on the eyes when reading
		// test results in the terminal.
		//
		private prettyPrintTestResult(success: boolean) {
			var coloredString = "\x1b[" + (success ? "32mpassed" : "31mfailed")
			var colorReset = "\x1b[0m"
			var message = coloredString + colorReset
			var result = Utilities.String.padRight(this.name, ".", 50) + ": " + message
			console.log(result)
		}

		private static fixtures: Fixture[] = []
		static add(fixture: Fixture) {
			Fixture.fixtures.push(fixture)
		}
		static run() {
			Fixture.fixtures.forEach((fixture) => { fixture.run() })
		}
	}
}
