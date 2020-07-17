function* shell(a: number[]): Steps {

    let accesses = 0
    let comparisons = 0

    const gaps = [1750, 701, 301, 132, 57, 23, 10, 4, 1] // Ciura, 2001

    for (const g of gaps)
        for (let i = g; i < a.length; i++) {
            accesses++
            let j = i
            for (/* empty */; j >= g; j -= g) {
                accesses++, comparisons++
                yield [accesses, comparisons, [j-g, j], [], undefined]
                if (a[j-g] <= a[j]) break
                accesses++
                a.swap(j-g, j)
            }
            accesses++
        }

    return [accesses, comparisons] as [number, number]

}

/*

for g in gaps
    for i in g until a.length
        ti ← a[i]
        j ← i
        while j ≥ g
            tj ← a[j-g]
            if tj ≤ ti: break
            a[j] ← tj
            j ← j - g
        a[j] ← ti

*/
