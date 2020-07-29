function* comb(a: number[]): StepGenerator {
    let accesses = 0
    let comparisons = 0

    // https://rosettacode.org/wiki/Sorting_algorithms/Comb_sort suggests
    // 1.24733 ≈ (1 - e^(-φ))^(-1) but that cost more accesses and comparisons
    // on average in my testing (why?)
    let gap = a.length
    const shrink = 1.3

    for (let done = true; gap > 1 || !done; /* empty */) {
        done = true
        gap = Math.max(Math.floor(gap / shrink), 1)
        if (gap === 9 || gap === 10) gap = 11 // Lacey & Box, 1991
        for (let i = gap; i < a.length; i++) {
            accesses += 2, comparisons++
            yield [accesses, comparisons, [i-gap, i], [], undefined]
            if (a[i-gap] > a[i]) {
                accesses += 2
                a.swap(i-gap, i)
                done = false
            }
        }
    }

    return [accesses, comparisons] as [number, number]
}
