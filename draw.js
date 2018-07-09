/*模拟ps中的钢笔工具，即实现Beizer曲线的绘制
* 2018.07.09
 */

var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');

// 基本参数
var settings = {
	dotRadius : 6,
	mouseDownDotColor : '#fab1a0',
	mouseUpDotColor : '#00cec9',
	symmetricDotColor : '#81ecec',
	straightLineColor : '#000'
};

var mouseDownDotPos = new Array();
var mouseUpDotPos = new Array();

var isMouseDown = false;
window.onload = function () {
	initCanvasSize();

	draw();
	canvas.onmousedown = function (e) {
		mouseDownDotPos.push(getDotPos(e));
		isMouseDown = true;
	}
	canvas.onmousemove = function (e) {
		if(isMouseDown) {
			mouseUpDotPos[mouseDownDotPos.length - 1] = getDotPos(e);
		}
	}
	canvas.onmouseup = function (e) {
		isMouseDown = false;
	}

	document.onkeydown = function (e) {
		// backspace键撤销
		if(e.keyCode == 8) {
			mouseUpDotPos.pop();
			mouseDownDotPos.pop();
		}
		// delete键清空
		if(e.keyCode == 46) {
			mouseUpDotPos.length = 0;
			mouseDownDotPos.length = 0;
		}
	}
}

function initCanvasSize() {
	canvas.width = window.innerWidth * 0.8;
	canvas.height = window.innerHeight * 0.8;
	canvas.style.marginLeft = window.innerWidth * 0.1 + 'px';
	canvas.style.marginTop = window.innerHeight * 0.1 + 'px';

	window.onresize = function () {
		initCanvasSize();
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawStraightLine();
	drawBeizerCurve();
	drawMouseDownDot();
	drawMouseUpDot();
	
	window.requestAnimationFrame(draw);
}

function drawMouseDownDot() {
	ctx.fillStyle = settings.mouseDownDotColor;
	for(var i = 0; i < mouseDownDotPos.length; i++) {
		ctx.beginPath();
		ctx.arc(mouseDownDotPos[i].x, mouseDownDotPos[i].y, settings.dotRadius, 0, Math.PI * 2, true);
		ctx.fill();
	}
}

function drawMouseUpDot() {
	for(var i = 0; i < mouseUpDotPos.length; i++) {
		ctx.beginPath();
		ctx.fillStyle = settings.mouseUpDotColor;
		ctx.arc(mouseUpDotPos[i].x, mouseUpDotPos[i].y, settings.dotRadius, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.beginPath();
		ctx.fillStyle = settings.symmetricDotColor;
		ctx.arc(symmetricPoint(mouseUpDotPos[i], mouseDownDotPos[i]).x,
			symmetricPoint(mouseUpDotPos[i], mouseDownDotPos[i]).y, settings.dotRadius, 0, Math.PI * 2, true);
		ctx.fill();
	}
}

function drawStraightLine() {
	ctx.strokeStyle = settings.straightLineColor;
	for(var i = 0; i < mouseUpDotPos.length; i++) {
		ctx.beginPath();
		ctx.moveTo(mouseUpDotPos[i].x, mouseUpDotPos[i].y);
		ctx.lineTo(mouseDownDotPos[i].x, mouseDownDotPos[i].y);
		ctx.lineTo(symmetricPoint(mouseUpDotPos[i], mouseDownDotPos[i]).x, symmetricPoint(mouseUpDotPos[i], mouseDownDotPos[i]).y);
		ctx.stroke();
	}
}

function drawBeizerCurve() {
	if(mouseUpDotPos.length >= 2 && mouseDownDotPos.length >= 2) {
		for(var i = 0; i < mouseUpDotPos.length - 1; i++) {
			ctx.beginPath();
			ctx.moveTo(mouseDownDotPos[i].x, mouseDownDotPos[i].y);

			ctx.bezierCurveTo(mouseUpDotPos[i].x, mouseUpDotPos[i].y,
				symmetricPoint(mouseUpDotPos[i + 1], mouseDownDotPos[i + 1]).x,
				symmetricPoint(mouseUpDotPos[i + 1], mouseDownDotPos[i + 1]).y,
				mouseDownDotPos[i + 1].x, mouseDownDotPos[i + 1].y);
			ctx.stroke();
		}
	}
}
function getDotPos(e) {
	var x = e.clientX - canvas.offsetLeft;
	var y = e.clientY - canvas.offsetTop;
	return {x, y};
}

function distance(pos1, pos2) {
	return Math.sqrt((pos1.x - pos2.x) * (pos1.x - pos2.x) + (pos1.y- pos2.y) *(pos1.y- pos2.y));
}

function symmetricPoint(pos1, pos2) {
	var x = (pos1.x > pos2.x) ? (pos2.x - (pos1.x - pos2.x)) : (pos2.x + (pos2.x - pos1.x));
	var y = (pos1.y > pos2.y) ? (pos2.y - (pos1.y - pos2.y)) : (pos2.y + (pos2.y - pos1.y));
	return {x, y};
}