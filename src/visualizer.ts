// constants (temp)
const barCount = 2**7
const msPerStep = 20 // => 50 steps per second

function calculateDimensions() {
    can.width = Math.min(700, window.innerWidth)
    let canWidthInner: number

    if ((can.width + 1) / barCount >= 3) {
        barWidth = Math.floor((can.width + 1) / barCount)
        barWidthInner = barWidth - 1
        canWidthInner = barCount * barWidth - 1
    } else {
        barWidth = Math.floor(can.width / barCount)
        barWidthInner = barWidth
        canWidthInner = barCount * barWidth
    }

    padding = Math.floor(0.5 * (can.width - canWidthInner))
    can.height = Math.floor(0.5 * canWidthInner)
}

function reset() {
    array.shuffle()
    algorithm = quickHoare(array) // (temp)
    algorithmState = undefined
    lastTime = undefined
}

function update(time: number) {

    window.requestAnimationFrame(update)

    if (playing) {
        if (lastTime === undefined) lastTime = time
        let steps = Math.round((time - lastTime) / msPerStep)
        lastTime += steps * msPerStep

        while (steps-- > 0) {
            algorithmState = algorithm.next()
            if (algorithmState.done) break
        }
    }

    ctx.clearRect(0, 0, can.width, can.height)
    for (let i = 0; i < barCount; i++) {
        ctx.fillStyle = 'black'
        if (algorithmState?.value?.[3]?.includes(i)) ctx.fillStyle = 'limegreen'
        if (algorithmState?.value?.[2]?.includes(i)) ctx.fillStyle = 'red'
        ctx.fillRect(
            padding + i * barWidth,
            can.height,
            barWidthInner,
            -can.height * (0.1 + 0.9 * array[i] / (barCount - 1))
        )
    }

}

const can = document.querySelector('canvas')!
const ctx = can.getContext('2d')!

let barWidth: number
let barWidthInner: number
let padding: number

window.addEventListener('resize', calculateDimensions)
calculateDimensions()

// TODO: reset to original shuffled state?
document.getElementById('reset')!.addEventListener('click', reset)

let playing = false
document.querySelectorAll('#pause, #play').forEach(e => e.addEventListener('click', function() {
    document.getElementById('pause')!.classList.toggle('hidden')
    playing = document.getElementById('play')!.classList.toggle('hidden')
    lastTime = undefined
}))

document.getElementById('step')!.addEventListener('click', function() {
    algorithmState = algorithm.next()
})

document.getElementById('skip')!.addEventListener('click', function() {
    while (!algorithmState?.done) algorithmState = algorithm.next()
})

const array: number[] = []
for (let i = 0; i < barCount; i++) array[i] = i

let algorithm: StepGenerator
let algorithmState: Step | undefined
let lastTime: number | undefined

reset()
window.requestAnimationFrame(update)
