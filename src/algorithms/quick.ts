function* quickHoare(a: number[]): Steps { // "median of random three"-pivot

    let accesses = 0
    let comparisons = 0

    const stack: number[] = [] // all ranges are inclusive
    if (a.length > 1) stack.push(0, a.length - 1)

    while (stack.length > 0) {
        // reverse order!
        const hi = stack.pop()!
        const lo = stack.pop()!

        // picking pivot (threshold is an educated guess, based on many tests
        // where number of accesses and comparisons were minimized)
        let iPivot: number
        if (hi - lo < 25) {
            accesses++
            iPivot = Math.floor((lo + hi) / 2)
        } else {
            // TODO: is it a problem that a[hi] can be chosen as the pivot?
            const indices = [randomInt(lo, hi), randomInt(lo, hi), randomInt(lo, hi)]

            accesses++, comparisons++
            yield [accesses, comparisons, [indices[0], indices[1]], [], 'picking pivot']
            if (a[indices[0]] > a[indices[1]]) indices.swap(0, 1)

            accesses++, comparisons++
            yield [accesses, comparisons, [indices[0], indices[2]], [], 'picking pivot']
            if (a[indices[0]] > a[indices[2]]) indices.swap(0, 2)

            accesses++, comparisons++
            yield [accesses, comparisons, [indices[1], indices[2]], [], 'picking pivot']
            if (a[indices[1]] > a[indices[2]]) indices.swap(1, 2)

            iPivot = indices[1]
        }
        const pivot = a[iPivot]

        // partitioning
        let i = lo - 1
        let j = hi + 1

        while (true) {
            do {
                i++
                accesses++, comparisons++
                yield [accesses, comparisons, [i, Math.min(j, hi)], [iPivot], 'partitioning']
            } while (a[i] < pivot)

            do {
                j--
                accesses++, comparisons++
                yield [accesses, comparisons, [i, j], [iPivot], 'partitioning']
            } while (a[j] > pivot)

            if (i >= j) break

            accesses += 2
            a.swap(i, j)
            iPivot = iPivot === i ? j : (iPivot === j ? i : iPivot)
        }

        // recursion (reverse order)
        if (j + 1 < hi) stack.push(j + 1, hi)
        if (   lo <  j) stack.push(   lo,  j)
    }

    return [accesses, comparisons] as [number, number]

}
