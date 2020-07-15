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

type Steps = Generator<
    [number, number, number[], number[], string | undefined],
    [number, number],
    void // TODO: used correctly?
>
