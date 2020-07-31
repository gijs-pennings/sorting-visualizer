interface Array<T> {
    shuffle(): void
    swap(i: number, j: number): void
    swapValue(i: number, v: T): T
}

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
Array.prototype.shuffle = function() {
    for (let i = this.length; i > 1; /* empty */)
        this.swap(Math.floor(Math.random() * i--), i)
}

// no bounds checking!
Array.prototype.swap = function(i, j) {
    const t = this[i]
    this[i] = this[j]
    this[j] = t
}
Array.prototype.swapValue = function(i, v) {
    const t = this[i]
    this[i] = v
    return t
}

// I was tired of all the lines of code it took for such a simple task...
function newElt(
    tag: string,
    options?: {
        class?: string
        click?: () => void
        id?: string
        text?: string
    }
) {
    const e = document.createElement(tag)
    if (options?.class) e.className   = options.class
    if (options?.click) e.onclick     = options.click
    if (options?.id)    e.id          = options.id
    if (options?.text)  e.textContent = options.text
    return e
}

function randomInt(min: number, max: number) {
    // min, max must be inclusive integer bounds such that min <= max
    return min + Math.floor(Math.random() * (max - min + 1))
}

class NumberRange {
    constructor(
        readonly start: number, // inclusive
        readonly end: number // exclusive
    ) {}
    empty() {
        return this.start >= this.end
    }
    includes(i: number) {
        return this.start <= i && i < this.end
    }
    intersection(start: number, end: number) {
        return new NumberRange(Math.max(this.start, start), Math.min(this.end, end))
    }
}
type Pair<T> = [T, T]

type ColorInfo = { [color: string]: number[] | NumberRange }
type StepInfo = [number, number, number[] | ColorInfo]
type StepGenerator = Generator<StepInfo, Pair<number>, void> // TODO: 'void' used correctly?
type RunningAlgorithm = {
    array: number[]
    function: (a: number[]) => StepGenerator
    generator: StepGenerator
    lastStep?: IteratorResult<StepInfo, Pair<number>>
}
