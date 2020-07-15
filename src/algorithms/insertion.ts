function* insertion(a: number[]): Steps {

    let accesses = 0
    let comparisons = 0

    for (let i = 1; i < a.length; i++) {
        accesses++
        let j = i
        while (j > 0) {
            accesses++, comparisons++
            yield [accesses, comparisons, [j-1, j]]
            if (a[j-1] <= a[j]) break
            accesses++
            a.swap(j-1, j)
            j--
        }
        accesses++
    }

    return [accesses, comparisons] as [number, number]

}

/*

The calculated number of accesses and comparisons do not correspond to the
algorithm used. They are based on a slightly faster version (pseudocode below)
which accesses the array less often. The algorithm above is used because it
creates a more visually appealing animation.

    for i in 1 until a.length
        x ← a[i]
        j ← i
        while j > 0
            y ← a[j-1]
            if y ≤ x: break
            a[j] ← y
            j ← j - 1
        a[j] ← x

*/
