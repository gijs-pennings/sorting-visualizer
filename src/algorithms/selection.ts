function* selection(a: number[]): Steps {

    let accesses = 0
    let comparisons = 0

    for (let i = 0; i < a.length - 1; i++) {
        accesses++
        let jMin = i
        for (let j = i + 1; j < a.length; j++) {
            accesses++, comparisons++
            yield [accesses, comparisons, [jMin, j]]
            if (a[j] < a[jMin]) {
                accesses++
                jMin = j
            }
        }
        if (i !== jMin) {
            accesses++
            a.swap(i, jMin)
        }
    }

    return [accesses, comparisons] as [number, number]

}

/*

for i in 0 until a.length-1
    minIndex ← i
    min ← a[minIndex]
    for j in i+1 until a.length
        if a[j] < min
            minIndex ← j
            min ← a[minIndex]
    if i ≠ minIndex
        a[i] ← min

*/
