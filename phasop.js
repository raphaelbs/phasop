#!/usr/bin/env node

var program = require('commander');
var singlePattern = /\((\-*\d+(?:\.\d+)?)\,(\-*\d+(?:\.\d+)?i*)\)/g;

program
	.version('use "npm list -g phasop" to get your installed version')
	.description('Description:\n\n    Parse and realize operations with complex numbers in format of matrix.\n    <matrix> can be:\n    1. (x,yi) where X is the real part and Y is the imaginary part (you need to explicit type i, the imaginary number)\n    2. (m,r) where M is the modulus and R is the angle in degrees.\n\n    PS: avoid spaces when writing matrix')
	.option('-r, --radian', 'Read and calculate using radians instead of the default Degrees');


function verifyAndPrintEquation(matrixs, signal){
	if(matrixs.length < 2) print('You need to inform at least two matrix\'s for this operation', 1);
	var op = '';
	for(var i = 0; i < matrixs.length; i++){
		if(i!==0) op += signal;
		op += matrixs[i].toMatrix();
	}

	print(op);
}

function opRecur(matrix, index, arr, op){
	if(index+1 === arr.length)
		return printOpResult(matrix.toPol(), matrix.toRect());
	return opRecur(eval('matrix.' + op + '(arr[index+1])'), index+1, arr, op);
}

program
	.command('add <pieces...>')
	.description('\n\tAdd complex numbers in format of matrix.\n')
	.action(function(pieces){
		evalMatrix(pieces, function(matrixs){
			verifyAndPrintEquation(matrixs, ' + ');
			opRecur(matrixs[0], 0, matrixs, 'add');
		});
	});

program
	.command('sub <pieces...>')
	.description('\n\tSub complex numbers in format of matrix.\n')
	.action(function(pieces){
		evalMatrix(pieces, function(matrixs){
			verifyAndPrintEquation(matrixs, ' - ');
			opRecur(matrixs[0], 0, matrixs, 'sub');
		});
	});

program
	.command('mult <pieces...>')
	.description('\n\tMultiply complex numbers in format of matrix.\n')
	.action(function(pieces){
		evalMatrix(pieces, function(matrixs){
			verifyAndPrintEquation(matrixs, ' * ');
		    opRecur(matrixs[0], 0, matrixs, 'mult');
		});
	});

program
	.command('div <pieces...>')
	.description('\n\tDivide complex numbers in format of matrix.\n')
	.action(function(pieces){
		evalMatrix(pieces, function(matrixs){
			verifyAndPrintEquation(matrixs, ' / ');
			opRecur(matrixs[0], 0, matrixs, 'div');
		});
	});

program
	.command('* <pieces...>')
	.description('<matrix>\n\tParse <matrix> to rectangular or polar.')
	.action(function(pieces){
		evalMatrix(pieces, function(matrixs){
			matrixs.forEach(function(matrix){
				print(matrix.toString());
				print(matrix.toOposite().toString());
			});
		})
	});
program.on('--help', function() {
		console.log('  Developed:');
		console.log();
		console.log('    Raphael Brandão');
		console.log('    raphael.b.souza@hotmail.com');
		console.log('    NPM: https://www.npmjs.com/~raphaelbs');
		console.log('    GitHub: https://www.github.com/raphaelbs');
		console.log();
	  });
program.parse(process.argv);

if(!program.args.length){
	program.help();
	process.exit(0);
}

function printOpResult(pol, rect){
	print(pol.toString() + '\n' + rect.toString(), 0);
}

function print(msg, err){
	(err) ? console.error(msg) : console.log(msg);
	if(err) process.exit(1);
}

function parseMatrix(matrix){
	singlePattern.exec('');
	var res = singlePattern.exec(matrix);
	var x = res[1];
	var y = res[2];
	var type = null;
	if(y.match(/i/g))
		type = 'r';
	else
		type = 'p';
	return Matrix(x, y, type);
}

function evalMatrix(arr, callback){
	arr = arr.join('');
	arr = arr.match(singlePattern);
	if(!arr || arr.length===0) print('Matrix should be (x,yi) or (m,r).\nAvoid using spaces\nExample: (10,20)\nType --help for help.', 1);
	for(var p in arr){
		arr[p] = parseMatrix(arr[p]);
	}
	return callback(arr);
}


// Polar to Rectangular
function polToRect(matrix){
	var mod = parseFloat(matrix.x);
	var radius = parseFloat(matrix.y);
	if(!program.radian) radius /= 57.2958;
	var r = (Math.cos(radius)*mod);
	var im = (Math.sin(radius)*mod);
	return Matrix(r, im, 'r');
}

// Rectangular to Polar
function rectToPol(matrix){
	var real = parseFloat(matrix.x);
	var imag = parseFloat(matrix.y);
	var m = Math.hypot(real, imag);
	var r = Math.atan(imag/real);
	if(!program.radian) r *= 57.2958;
	return Matrix(m, r, 'p');
}

function Matrix(x, y, type){
	function strToFixed(str){ return parseFloat(parseFloat(str).toFixed(2)); }
	function toOposite(){ return (type==='r') ? rectToPol(this) : polToRect(this); }
	function toPol(){
		if(this.type === 'r') return rectToPol(this);
		return this;
	}
	function toRect(){
		if(this.type === 'p') return polToRect(this);
		return this;
	}

	function add(matrix2, callback){
		var m1 = this.toRect();
		matrix2 = matrix2.toRect();
		var rect = Matrix((m1.v1 + matrix2.v1), (m1.v2 + matrix2.v2), 'r');
		callback && callback(rect.toPol(), rect);
		return rect;
	}

	function sub(matrix2, callback){
		var m1 = this.toRect();
		matrix2 = matrix2.toRect();
		var rect = Matrix((m1.v1 - matrix2.v1), (m1.v2 - matrix2.v2), 'r');
		callback && callback(rect.toPol(), rect);
		return rect;
	}

	function mult(matrix2, callback){
		var m1 = this.toPol();
		matrix2 = matrix2.toPol();
		var pol = Matrix((m1.v1 * matrix2.v1), (m1.v2 + matrix2.v2), 'p');
		callback && callback(pol, pol.toRect());
		return pol;
	}

	function div(matrix2, callback){
		var m1 = this.toPol();
		matrix2 = matrix2.toPol();
		var pol = Matrix((m1.v1 / matrix2.v1), (m1.v2 - matrix2.v2), 'p');
		callback && callback(pol, pol.toRect());
		return pol;
	}

	return {
		x : x,
		y : y,
		v1 : parseFloat(x),
		v2 : parseFloat(y),
		fx : strToFixed(x),
		fy : strToFixed(y),
		type : type,
		toOposite : toOposite, // inverse mode
		toPol : toPol, toRect : toRect, // to mode
		add : add, sub : sub, mult : mult, div : div, // operations
		toString : function(){ return ((this.type === 'r') ? 'rectangular' : 'polar') + ' form(' + this.fx + ', ' + this.fy + ((this.type === 'r') ? 'i' : (program.radian ? ' radian' : ' degrees')) + ')';
		},
		toMatrix : function(){ return '(' + this.fx + ', ' + this.fy + ((this.type === 'r') ? 'i' : (program.radian ? 'r' : 'd')) + ')';
		}
	};
}
