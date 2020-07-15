"use strict";
Array.prototype.shuffle = function () {
    for (let i = this.length; i > 1;)
        this.swap(Math.floor(Math.random() * i--), i);
};
Array.prototype.swap = function (i, j) {
    const t = this[i];
    this[i] = this[j];
    this[j] = t;
};
const msPerStep = 20;
class Algorithm {
    constructor(array) {
        this.array = array;
    }
    update(time) {
        if (this.lastTime === undefined) {
            this.lastTime = time;
            return;
        }
        let steps = Math.round((time - this.lastTime) / msPerStep);
        this.lastTime += steps * msPerStep;
        while (steps-- > 0)
            this.step();
    }
}
class BubbleSort extends Algorithm {
    constructor() {
        super(...arguments);
        this.i = 1;
        this.n = this.array.length;
        this.nNew = 0;
    }
    step() {
        if (this.n <= 1)
            return;
        if (this.i >= this.n) {
            this.i = 1;
            this.n = this.nNew;
            this.nNew = 0;
        }
        if (this.array[this.i - 1] > this.array[this.i]) {
            this.array.swap(this.i - 1, this.i);
            this.nNew = this.i;
        }
        this.i++;
    }
}
function* insertion(a) {
    let accesses = 0;
    let comparisons = 0;
    for (let i = 1; i < a.length; i++) {
        accesses += 2;
        let j = i;
        while (j > 0) {
            accesses++, comparisons++;
            if (a[j - 1] > a[j]) {
                accesses++;
                a.swap(j - 1, j);
                yield [accesses, comparisons, [j - 1, j]];
            }
            else {
                break;
            }
            j--;
        }
    }
    return [accesses, comparisons];
}
class SelectionSort extends Algorithm {
    constructor() {
        super(...arguments);
        this.i = 0;
        this.j = this.i;
        this.jMin = this.j;
    }
    step() {
        if (this.i >= this.array.length - 1)
            return;
        if (this.j >= this.array.length) {
            this.array.swap(this.i, this.jMin);
            this.j = 1 + (this.jMin = ++this.i);
            return;
        }
        if (this.array[this.j] < this.array[this.jMin])
            this.jMin = this.j;
        this.j++;
    }
}
class ShakerSort extends Algorithm {
    constructor() {
        super(...arguments);
        this.i = 1;
        this.iStart = 0;
        this.iEnd = this.array.length - 1;
        this.iNew = this.iStart;
        this.direction = 1;
    }
    step() {
        if (this.iStart >= this.iEnd)
            return;
        if (this.i > this.iEnd) {
            this.i = this.iEnd = this.iNew - 1;
            this.direction *= -1;
        }
        else if (this.i <= this.iStart) {
            this.iStart = this.iNew;
            this.i = this.iStart + 1;
            this.direction *= -1;
        }
        if (this.array[this.i - 1] > this.array[this.i]) {
            this.array.swap(this.i - 1, this.i);
            this.iNew = this.i;
        }
        this.i += this.direction;
    }
}
function update(time) {
    var _a;
    if (lastTime === undefined)
        lastTime = time;
    let steps = Math.round((time - lastTime) / msPerStep);
    lastTime += steps * msPerStep;
    let state;
    while (steps-- > 0) {
        state = algorithm.next();
        if (state.done)
            break;
    }
    if (state === undefined || !state.done)
        window.requestAnimationFrame(update);
    if (state === undefined)
        return;
    document.querySelector('#accesses').textContent = state.value[0].toString();
    document.querySelector('#comparisons').textContent = state.value[1].toString();
    ctx.clearRect(0, 0, can.width, can.height);
    for (let i = 0; i < barCount; i++) {
        ctx.fillStyle = ((_a = state.value[2]) === null || _a === void 0 ? void 0 : _a.includes(i)) ? 'red' : 'black';
        ctx.fillRect(1.5 * i * barWidth, can.height, barWidth, -can.height * (0.1 + 0.9 * array[i] / (barCount - 1)));
    }
}
const can = document.querySelector('canvas');
const ctx = can.getContext('2d');
const barCount = 50;
const barWidth = can.width / (1.5 * barCount - 0.5);
const array = [];
for (let i = 0; i < barCount; i++)
    array[i] = i;
array.shuffle();
let algorithm = insertion(array);
let lastTime;
window.requestAnimationFrame(update);
