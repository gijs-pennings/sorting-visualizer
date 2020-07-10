interface Array<T> { shuffle(): void }
Array.prototype.shuffle = function() {
    for (let i = this.length; i > 0; /* empty */) {
        const j = Math.floor(Math.random() * i--)
        const t = this[i]
        this[i] = this[j]
        this[j] = t
    }
}

function draw() {

    for (let i = 0; i < barCount; i++) {
        const n = array[i]
        ctx.fillRect(
            1.5 * i * barWidth,
            can.height,
            barWidth,
            -can.height * (0.1 + 0.9 * n / (barCount - 1))
        )
    }

    // window.requestAnimationFrame(draw)

}

const can = document.querySelector('canvas')!
const ctx = can.getContext('2d')!

const barCount = 100 // (temp)
const barWidth = can.width / (1.5 * barCount - 0.5)

const array: number[] = []
for (let i = 0; i < barCount; i++) array[i] = i
array.shuffle()

window.requestAnimationFrame(draw)
