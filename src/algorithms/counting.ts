function* counting(a: number[]): Steps {

    let accesses = 0
    let comparisons = 0

    accesses++
    let iMax = 0
    for (let i = 1; i < a.length; i++) {
        accesses++, comparisons++
        yield [accesses, comparisons, [iMax, i], [], 'finding max']
        if (a[i] > a[iMax]) iMax = i
    }

    const count: number[] = new Array(a[iMax] + 1).fill(0)
    accesses += count.length
    for (let i = 0; i < a.length; i++) {
        // TODO: is it right to assume incrementing only takes one access?
        accesses += 2
        count[a[i]]++
        yield [accesses, comparisons, [], [i], 'counting']
    }

    accesses += 2 * (count.length - 1)
    for (let i = 1; i < count.length; i++) count[i] += count[i-1]

    const aCopy = Array.from(a)
    for (let i = a.length - 1; i >= 0; i--) {
        accesses += 4
        const x = aCopy[i]
        const j = (count[x]--) - 1
        a[j] = x
        yield [accesses, comparisons, [], [j], 'ordering']
    }

    return [accesses, comparisons] as [number, number]

}
