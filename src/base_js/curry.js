function curry(func) {
	return function curryFn(...args) {
		if (args.length < func.length) {
			return function() {
				return curryFn(...args.concat(Array.from(arguments)))
			}
		}
		return func(...args)
	}
}


function sum(a, b, c) {
	return a + b + c
}

var currySum = curry(sum)

console.log(currySum(1)(2, 3))
console.log(currySum(1)(2)(3))
console.log(currySum(1)(2, 3))