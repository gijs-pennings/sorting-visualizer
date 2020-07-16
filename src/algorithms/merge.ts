function* merge(a: number[]): Steps { // bottom-up

    let accesses = 0
    let comparisons = 0

    let b = new Array<number>(a.length)

    for (let width = 1; width < a.length; width *= 2)
        for (let i = 0; i < a.length; i += 2 * width) {

            // merge a[i : i+width-1] and a[i+width : i+2*width-1] to b[..]
            const pMax = i + width
            if (pMax >= a.length) continue
            // This is a good optimization for almost sorted data. In our case
            // (shuffled data) it reduces the number of accesses at the cost of
            // comparisons. Since the low number of comparisons (compared to
            // quicksort) is one of merge sort's strengths, this optimization is
            // disabled here.
         /* accesses += 2, comparisons++
            if (a[pMax-1] <= a[pMax]) continue */
            const qMax = Math.min(a.length, i + width * 2)

            let p = i
            let q = pMax

            for (let j = i; j < qMax; j++)
                if (p < pMax) {
                    if (q >= qMax) {
                        yield [accesses, comparisons, [p], [], 'merging']
                        accesses += 2
                        b[j] = a[p]
                        p++
                    } else {
                        accesses += 2, comparisons++
                        yield [accesses, comparisons, [p, q], [], 'merging']
                        accesses++
                        if (a[p] <= a[q])
                            b[j] = a[p], p++
                        else
                            b[j] = a[q], q++
                    }
                } else {
                    yield [accesses, comparisons, [q], [], 'merging']
                    accesses += 2
                    b[j] = a[q]
                    q++
                }

            // copy b[i : i+2*width-1] to a[..]
            for (let j = i; j < qMax; j++) {
                accesses += 2
                a[j] = b[j]
                yield [accesses, comparisons, [], [j], 'copying']
            }

        }

    return [accesses, comparisons] as [number, number]

}
