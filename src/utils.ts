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

type Step = IteratorResult<
    [number, number, number[], number[], string | undefined],
    [number, number]
>
type StepGenerator = Generator<
    [number, number, number[], number[], string | undefined],
    [number, number],
    void // TODO: used correctly?
>
type RunningAlgorithm = {
    array: number[]
    function: (a: number[]) => StepGenerator
    generator: StepGenerator
    lastStep?: Step
}
