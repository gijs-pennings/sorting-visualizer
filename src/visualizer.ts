function update(time: number) {

    if (lastTime === undefined) lastTime = time
    let steps = Math.round((time - lastTime) / msPerStep)
    lastTime += steps * msPerStep

    let state
    while (steps-- > 0) {
        state = algorithm.next()
        if (state.done) break
    }

    if (state === undefined || !state.done) window.requestAnimationFrame(update)
    if (state === undefined) return // iff steps === 0

    document.querySelector('#accesses')!.textContent = state.value[0].toString()
    document.querySelector('#comparisons')!.textContent = state.value[1].toString()
    document.querySelector('#status')!.textContent = state.value[4] ? `(${state.value[4]})` : null

    ctx.clearRect(0, 0, can.width, can.height)
    for (let i = 0; i < barCount; i++) {
        ctx.fillStyle = 'black'
        if (state.value[3]?.includes(i)) ctx.fillStyle = 'limegreen'
        if (state.value[2]?.includes(i)) ctx.fillStyle = 'red'
        ctx.fillRect(
            1.5 * i * barWidth,
            can.height,
            barWidth,
            -can.height * (0.1 + 0.9 * array[i] / (barCount - 1))
        )
    }

}

const can = document.querySelector('canvas')!
const ctx = can.getContext('2d')!

const barCount = 2**7 // (temp)
const barWidth = can.width / (1.5 * barCount - 0.5)
const msPerStep = 20 // => 50 steps per second (temp)

const array: number[] = []
for (let i = 0; i < barCount; i++) array[i] = i
array.shuffle()

let algorithm = quickHoare(array)
let lastTime: number | undefined
window.requestAnimationFrame(update)
