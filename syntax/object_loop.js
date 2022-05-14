var members = ['hello', 'world', 'hi'];
console.log(members);

for (var i = 0; i < members.length; i++) {
	console.log('array loop', members[i]);
}
console.log();

var roles = {
	'programmer': 'engoing',
	'designer': 'k8805',
	'manager': 	'hoya'
}
console.log(roles.designer);
console.log(roles['designer']);

for (var i in roles) {
	console.log('object => ', i, 'value => ', roles[i]);
}