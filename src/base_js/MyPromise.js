const PENDING = 'PENDING'
const REJECT = 'REJECT'
const FULFILLED = 'FULFILLED'


class MyPromise {
	constructor(executor) {
		try {
			executor(this.resolve, this.reject)
		} catch(e) {
			this.reject(e)
		}
	}
	status = PENDING
	value = undefined
	reason = undefined
	successCallbackArr = []
	failCallbackArr = []
	resolve = (value)  => {
		if (this.status !== PENDING) {
			return
		}
		this.value = value
		this.status = FULFILLED
		while(this.successCallbackArr.length) this.successCallbackArr.shift()()
	}
	reject = (reason) => {
		if (this.status !== PENDING) {
			return
		}
		this.status = REJECT
		this.reason = reason
		while(this.failCallbackArr.length) this.failCallbackArr.shift()()
	}
	then(successCallback, failCallback){
		successCallback = successCallback ? successCallback : value => value
		failCallback = failCallback ? failCallback : reason => {throw reason}
		let promise2 = new MyPromise((resolve,  reject) => {
			if (this.status === FULFILLED) {
				setTimeout(()=> {
					try {
						let x = successCallback(this.value)
						resolvePromise(promise2, x, resolve, reject)
					} catch(e) {
						reject(e)
					}
				}, 0)
			} else if (this.status === REJECT) {
				// reject(failCallback(this.reason))\
				setTimeout(() => {
					try  {
						let x = failCallback(this.reason)
						resolvePromise(promise2, x, resolve, reject)
					} catch(e) {
						reject(e)
					}
				}, 0)
			} else {
				this.successCallbackArr.push(() => {
					setTimeout(()=> {
						try {
							let x = successCallback(this.value)
							resolvePromise(promise2, x, resolve, reject)
						} catch(e) {
							reject(e)
						}
					}, 0)
				})
				this.failCallbackArr.push(() => {
					setTimeout(()=> {
						try {
							let x = failCallback(this.reason)
							resolvePromise(promise2, x, resolve, reject)
						} catch(e) {
							reject(e)
						}
					}, 0)
				})
			}
		})
		return promise2
	}
	static all(arr) {
		let result = []
		let index = 0
		return new MyPromise((resolve,reject) => {
			function addData(index, data) {
				result[index] =  data
				index++
				if (index === arr.length) {
					resolve(result)
				}
			}
			for (let i = 0; i < arr.length;  i++) {
				let current = arr[i]
				if (current instanceof MyPromise) {
					x.then((value) => addData(i, value), reject)
				} else  {
					addData(i, current)
				}
			}
		})
	}
	static resolve(value) {
		if (value instanceof MyPromise) {
			return value
		} else  {
			return new MyPromise((resolve) => resolve(value))
		}
	}
	finally(callback) {
		return this.then((value) => {
			return MyPromise.resolve(callback()).then(() => value)
		}, (reason) => {
			return MyPromise.resolve(callback()).then(() => {throw reason})
		})
	}
	catch(failCallback) {
		return this.then(undefined, failCallback)
	}
}

function resolvePromise(promise2, x, resolve, reject) {
	if (promise2 === x) {
		return reject(new TypeError('cycle return promise'))
	}
	if (x instanceof MyPromise) {
		x.then(resolve, reject)
	} else {
		resolve(x)
	}
}

export default MyPromise
// module.exports = MyPrmise