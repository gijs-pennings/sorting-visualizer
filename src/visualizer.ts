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

const barCount = 50 // (temp)
const barWidth = can.width / (1.5 * barCount - 0.5)

const array: number[] = []
for (let i = 0; i < barCount; i++) array[i] = i
array.shuffle()

let algorithm = new BubbleSort(array)
window.requestAnimationFrame(draw)
