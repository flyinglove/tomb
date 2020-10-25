// function compose(...args) {
// 	return function(value) {
// 		return args.reverse().reduce(function(acc, fn) {
// 			return fn(acc)
// 		},  value)
// 	}
// }

const compose = (...args) => value => args.reverse().reduce((acc, fn) => fn(acc), value)

const reverse = arr => arr.reverse()
const first = item  => item[0]
const fn = compose(first, reverse)
const arr = ['a','b','c']
console.log(fn(arr))