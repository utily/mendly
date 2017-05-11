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

import * as Constraints from "./Constraints"

export class Is {
	static True(): Constraints.TrueConstraint	{ return new Constraints.TrueConstraint() }
	static False(): Constraints.FalseConstraint { return new Constraints.FalseConstraint() }
	static Null():  Constraints.NullConstraint{ return new Constraints.NullConstraint() }
	static NullOrUndefined(): Constraints.NullOrUndefinedConstraint { return new Constraints.NullOrUndefinedConstraint() }
	static Undefined(): Constraints.UndefinedConstraint { return new Constraints.UndefinedConstraint() }
	static Equal():  Constraints.EqualModifier { return new Constraints.EqualModifier() }
	static Not(): Constraints.NotModifier { return new Constraints.NotModifier() }
	static Empty(): Constraints.EmptyConstraint { return new Constraints.EmptyConstraint() }
}
