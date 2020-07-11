"use strict";
Array.prototype.shuffle = function () {
    for (var i = this.length; i > 0;) {
        var j = Math.floor(Math.random() * i--);
        var t = this[i];
        this[i] = this[j];
        this[j] = t;
    }
};
function step() {
    if (iBubble >= nBubble) {
        iBubble = 0;
        nBubble--;
        if (nBubble <= 0)
            return;
    }
    iBubble++;
    if (array[iBubble - 1] > array[iBubble]) {
        var t = array[iBubble];
        array[iBubble] = array[iBubble - 1];
        array[iBubble - 1] = t;
    }
}
function draw() {
    ctx.clearRect(0, 0, can.width, can.height);
    for (var i = 0; i < barCount; i++) {
        var n = array[i];
        ctx.fillRect(1.5 * i * barWidth, can.height, barWidth, -can.height * (0.1 + 0.9 * n / (barCount - 1)));
    }
    step();
    step();
    window.requestAnimationFrame(draw);
}
var can = document.querySelector('canvas');
var ctx = can.getContext('2d');
var barCount = 100;
var barWidth = can.width / (1.5 * barCount - 0.5);
var array = [];
for (var i = 0; i < barCount; i++)
    array[i] = i;
array.shuffle();
var nBubble = barCount;
var iBubble = 0;
window.requestAnimationFrame(draw);
