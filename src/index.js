// // import PromiseObj from './promiseFun.js'
// // new Promise((resolve, reject) => {
// // 	reject(5)
// // }).then({}).then((data) => {
// // 	console.log(data)
// // }, (data) => {
// // 	console.log('err' + data)
// // })

// import MyPromise from './base_js/MyPromise.js'


// const  promise  = new MyPromise(function(resolve, reject) {
// 	setTimeout(() => {
// 		// resolve(223311)
// 		reject('error')
// 		// throw new Error('error')
// 	}, 2000)
// 	// resolve(22333)
// })

// function other() {
// 	return new MyPromise((resolve) => {
// 		resolve('other')
// 	})
// }
// // let p1 = promise.then((value) => {
// // 	// console.log(value, 333222)
// // 	// throw new Error('error')
// // 	return 'aaa'
// // }).then(value => console.log(value)z, error => console.log('aaaaa',  error))
// // promise.then().then().then(value => console.log('+++',  value), value => console.log('=-',  value))
// // MyPromise.all([() => 122, 'a', 'b']).then(arr => console.log(arr)) 
// promise.then().finally(() => console.log(333)).then(a => console.log(a),a => console.log(a))
// // p1.then(err => console.log(23323, err), a=> console.log(4444, a))
// // promise.then(value => console.log(2222, value), reason => console.log(4444, reason))

new Promise((resolve, reject) => {
	setTimeout(function() {
		var a = 'hello'
		resolve()
	}, 1000)
}).then(() => {
	setTimeout(() => {
		var b = 'lagou'
		return
	},1000)
}).then(() => {
	setTimeout(() => {
		var c = 'I love U'
		console.log(a + b + c)
	}, 1000)
})