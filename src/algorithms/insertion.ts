function* insertion(a: number[]): Steps {

    let accesses = 0
    let comparisons = 0

    for (let i = 1; i < a.length; i++) {
        accesses += 2
        let j = i
        while (j > 0) {
            accesses++, comparisons++
            if (a[j-1] > a[j]) {
                accesses++
                a.swap(j-1, j)
                yield [accesses, comparisons, [j-1, j]]
            } else {
                break
            }
            j--
        }
    }

    return [accesses, comparisons] as [number, number]

}

/*

The calculated number of accesses and comparisons do not correspond to the
algorithm used. They are based on a slightly faster version (pseudocode below)
where a[i] and a[j] are temporarily stored. The algorithm above is used because
it creates a more visually appealing animation.

    for i in 1 until a.length
        x ← a[i]
        j ← i
        while j > 0
            y ← a[j-1]
            if y > x
                a[j] ← y
            else
                break
            j ← j - 1
        a[j] ← x

*/
