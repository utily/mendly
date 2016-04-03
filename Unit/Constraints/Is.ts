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

import { Constraint, Modifier } from "./Constraint"
import { CompareConstraint } from "./CompareConstraint"
import { FalseConstraint } from "./FalseConstraint"
import { TrueConstraint } from "./TrueConstraint"
import { EqualModifier } from "./EqualModifier"
import { NullConstraint } from "./NullConstraint"
import { NullOrUndefinedConstraint } from "./NullOrUndefinedConstraint"
import { UndefinedConstraint } from "./UndefinedConstraint"
import { NotModifier } from "./NotModifier"
import { EmptyConstraint } from "./EmptyConstraint"

export { Constraint, Modifier } from "./Constraint"
export { CompareConstraint } from "./CompareConstraint"
export { FalseConstraint } from "./FalseConstraint"
export { TrueConstraint } from "./TrueConstraint"
export { EqualModifier } from "./EqualModifier"
export { NullConstraint } from "./NullConstraint"
export { NullOrUndefinedConstraint } from "./NullOrUndefinedConstraint"
export { UndefinedConstraint } from "./UndefinedConstraint"
export { NotModifier } from "./NotModifier"
export { EmptyConstraint } from "./EmptyConstraint"

export class Is {
	static True() { return new TrueConstraint() }
	static False() { return new FalseConstraint() }
	static Null() { return new NullConstraint() }
	static NullOrUndefined() { return new NullOrUndefinedConstraint() }
	static Undefined() { return new UndefinedConstraint() }
	static Equal() { return new EqualModifier() }
	static Not() { return new NotModifier() }
	static Empty() { return new EmptyConstraint() }
}
