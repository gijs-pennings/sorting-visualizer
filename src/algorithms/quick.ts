function* partitionHoare(
    a: number[], lo: number, hi: number,
    accesses: number, comparisons: number
): Generator<StepInfo, Tuple<number>, void> {
    let i = lo-1
    let j = hi
outer:
    while (true) {
        do {
            j--
            if (i >= j) break outer // yes, I know some people won't like this
            accesses++, comparisons++
            yield [accesses, comparisons, { '>': [j, hi], '#ff8c00': i >= lo ? [i] : [] }]
        } while (a[j] > a[hi])

        do {
            i++
            if (i >= j) break outer
            accesses++, comparisons++
            yield [accesses, comparisons, { '>': [i, hi], '#ff8c00': [j] }]
        } while (a[i] < a[hi])

        accesses += 2
        a.swap(i, j)
    }
    return [j+1, accesses, comparisons] as Tuple<number>
}

function* partitionLomuto(
    a: number[], lo: number, hi: number,
    accesses: number, comparisons: number
): Generator<StepInfo, Tuple<number>, void> {
    let i = lo
    for (let j = lo; j < hi; j++) {
        accesses++, comparisons++
        yield [accesses, comparisons, [j, hi]]
        if (a[j] < a[hi]) {
            if (i !== j) {
                accesses += 3
                a.swap(i, j)
            }
            i++
        }
    }
    return [i, accesses, comparisons] as Tuple<number>
}

function quick(type: string): AlgorithmFunction {

    const partition = type === 'h' ? partitionHoare : partitionLomuto

    return function*(a: number[]): StepGenerator {
        let accesses = 0
        let comparisons = 0

        const stack: Pair<number>[] = [] // inclusive
        if (a.length > 1) stack.push([0, a.length-1])

        while (stack.length) {
            const [lo, hi] = stack.pop()! // assert: lo < hi

            // i - choosing pivot (threshold was empirically determined by minimizing comparisons)
            const mi = Math.floor((lo+hi) / 2)
            if (hi-lo+1 >= 16) {
                // >= 16 elements: median of three
                accesses += 2, comparisons++
                yield [accesses, comparisons, [lo, mi]]
                accesses++, comparisons++
                yield [accesses, comparisons, [lo, hi]]
                comparisons++
                yield [accesses, comparisons, [mi, hi]]

                const index = [lo, mi, hi].sort((i, j) => a[i] - a[j])[1]
                if (index !== hi && a[index] !== a[hi]) {
                    accesses++
                    a.swap(index, hi)
                }
            } else {
                // < 16 elements: use a[mi]
                accesses += 3
                a.swap(mi, hi)
            }

            // ii - partitioning
            let p: number
            [p, accesses, comparisons] = yield* partition(a, lo, hi, accesses, comparisons)

            if (p !== hi) {
                accesses += 3
                a.swap(p, hi)
            }

            // iii - recurring (push in reverse order!)
            if (p+1 <  hi) stack.push([p+1,  hi])
            if ( lo < p-1) stack.push([ lo, p-1])
        }

        return [accesses, comparisons] as Pair<number>
    }

}
