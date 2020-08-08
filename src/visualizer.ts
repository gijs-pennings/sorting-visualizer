// (temp)
const barCount = 2**7
const msPerStep = 20 // => 50 steps per second

function addAlgorithm(algName: string, funName: string, funArg: any = null) {
    const a = array.slice() // shallow copy

    // The specified function is either an AlgorithmFunction, or a function that
    // returns an AlgorithmFunction using funArg as its one and only parameter.
    // TODO: this is quite complex, and only used for quick sort
    let f = (window as { [key: string]: any })[funName]
    if (funArg !== null) f = f(funArg)

    const tuple: RunningAlgorithm = {
        array: a,
        function: f,
        generator: f(a)
    }

    const header = newElt('div', { class: 'header' })
    const canvas = newElt('canvas')

    header.appendChild(document.createTextNode(algName + ' ('))
    header.appendChild(newElt('span', { id: 'accesses', text: '0' }))
    header.appendChild(newElt('span', { class: 'hide-on-overflow', text: ' accesses' }))
    header.appendChild(document.createTextNode(', '))
    header.appendChild(newElt('span', { id: 'comparisons', text: '0' }))
    header.appendChild(newElt('span', { class: 'hide-on-overflow', text: ' comparisons' }))
    header.appendChild(document.createTextNode(')'))
    header.appendChild(newElt('span', { class: 'hspace24' })) // since the icon is not part of the document flow (due to its absolute position), a 'ghost' element of equal width is added to correctly detect an overflow
    header.appendChild(newElt('span', { class: 'material-icons close', click: function() {
        algs.splice(algs.indexOf(tuple), 1) // remove *before* anything has been dismantled
        header.remove()
        canvas.remove()
    }, text: 'close' }))

    const divider = document.querySelector('#add')!
    divider.parentNode!.insertBefore(header, divider)
    divider.parentNode!.insertBefore(canvas, divider)

    setDimensions()
    toggleDialog()

    algs.push(tuple) // add *after* everything else has been set up
}
function calculateDimensions() {
    dims.canWidth = Math.min(700, window.innerWidth)

    if ((dims.canWidth + 1) / barCount >= 3) {
        dims.barWidth = Math.floor((dims.canWidth + 1) / barCount)
        dims.barWidthInner = dims.barWidth - 1
        dims.canWidthInner = barCount * dims.barWidth - 1
    } else {
        dims.barWidth = Math.floor(dims.canWidth / barCount)
        dims.barWidthInner = dims.barWidth
        dims.canWidthInner = barCount * dims.barWidth
    }

    dims.canHeight = Math.floor(0.5 * dims.canWidthInner)
    dims.canPadding = Math.floor(0.5 * (dims.canWidth - dims.canWidthInner)) // left

    setDimensions()
}
function checkOverflow(header: HTMLElement) {
    const hide: NodeListOf<HTMLElement> = header.querySelectorAll('.hide-on-overflow')
    hide.forEach(e => e.style.removeProperty('display')) // reset so scrollWidth can be calculated
    if (header.scrollWidth > header.clientWidth) hide.forEach(e => e.style.display = 'none')
}
function drawAll() {
    for (let i = 0; i < algs.length; i++) {
        const hdr = document.querySelectorAll('.header')[i] as HTMLElement
        const can = document.querySelectorAll('canvas')[i].getContext('2d')!

        const arr = algs[i].array
        const stp = algs[i].lastStep?.value // value itself is never undefined, but lastStep may be
        const col = stp?.[2]

        hdr.querySelector('#accesses')!.textContent = stp?.[0].toString() ?? '0'
        hdr.querySelector('#comparisons')!.textContent = stp?.[1].toString() ?? '0'
        checkOverflow(hdr)

        can.clearRect(0, 0, dims.canWidth, dims.canHeight)
        for (let j = 0; j < arr.length; j++) {
            can.fillStyle = '#111'

            if (col)
                if (col instanceof Array) {
                    if (col.includes(j))
                        can.fillStyle = 'red'
                } else {
                    for (const c in col)
                        if (col[c].includes(j)) {
                            can.fillStyle = c === '>' ? 'red' : (c === '!' ? 'limegreen' : c)
                            if (c === '>' || c === '!') break
                        }
                }

            can.fillRect(
                dims.canPadding + j * dims.barWidth,
                dims.canHeight,
                dims.barWidthInner,
                -dims.canHeight * (0.1 + 0.9 * arr[j] / (arr.length - 1))
            )
        }
    }
}
function onFrame(time: number) {
    window.requestAnimationFrame(onFrame)

    if (playing) {
        if (!lastTime) lastTime = time
        let steps = Math.round((time - lastTime) / msPerStep)
        lastTime += steps * msPerStep

        for (const a of algs)
            for (let i = 0; i < steps && !a.lastStep?.done; i++)
                a.lastStep = a.generator.next()
    }

    drawAll()
}
function setDimensions() {
    (document.querySelectorAll('.header') as NodeListOf<HTMLElement>).forEach(h => {
        // The header may not align perfectly to the canvas, since the left
        // padding could be smaller than the right due to flooring. However,
        // using the full width and adding paddings allows the text to overflow
        // into the padding, messing up the overflow calculation below.
        h.style.width = dims.canWidthInner + 'px'

        checkOverflow(h)
    })

    document.querySelectorAll('canvas').forEach(c => {
        c.width = dims.canWidth
        c.height = dims.canHeight
    })
}
function toggleDialog() {
    const d = document.querySelector('.dialog') as HTMLElement
    d.style.display = d.style.display ? '' : 'block'
}
function togglePlaying() {
    lastTime = undefined
    document.querySelector('#pause')!.classList.toggle('hidden')
    playing = document.querySelector('#play')!.classList.toggle('hidden')
}

window.addEventListener('resize', calculateDimensions)
document.querySelector('#reset')!.addEventListener('click', function() {
    if (playing) togglePlaying() // => pause
    for (const a of algs) {
        a.array = array.slice() // shallow copy
        a.generator = a.function(a.array)
        a.lastStep = undefined
    }
})
document.querySelector('#pause')!.addEventListener('click', togglePlaying)
document.querySelector('#play')!.addEventListener('click', togglePlaying)
document.querySelector('#step')!.addEventListener('click', function() {
    for (const a of algs)
        if (!a.lastStep?.done)
            a.lastStep = a.generator.next()
})
document.querySelector('#skip')!.addEventListener('click', function() {
    if (playing) togglePlaying() // => pause
    for (const a of algs)
        while (!a.lastStep?.done)
            a.lastStep = a.generator.next()
})
document.querySelector('#add')!.addEventListener('click', toggleDialog)
document.querySelector('.dialog > .close')!.addEventListener('click', toggleDialog)

const algs: RunningAlgorithm[] = []
const array: number[] = []
const dims: { [key: string]: number } = {}
let lastTime: number | undefined
let playing = false

// (temp)
for (let i = 0; i < barCount; i++) array[i] = i
array.shuffle()

calculateDimensions()
window.requestAnimationFrame(onFrame)
