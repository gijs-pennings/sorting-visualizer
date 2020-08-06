function* shell(a: number[]): StepGenerator {
    let accesses = 0
    let comparisons = 0

    const gaps = [1750, 701, 301, 132, 57, 23, 10, 4, 1] // Ciura, 2001

    for (const g of gaps)
        for (let i = g; i < a.length; i++) {
            accesses++
            let j = i
            for (/* empty */; j >= g; j -= g) {
                accesses++, comparisons++
                yield [accesses, comparisons, [j-g, j]]
                if (a[j-g] <= a[j]) break
                accesses++
                a.swap(j-g, j)
            }
            if (i !== j) accesses++
        }

    return [accesses, comparisons] as Pair<number>
}
/*

for g in gaps
    for i in g until a.length
        x ← a[i]
        j ← i
        while j ≥ g
            y ← a[j-g]
            if y ≤ x: break
            a[j] ← y
            j ← j - g
        if i ≠ j
            a[j] ← x

*/
