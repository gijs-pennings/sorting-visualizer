// The colors must be unique (since the keys in a ColorInfo object need to be
// unique) but I can't be bothered to find many different colors. So I reused
// them. To make them unique I made tiny changes to the blue channel (to which
// the human eye is the least receptive).
const heapColors = Object.freeze([
    '#f8b88a', '#baed90', '#b2cefd', '#f2a2e7',
    '#f8b88b', '#baed91', '#b2cefe', '#f2a2e8', // the originals
    '#f8b88c', '#baed92', '#b2ceff', '#f2a2e9'
])

function* heap(a: number[]): StepGenerator {
    let accesses = 0
    let comparisons = 0

    let size = a.length // of heap

    const getHeapColors = function(i: number) {
        const colors: ColorInfo = {}

        for (let e = 0; 2**e-1 < size; e++)
            colors[heapColors[e]] = new NumberRange(2**e-1, Math.min(2**(e+1)-1, size))

        // if building the heap, remove all colors before i
        if (size === a.length)
            for (const c in colors) {
                const r = (colors[c] as NumberRange).intersection(i, a.length)
                if (r.empty()) {
                    delete colors[c]
                } else {
                    colors[c] = r
                    break // we only need to shrink at most one range
                }
            }

        return colors
    }

    const p = (i: number) => Math.floor((i-1) / 2)
    const l = (i: number) => 2*i + 1
    const r = (i: number) => 2*i + 2

    // Repairs heap rooted at i, assuming that the heaps rooted at the children
    // of i are valid heaps.  AKA siftDown
    const heapify = function*(i: number) {
        // Find a leaf such that all its ancestors are greater than or equal to
        // their siblings. If all elements are distinct, this leaf is unique.
        let j = i
        while (r(j) < size) {
            accesses += 2, comparisons++
            yield [accesses, comparisons, { '>': [l(j), r(j)], ...getHeapColors(i) }] as StepInfo
            j = a[l(j)] > a[r(j)] ? l(j) : r(j)
        }
        if (l(j) < size) j = l(j)

        // Search (upward) for the position to put a[i] in. First swap a[i] and
        // then move the values above it upward.
        accesses += 2
        while (true) {
            comparisons++
            yield [accesses, comparisons, { '>': [i, j], ...getHeapColors(i) }] as StepInfo
            if (a[i] <= a[j]) break
            accesses++
            j = p(j)
        }

        let x = a[j]
        accesses++
        a[j] = a[i]
        while (i < j) {
            j = p(j)
            accesses += 2
            x = a.swapValue(j, x)
        }
    }

    // build max heap
    for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--)
        yield* heapify(i)

    // sort
    for (size--; size > 0; size--) {
        a.swap(0, size)
        yield* heapify(0)
    }

    return [accesses, comparisons] as [number, number]
}
