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

import { User } from "./User"
import { Endpoint } from "./Endpoint"

export class Authority {
	constructor(readonly user: User, readonly endpoint: Endpoint) {
	}
	toString(): string {
		const result: string
		if (this.user)
			result = this.user.toString() + "@"
		if (this.endpoint)
			result = (result ? result : "") + this.endpoint.toString()
		return result
	}
	static parse(data: string): Authority {
		const result: Authority
		if (data) {
			const splitted = data.split("@", 2)
			const user: User
			const endpoint: Endpoint
			if (splitted.length == 2)
				user = User.parse(splitted.pop())
			endpoint = Endpoint.parse(splitted.pop())
			result = new Authority(user, endpoint)
		}
		return result
	}
}
