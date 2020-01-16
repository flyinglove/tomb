class PromiseObj {
	// 状态 resolve, reject, pending
	constructor(executor) {
		this.status = 'pending'
		this.value = undefined
		this.reason = undefined

		this.onResolvedCallbacks = []
		this.onRejectedCallbacks = []

		let resolve = (data) => {
			if (this.status === 'pending') {
				this.status = 'resolve'
				this.value = data

				this.onResolvedCallbacks.forEach(fn => fn())
			}
		}
		let reject = (data) => {
			if (this.status === 'pending') {
				this.status = 'reject'
				this.reason = data

				this.onRejectedCallbacks.forEach(fn => fn())
			}
		}
		try{
			executor(resolve, reject)
		}catch(err) {
			reject(err)
		}
	}
	then(onFufilled, onReject) {
		onFufilled = typeof onFufilled === 'function' ? onFufilled : y => y
		onReject = typeof onReject === 'function' ? onReject : err => { throw err; }
		let promise2
		if (this.status === 'pending') {
			promise2 = new PromiseObj((resolve, reject) => {
				this.onResolvedCallbacks.push(() => {
				setTimeout(() => {
					try {
						let x = onFufilled(this.value)
						resolvePromise(promise2, x, resolve, reject)
					} catch(e) {
						reject(e)
					}
				}, 0)
			})
			this.onRejectedCallbacks.push(() => {
				setTimeout(() => {
					try {
						let x = onReject(this.reason)
						resolvePromise(promise2, x, resolve, reject)
					} catch(e) {
						reject(e)
					}
				}, 0)
			})})
		}
		if (this.status === 'resolve') {
			promise2 = new PromiseObj((resolve, reject) => {
				setTimeout(() => {
					try {
						x = onFufilled(this.value)
						resolvePromise(promise2, x, resolve, reject)
					}catch(e) {
						reject(e)
					}
				}, 0)
			})
		}
		if (this.status === 'reject') {
			promise2 = new PromiseObj((resolve, reject) => {
				setTimeout(() => {
					try {
						let x = onReject(this.reason)
						resolvePromise(promise2, x, resolve, reject)
					}catch(e) {
						reject(e)
					}
				}, 0)
			})
		}
		return promise2
	}
	catch(onRejected) {
		return this.then(null, onReject)
	}
	resolve(val) {
		return new PromiseObj((resolve) => {
			resolve(val)
		})
	}
	reject(val) {
		return new PromiseObj((resolve, reject) => {
			reject(val)
		})
	}
	all(promiseArr) {
		let arr = []
		let i = 0
		function processData(index, data) {
			arr[index] = data
			i++
			if (i === promiseArr.length) {
				resolve(arr)
			}
		}
		return new PromiseObj((resolve, reject) => {
			for (let i = 0; i < promiseArr.length; i++) {
				promiseArr[i].then(data => {
					processData(i, data)
				}, reject)
			}
		})
	}
	race(promiseArr) {
		return new PromiseObj((resolve, reject) => {
			for (let i = 0; i < promiseArr.length; i++) {
				promiseArr[i].then(resolve, reject)
			}
		})
	}
}

/**
1. 如果promise和x是同一个对象， 
promise2是新建的promise2, x是在同时从then里面函数的返回值， 如果x是promise的话说是直接返回了这个x, 但本质上也是新建了一个promise, 但本质上还是用了新建的promise， 和在外面
*/
function resolvePromise(promise2, x, resolve, reject) {
	if (x === promise2) {
		reject(new TypeError('err'))
	}
	if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
		let called
		debugger
		try {
			// 如果x是promise的话
			let then = x.then
			if (typeof then === 'function') {
				then.call(x, y => {
					if (called) return
					called = true
					resolvePromise(promise2, y, resolve, reject)
				}, err => {
					if (called) return
					called = true
					resolvePromise(promise2, y, resolve, reject)
				})
			} else {
				resolve(x)
			}
		} catch(err) {
			reject(err)
		}
	} else {
		resolve(x)
	}
}

export default PromiseObj

