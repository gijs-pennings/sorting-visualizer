function* merge(a: number[]): StepGenerator {
    let accesses = 0
    let comparisons = 0

    const tree: Pair<number>[] = [] // start inclusive, end exclusive
    if (a.length > 1) {
        tree.push([0, a.length])
        for (let i = 0; i < tree.length; i++) {
            const [lo, hi] = tree[i]
            const mi = Math.ceil((lo+hi) / 2)
            if (hi-mi > 1) tree.push([mi, hi])
            if (mi-lo > 1) tree.push([lo, mi])
        }
    }

    // TODO: should allocation count as accesses?
    const b = new Array<number>(a.length)

    while (tree.length) {
        const [lo, hi] = tree.pop()!
        const mi = Math.ceil((lo+hi) / 2)

        for (let i = lo, j = mi, k = lo; k < hi; k++)
            if (i < mi) {
                if (j < hi) {
                    accesses += 2, comparisons++
                    yield [accesses, comparisons, [i, j]]
                    accesses++
                    if (a[i] <= a[j]) // stable
                        b[k] = a[i++]
                    else
                        b[k] = a[j++]
                } else {
                    accesses += 2
                    b[k] = a[i++]
                }
            } else if (j < hi) {
                accesses += 2
                b[k] = a[j++]
            }

        accesses += 2 * (hi-lo)
        for (let k = lo; k < hi; k++) a[k] = b[k]
    }

    return [accesses, comparisons] as Pair<number>
}
