// 자바스크립트의 함수는 처리 작업을 그룹화한 구문(statements)이면서, 동시에 값(value) 이기도 하다.
function f() {
	console.log(1 + 1);
	console.log(1 + 2);
}

// var i = if (true) {console.log(1)};	// error
// var w = while (true) {console.log(1)};	// error
console.log(f);	// 출력 결과: [Function: f]
f();
console.log();

// 배열의 원소로서의 함수
var a = [f];
a[0]();
console.log();

// 객체의 데이더, 즉 속성(properties)로서의 함수
var o = {
	func: f
}

o.func();