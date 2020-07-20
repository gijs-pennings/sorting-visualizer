interface Array<T> {
    shuffle(): void
    swap(i: number, j: number): void
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
