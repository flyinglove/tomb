import PromiseObj from './promiseFun.js'
new Promise((resolve, reject) => {
	reject(5)
}).then({}).then((data) => {
	console.log(data)
}, (data) => {
	console.log('err' + data)
})