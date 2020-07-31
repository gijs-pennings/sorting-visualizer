function* quickHoare(a: number[]): StepGenerator {

    let accesses = 0
    let comparisons = 0

    const stack: number[] = [] // all ranges are inclusive
    if (a.length > 1) stack.push(0, a.length-1)

    while (stack.length > 0) {
        // reverse order!
        const hi = stack.pop()!
        const lo = stack.pop()!

        // picking pivot (the threshold is an educated guess based on tests on
        // distinct, shuffled data where the number of accesses and comparisons
        // were minimized)
        let iPivot: number
        if (hi-lo < 25) {
            // pivot: middle element
            accesses++
            iPivot = Math.floor((lo+hi) / 2)
        } else {
            // pivot: median of three random elements
            // TODO: is it a problem that a[hi] can be chosen as the pivot?
            // TODO: should the indices be chosen at random or as [lo, mid, hi]?
            const indices = [randomInt(lo, hi), randomInt(lo, hi), randomInt(lo, hi)]

            accesses += 2, comparisons++
            yield [accesses, comparisons, [indices[0], indices[1]]]
            if (a[indices[0]] > a[indices[1]]) indices.swap(0, 1)

            accesses++, comparisons++
            yield [accesses, comparisons, [indices[0], indices[2]]]
            if (a[indices[0]] > a[indices[2]]) indices.swap(0, 2)

            comparisons++
            yield [accesses, comparisons, [indices[1], indices[2]]]
            if (a[indices[1]] > a[indices[2]]) indices.swap(1, 2)

            iPivot = indices[1]
        }
        const pivot = a[iPivot]

        // partitioning
        let i = lo-1
        let j = hi+1

        while (true) {
            do {
                i++
                accesses++, comparisons++
                if (i < j) yield [accesses, comparisons, { '>': j <= hi ? [i, j] : [i], '!': [iPivot] }]
            } while (a[i] < pivot)

            do {
                j--
                accesses++, comparisons++
                if (i < j) yield [accesses, comparisons, { '>': [i, j], '!': [iPivot] }]
            } while (a[j] > pivot)

            if (i >= j) break

            accesses += 2
            a.swap(i, j)
            iPivot = iPivot === i ? j : (iPivot === j ? i : iPivot)
        }

        // recursion (reverse order)
        if (j+1 < hi) stack.push(j+1, hi)
        if ( lo <  j) stack.push( lo,  j)
    }

    return [accesses, comparisons] as [number, number]

}
