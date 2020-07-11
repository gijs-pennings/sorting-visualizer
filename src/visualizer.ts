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

abstract class Algorithm {

    private lastTime: number | undefined

    update(time: number) {
        if (this.lastTime === undefined) {
            this.lastTime = time
            return
        }

        let steps = Math.round((time - this.lastTime) / msPerStep)
        this.lastTime += steps * msPerStep

        while (steps-- > 0) algorithm.step()
    }

    abstract step(): void

}

// https://en.wikipedia.org/wiki/Bubble_sort#Optimizing_bubble_sort
class BubbleSort extends Algorithm {

    private i = 1
    private n = barCount
    private nNew = 0

    step() {
        if (this.n <= 1) return

        if (this.i >= this.n) {
            this.i = 1
            this.n = this.nNew
            this.nNew = 0
        }

        if (array[this.i - 1] > array[this.i]) {
            array.swap(this.i - 1, this.i)
            this.nNew = this.i
        }

        this.i++
    }

}

function draw(time: number) {

    algorithm.update(time)

    ctx.clearRect(0, 0, can.width, can.height)
    for (let i = 0; i < barCount; i++)
        ctx.fillRect(
            1.5 * i * barWidth,
            can.height,
            barWidth,
            -can.height * (0.1 + 0.9 * array[i] / (barCount - 1))
        )

    window.requestAnimationFrame(draw)

}

const can = document.querySelector('canvas')!
const ctx = can.getContext('2d')!

// (temp) constants
const barCount = 50
const barWidth = can.width / (1.5 * barCount - 0.5)
const msPerStep = 10 // => 100 steps per second

const array: number[] = []
for (let i = 0; i < barCount; i++) array[i] = i
array.shuffle()

let algorithm = new BubbleSort()
window.requestAnimationFrame(draw)
