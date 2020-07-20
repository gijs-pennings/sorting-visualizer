function* shaker(a: number[]): StepGenerator {

    let accesses = 0
    let comparisons = 0

    // inclusive
    let iStart = 0
    let iEnd = a.length - 1

    while (iStart < iEnd /* i.e. there are >=2 unsorted elements */) {

        let iNew = iStart

        accesses++
        for (let i = iStart + 1; i <= iEnd; i++) {
            accesses++, comparisons++
            yield [accesses, comparisons, [i-1, i], [iStart-1, iEnd+1], undefined]
            accesses++
            if (a[i-1] > a[i]) {
                a.swap(i-1, i)
                iNew = i
            }
        }
        accesses++

        iEnd = --iNew

        accesses++
        for (let i = iEnd; i > iStart; i--) {
            accesses++, comparisons++
            yield [accesses, comparisons, [i-1, i], [iStart-1, iEnd+1], undefined]
            accesses++
            if (a[i-1] > a[i]) {
                a.swap(i-1, i)
                iNew = i
            }
        }
        accesses++

        iStart = iNew

    }

    return [accesses, comparisons] as [number, number]

}
