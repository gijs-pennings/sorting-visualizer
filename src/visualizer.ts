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

    // The container may not align pixel perfectly to the bars, since the left
    // padding could be smaller than the right padding due to flooring. However,
    // using the full width and adding paddings allowed the text to overflow
    // into the right padding, messing up the overflow calculation below.
    div.style.width = canWidthInner + 'px'

    const hideOnOverflow = div.querySelectorAll('.hide-on-overflow')
    hideOnOverflow.forEach(e => (e as HTMLElement).style.removeProperty('display'))
    if (div.scrollWidth > div.clientWidth)
        hideOnOverflow.forEach(e => (e as HTMLElement).style.display = 'none')
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

    if (algorithmState?.value) {
        document.getElementById('accesses')!.textContent = algorithmState.value[0].toString()
        document.getElementById('comparisons')!.textContent = algorithmState.value[1].toString()
     // document.getElementById('state')!.textContent = algorithmState.value[4] ? ', ' + algorithmState.value[4] : null
    }

    ctx.clearRect(0, 0, can.width, can.height)
    for (let i = 0; i < barCount; i++) {
        ctx.fillStyle = '#111'
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

const div = document.querySelector('div')!
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

// TODO: yuck
document.querySelectorAll('#add, .dialog > .close').forEach(e =>
    e.addEventListener('click', function() {
        (document.querySelector('.dialog') as HTMLElement).style.display = e.id === 'add' ? 'block' : ''
    })
)

const array: number[] = []
for (let i = 0; i < barCount; i++) array[i] = i

let algorithm: StepGenerator
let algorithmState: Step | undefined
let lastTime: number | undefined

reset()
window.requestAnimationFrame(update)
