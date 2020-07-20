function* insertion(a: number[]): StepGenerator {

    let accesses = 0
    let comparisons = 0

    for (let i = 1; i < a.length; i++) {
        accesses++

        // binary search for r = 1 + max { 0 ≤ j < i | a[j] ≤ a[i] }
        let l = 0
        let r = i
        while (l < r) {
            accesses++, comparisons++
            // The colors are not consistent with other algorithms: red is used
            // for the bounds, while the compared element (i.e. a[i]) is green.
            // Nonetheless, I think this paints the clearest picture.
            yield [accesses, comparisons, [l, r], [i], 'searching']
            const m = Math.floor((l + r) / 2)
            if (a[m] > a[i])
                r = m
            else
                l = m + 1
        }

        // move a[i] to a[r] without comparisons
        for (let j = i; j > r; j--) {
            accesses += 2
            a.swap(j-1, j)
            yield [accesses, comparisons, [], [j-1], 'ordering']
        }

        accesses++
    }

    return [accesses, comparisons] as [number, number]

}

/*

for i in 1 until a.length
    x ← a[i]
    l ← 0
    r ← i
    while l < r
        m ← ⌊(l + r) / 2⌋
        if a[m] > x
            r ← m
        else
            l ← m + 1
    for j in i down to r+1
        a[j] ← a[j-1]
    a[r] ← x

*/
