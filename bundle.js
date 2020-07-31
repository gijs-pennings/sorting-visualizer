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
Array.prototype.swapValue = function (i, v) {
    const t = this[i];
    this[i] = v;
    return t;
};
function newElt(tag, options) {
    const e = document.createElement(tag);
    if (options === null || options === void 0 ? void 0 : options.class)
        e.className = options.class;
    if (options === null || options === void 0 ? void 0 : options.click)
        e.onclick = options.click;
    if (options === null || options === void 0 ? void 0 : options.id)
        e.id = options.id;
    if (options === null || options === void 0 ? void 0 : options.text)
        e.textContent = options.text;
    return e;
}
function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}
class NumberRange {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    empty() {
        return this.start >= this.end;
    }
    includes(i) {
        return this.start <= i && i < this.end;
    }
    intersection(start, end) {
        return new NumberRange(Math.max(this.start, start), Math.min(this.end, end));
    }
}
function* bubble(a) {
    let accesses = 0;
    let comparisons = 0;
    for (let n = a.length; n > 1;) {
        accesses++;
        let m = 0;
        for (let i = 1; i < n; i++) {
            accesses++, comparisons++;
            yield [accesses, comparisons, [i - 1, i]];
            accesses++;
            if (a[i - 1] > a[i]) {
                a.swap(i - 1, i);
                m = i;
            }
        }
        accesses++;
        n = m;
    }
    return [accesses, comparisons];
}
function* bubbleBi(a) {
    let accesses = 0;
    let comparisons = 0;
    let iStart = 0;
    let iEnd = a.length - 1;
    while (iStart < iEnd) {
        let iNew = iStart;
        accesses++;
        for (let i = iStart + 1; i <= iEnd; i++) {
            accesses++, comparisons++;
            yield [accesses, comparisons, [i - 1, i]];
            accesses++;
            if (a[i - 1] > a[i]) {
                a.swap(i - 1, i);
                iNew = i;
            }
        }
        accesses++;
        iEnd = --iNew;
        accesses++;
        for (let i = iEnd; i > iStart; i--) {
            accesses++, comparisons++;
            yield [accesses, comparisons, [i - 1, i]];
            accesses++;
            if (a[i - 1] > a[i]) {
                a.swap(i - 1, i);
                iNew = i;
            }
        }
        accesses++;
        iStart = iNew;
    }
    return [accesses, comparisons];
}
function* comb(a) {
    let accesses = 0;
    let comparisons = 0;
    let gap = a.length;
    const shrink = 1.3;
    for (let done = true; gap > 1 || !done;) {
        done = true;
        gap = Math.max(Math.floor(gap / shrink), 1);
        if (gap === 9 || gap === 10)
            gap = 11;
        for (let i = gap; i < a.length; i++) {
            accesses += 2, comparisons++;
            yield [accesses, comparisons, [i - gap, i]];
            if (a[i - gap] > a[i]) {
                accesses += 2;
                a.swap(i - gap, i);
                done = false;
            }
        }
    }
    return [accesses, comparisons];
}
const heapColors = Object.freeze([
    '#f8b88a', '#baed90', '#b2cefd', '#f2a2e7',
    '#f8b88b', '#baed91', '#b2cefe', '#f2a2e8',
    '#f8b88c', '#baed92', '#b2ceff', '#f2a2e9'
]);
function* heap(a) {
    let accesses = 0;
    let comparisons = 0;
    let size = a.length;
    const getHeapColors = function (i) {
        const colors = {};
        for (let e = 0; Math.pow(2, e) - 1 < size; e++)
            colors[heapColors[e]] = new NumberRange(Math.pow(2, e) - 1, Math.min(Math.pow(2, (e + 1)) - 1, size));
        if (size === a.length)
            for (const c in colors) {
                const r = colors[c].intersection(i, a.length);
                if (r.empty()) {
                    delete colors[c];
                }
                else {
                    colors[c] = r;
                    break;
                }
            }
        return colors;
    };
    const p = (i) => Math.floor((i - 1) / 2);
    const l = (i) => 2 * i + 1;
    const r = (i) => 2 * i + 2;
    const heapify = function* (i) {
        let j = i;
        while (r(j) < size) {
            accesses += 2, comparisons++;
            yield [accesses, comparisons, Object.assign({ '>': [l(j), r(j)] }, getHeapColors(i))];
            j = a[l(j)] > a[r(j)] ? l(j) : r(j);
        }
        if (l(j) < size)
            j = l(j);
        accesses += 2;
        while (true) {
            comparisons++;
            yield [accesses, comparisons, Object.assign({ '>': [i, j] }, getHeapColors(i))];
            if (a[i] <= a[j])
                break;
            accesses++;
            j = p(j);
        }
        let x = a[j];
        accesses++;
        a[j] = a[i];
        while (i < j) {
            j = p(j);
            accesses += 2;
            x = a.swapValue(j, x);
        }
    };
    for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--)
        yield* heapify(i);
    for (size--; size > 0; size--) {
        a.swap(0, size);
        yield* heapify(0);
    }
    return [accesses, comparisons];
}
function* insertion(a) {
    let accesses = 0;
    let comparisons = 0;
    for (let i = a.length - 2; i >= 0; i--) {
        accesses++;
        for (let j = i + 1; j < a.length; j++) {
            accesses++, comparisons++;
            yield [accesses, comparisons, [j - 1, j]];
            if (a[j - 1] <= a[j])
                break;
            accesses++;
            a.swap(j - 1, j);
        }
        accesses++;
    }
    return [accesses, comparisons];
}
function* insertionBS(a) {
    let accesses = 0;
    let comparisons = 0;
    for (let i = a.length - 2; i >= 0; i--) {
        accesses++;
        let l = i + 1;
        let r = a.length - 1;
        while (l <= r) {
            const m = Math.ceil((l + r) / 2);
            accesses++, comparisons++;
            yield [accesses, comparisons, { '>': [i, m], '!': [l, r] }];
            if (a[m] < a[i])
                l = m + 1;
            else
                r = m - 1;
        }
        accesses += 2 * (l - (i + 1));
        for (let j = i + 1; j < l; j++)
            a.swap(j - 1, j);
        accesses++;
    }
    return [accesses, comparisons];
}
function* mergeUp(a) {
    let accesses = 0;
    let comparisons = 0;
    let b = new Array(a.length);
    for (let width = 1; width < a.length; width *= 2)
        for (let i = 0; i < a.length; i += 2 * width) {
            const pMax = i + width;
            if (pMax >= a.length)
                continue;
            const qMax = Math.min(a.length, i + width * 2);
            let p = i;
            let q = pMax;
            for (let j = i; j < qMax; j++)
                if (p < pMax) {
                    if (q >= qMax) {
                        yield [accesses, comparisons, [p]];
                        accesses += 2;
                        b[j] = a[p];
                        p++;
                    }
                    else {
                        accesses += 2, comparisons++;
                        yield [accesses, comparisons, [p, q]];
                        accesses++;
                        if (a[p] <= a[q])
                            b[j] = a[p], p++;
                        else
                            b[j] = a[q], q++;
                    }
                }
                else {
                    yield [accesses, comparisons, [q]];
                    accesses += 2;
                    b[j] = a[q];
                    q++;
                }
            for (let j = i; j < qMax; j++) {
                accesses += 2;
                a[j] = b[j];
            }
        }
    return [accesses, comparisons];
}
function* quickHoare(a) {
    let accesses = 0;
    let comparisons = 0;
    const stack = [];
    if (a.length > 1)
        stack.push(0, a.length - 1);
    while (stack.length > 0) {
        const hi = stack.pop();
        const lo = stack.pop();
        let iPivot;
        if (hi - lo < 25) {
            accesses++;
            iPivot = Math.floor((lo + hi) / 2);
        }
        else {
            const indices = [randomInt(lo, hi), randomInt(lo, hi), randomInt(lo, hi)];
            accesses += 2, comparisons++;
            yield [accesses, comparisons, [indices[0], indices[1]]];
            if (a[indices[0]] > a[indices[1]])
                indices.swap(0, 1);
            accesses++, comparisons++;
            yield [accesses, comparisons, [indices[0], indices[2]]];
            if (a[indices[0]] > a[indices[2]])
                indices.swap(0, 2);
            comparisons++;
            yield [accesses, comparisons, [indices[1], indices[2]]];
            if (a[indices[1]] > a[indices[2]])
                indices.swap(1, 2);
            iPivot = indices[1];
        }
        const pivot = a[iPivot];
        let i = lo - 1;
        let j = hi + 1;
        while (true) {
            do {
                i++;
                accesses++, comparisons++;
                if (i < j)
                    yield [accesses, comparisons, { '>': j <= hi ? [i, j] : [i], '!': [iPivot] }];
            } while (a[i] < pivot);
            do {
                j--;
                accesses++, comparisons++;
                if (i < j)
                    yield [accesses, comparisons, { '>': [i, j], '!': [iPivot] }];
            } while (a[j] > pivot);
            if (i >= j)
                break;
            accesses += 2;
            a.swap(i, j);
            iPivot = iPivot === i ? j : (iPivot === j ? i : iPivot);
        }
        if (j + 1 < hi)
            stack.push(j + 1, hi);
        if (lo < j)
            stack.push(lo, j);
    }
    return [accesses, comparisons];
}
function* selection(a) {
    let accesses = 0;
    let comparisons = 0;
    for (let i = a.length - 1; i >= 1; i--) {
        accesses++;
        let jMax = 0;
        for (let j = 1; j <= i; j++) {
            accesses++, comparisons++;
            yield [accesses, comparisons, [jMax, j]];
            if (a[j] >= a[jMax])
                jMax = j;
        }
        if (i !== jMax) {
            accesses += 3;
            a.swap(i, jMax);
        }
    }
    return [accesses, comparisons];
}
function* selectionDbl(a) {
    let accesses = 0;
    let comparisons = 0;
    for (let i = 0; i < Math.floor(a.length / 2); i++) {
        accesses += 2, comparisons++;
        yield [accesses, comparisons, [i, i + 1]];
        let jMax = a[i] > a[i + 1] ? i : i + 1;
        let jMin = a[i] <= a[i + 1] ? i : i + 1;
        const jLast = a.length - i - 1;
        for (let j = i + 2; j < jLast; j += 2) {
            accesses += 2, comparisons++;
            yield [accesses, comparisons, [j, j + 1]];
            if (a[j] > a[j + 1]) {
                comparisons++;
                yield [accesses, comparisons, [jMax, j]];
                jMax = a[j] >= a[jMax] ? j : jMax;
                comparisons++;
                yield [accesses, comparisons, [jMin, j + 1]];
                jMin = a[j + 1] < a[jMin] ? j + 1 : jMin;
            }
            else {
                comparisons++;
                yield [accesses, comparisons, [jMax, j + 1]];
                jMax = a[j + 1] >= a[jMax] ? j + 1 : jMax;
                comparisons++;
                yield [accesses, comparisons, [jMin, j]];
                jMin = a[j] < a[jMin] ? j : jMin;
            }
        }
        if (a.length % 2 === 1) {
            accesses++, comparisons++;
            yield [accesses, comparisons, [jMax, jLast]];
            if (a[jLast] >= a[jMax]) {
                jMax = jLast;
            }
            else {
                comparisons++;
                yield [accesses, comparisons, [jMin, jLast]];
                if (a[jLast] < a[jMin])
                    jMin = jLast;
            }
        }
        if (jMax === jLast && jMin === i) {
        }
        else if (jMax === jLast || jMin === i) {
            accesses += 3;
        }
        else {
            if (jMax === i && jMin === jLast) {
            }
            else if (jMax === i || jMin === jLast) {
                accesses += 2;
            }
            else {
                accesses += 4;
            }
            accesses += 2;
        }
        if (jMax === i) {
            a.swap(jMax, jLast);
            if (jMin !== jLast)
                a.swap(jMin, i);
        }
        else {
            a.swap(jMin, i);
            a.swap(jMax, jLast);
        }
    }
    return [accesses, comparisons];
}
function* shell(a) {
    let accesses = 0;
    let comparisons = 0;
    const gaps = [1750, 701, 301, 132, 57, 23, 10, 4, 1];
    for (const g of gaps)
        for (let i = g; i < a.length; i++) {
            accesses++;
            let j = i;
            for (; j >= g; j -= g) {
                accesses++, comparisons++;
                yield [accesses, comparisons, [j - g, j]];
                if (a[j - g] <= a[j])
                    break;
                accesses++;
                a.swap(j - g, j);
            }
            accesses++;
        }
    return [accesses, comparisons];
}
const barCount = Math.pow(2, 7);
const msPerStep = 20;
function addAlgorithm(algName, funName) {
    const a = array.slice();
    const f = window[funName];
    const tuple = {
        array: a,
        function: f,
        generator: f(a)
    };
    const header = newElt('div', { class: 'header' });
    const canvas = newElt('canvas');
    header.appendChild(document.createTextNode(algName + ' ('));
    header.appendChild(newElt('span', { id: 'accesses', text: '0' }));
    header.appendChild(newElt('span', { class: 'hide-on-overflow', text: ' accesses' }));
    header.appendChild(document.createTextNode(', '));
    header.appendChild(newElt('span', { id: 'comparisons', text: '0' }));
    header.appendChild(newElt('span', { class: 'hide-on-overflow', text: ' comparisons' }));
    header.appendChild(document.createTextNode(')'));
    header.appendChild(newElt('span', { class: 'hspace24' }));
    header.appendChild(newElt('span', { class: 'material-icons close', click: function () {
            algs.splice(algs.indexOf(tuple), 1);
            header.remove();
            canvas.remove();
        }, text: 'close' }));
    const divider = document.querySelector('#add');
    divider.parentNode.insertBefore(header, divider);
    divider.parentNode.insertBefore(canvas, divider);
    setDimensions();
    toggleDialog();
    algs.push(tuple);
}
function calculateDimensions() {
    dims.canWidth = Math.min(700, window.innerWidth);
    if ((dims.canWidth + 1) / barCount >= 3) {
        dims.barWidth = Math.floor((dims.canWidth + 1) / barCount);
        dims.barWidthInner = dims.barWidth - 1;
        dims.canWidthInner = barCount * dims.barWidth - 1;
    }
    else {
        dims.barWidth = Math.floor(dims.canWidth / barCount);
        dims.barWidthInner = dims.barWidth;
        dims.canWidthInner = barCount * dims.barWidth;
    }
    dims.canHeight = Math.floor(0.5 * dims.canWidthInner);
    dims.canPadding = Math.floor(0.5 * (dims.canWidth - dims.canWidthInner));
    setDimensions();
}
function drawAll() {
    var _a, _b, _c;
    for (let i = 0; i < algs.length; i++) {
        const hdr = document.querySelectorAll('.header')[i];
        const can = document.querySelectorAll('canvas')[i].getContext('2d');
        const arr = algs[i].array;
        const stp = (_a = algs[i].lastStep) === null || _a === void 0 ? void 0 : _a.value;
        const col = stp === null || stp === void 0 ? void 0 : stp[2];
        hdr.querySelector('#accesses').textContent = (_b = stp === null || stp === void 0 ? void 0 : stp[0].toString()) !== null && _b !== void 0 ? _b : '0';
        hdr.querySelector('#comparisons').textContent = (_c = stp === null || stp === void 0 ? void 0 : stp[1].toString()) !== null && _c !== void 0 ? _c : '0';
        can.clearRect(0, 0, dims.canWidth, dims.canHeight);
        for (let j = 0; j < arr.length; j++) {
            can.fillStyle = '#111';
            if (col)
                if (col instanceof Array) {
                    if (col.includes(j))
                        can.fillStyle = 'red';
                }
                else {
                    for (const c in col)
                        if (col[c].includes(j)) {
                            can.fillStyle = c === '>' ? 'red' : (c === '!' ? 'limegreen' : c);
                            if (c === '>' || c === '!')
                                break;
                        }
                }
            can.fillRect(dims.canPadding + j * dims.barWidth, dims.canHeight, dims.barWidthInner, -dims.canHeight * (0.1 + 0.9 * arr[j] / (arr.length - 1)));
        }
    }
}
function onFrame(time) {
    var _a;
    window.requestAnimationFrame(onFrame);
    if (playing) {
        if (!lastTime)
            lastTime = time;
        let steps = Math.round((time - lastTime) / msPerStep);
        lastTime += steps * msPerStep;
        for (const a of algs)
            for (let i = 0; i < steps && !((_a = a.lastStep) === null || _a === void 0 ? void 0 : _a.done); i++)
                a.lastStep = a.generator.next();
    }
    drawAll();
}
function setDimensions() {
    document.querySelectorAll('.header').forEach(h => {
        h.style.width = dims.canWidthInner + 'px';
        const hide = h.querySelectorAll('.hide-on-overflow');
        hide.forEach(e => e.style.removeProperty('display'));
        if (h.scrollWidth > h.clientWidth)
            hide.forEach(e => e.style.display = 'none');
    });
    document.querySelectorAll('canvas').forEach(c => {
        c.width = dims.canWidth;
        c.height = dims.canHeight;
    });
}
function toggleDialog() {
    const d = document.querySelector('.dialog');
    d.style.display = d.style.display ? '' : 'block';
}
function togglePlaying() {
    lastTime = undefined;
    document.querySelector('#pause').classList.toggle('hidden');
    playing = document.querySelector('#play').classList.toggle('hidden');
}
window.addEventListener('resize', calculateDimensions);
document.querySelector('#reset').addEventListener('click', function () {
    if (playing)
        togglePlaying();
    for (const a of algs) {
        a.array = array.slice();
        a.generator = a.function(a.array);
        a.lastStep = undefined;
    }
});
document.querySelector('#pause').addEventListener('click', togglePlaying);
document.querySelector('#play').addEventListener('click', togglePlaying);
document.querySelector('#step').addEventListener('click', function () {
    var _a;
    for (const a of algs)
        if (!((_a = a.lastStep) === null || _a === void 0 ? void 0 : _a.done))
            a.lastStep = a.generator.next();
});
document.querySelector('#skip').addEventListener('click', function () {
    var _a;
    if (playing)
        togglePlaying();
    for (const a of algs)
        while (!((_a = a.lastStep) === null || _a === void 0 ? void 0 : _a.done))
            a.lastStep = a.generator.next();
});
document.querySelector('#add').addEventListener('click', toggleDialog);
document.querySelector('.dialog > .close').addEventListener('click', toggleDialog);
const algs = [];
const array = [];
const dims = {};
let lastTime;
let playing = false;
for (let i = 0; i < barCount; i++)
    array[i] = i;
array.shuffle();
calculateDimensions();
window.requestAnimationFrame(onFrame);
