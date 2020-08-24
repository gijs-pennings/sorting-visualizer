function* merge(a: number[]): StepGenerator {
    let accesses = 0
    let comparisons = 0

    const tree: Pair<number>[] = [] // start inclusive, end exclusive
    const recur = function(lo: number, hi: number) {
        tree.push([lo, hi])
        const mi = Math.ceil((lo+hi) / 2)
        if (hi-mi > 1) recur(mi, hi)
        if (mi-lo > 1) recur(lo, mi)
    }
    if (a.length > 1) recur(0, a.length)

    // By copying a to b once and alternating their role every 'level', much
    // less copying (and hence accesses) is necessary.
    const b = new Array<number>(a.length)
    accesses += 2 * a.length

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

        for (let k = lo; k < hi; k++) a[k] = b[k]
    }

    return [accesses, comparisons] as Pair<number>
}
