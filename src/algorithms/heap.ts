function* heap(a: number[]): StepGenerator {
    let accesses = 0
    let comparisons = 0

    let size = a.length // of heap

    const p = (i: number) => Math.floor((i-1) / 2)
    const l = (i: number) => 2*i + 1
    const r = (i: number) => 2*i + 2

    // Repairs heap rooted at i, assuming that the heaps rooted at the children
    // of i are valid heaps.  AKA siftDown
    const heapify = function*(i: number): StepGenerator {
        // Find a leaf such that all its ancestors are greater than or equal to
        // their siblings. If all elements are distinct, this leaf is unique.
        let j = i
        while (r(j) < size) {
            accesses += 2, comparisons++
            yield [accesses, comparisons, [l(j), r(j)], [], undefined]
            j = a[l(j)] > a[r(j)] ? l(j) : r(j)
        }
        if (l(j) < size) j = l(j)

        // Search (upward) for the position to put a[i] in. First swap a[i] and
        // then move the values above it upward.
        accesses += 2
        while (true) {
            comparisons++
            yield [accesses, comparisons, [i, j], [], undefined]
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

        return [-1, -1] as [number, number]
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
