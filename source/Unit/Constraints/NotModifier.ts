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
import { CompareConstraint } from "./CompareConstraint"
import { FalseConstraint } from "./FalseConstraint"
import { TrueConstraint } from "./TrueConstraint"
import { EqualModifier } from "./EqualModifier"
import { NullConstraint } from "./NullConstraint"
import { NullOrUndefinedConstraint } from "./NullOrUndefinedConstraint"
import { UndefinedConstraint } from "./UndefinedConstraint"
import { EmptyConstraint } from "./EmptyConstraint"

export class NotModifier extends Modifier {
	constructor(parent?: Modifier) {
		super(parent)
	}
	test(value: any): boolean {
		return !(this.testChild(value))
	}
	get null() { return new NullConstraint(this) }
	get nullOrUndefined() { return new NullOrUndefinedConstraint(this) }
	get undefined() { return new UndefinedConstraint(this) }
	get false() { return new FalseConstraint(this) }
	get true() { return new TrueConstraint(this) }
	get equal() { return new EqualModifier(this) }
	get not() { return new NotModifier(this) }
	get empty() { return new EmptyConstraint(this) }
}
