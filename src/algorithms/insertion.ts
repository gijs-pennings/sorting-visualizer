function* insertion(a: number[]): StepGenerator {
    let accesses = 0
    let comparisons = 0

    for (let i = a.length - 2; i >= 0; i--) {
        accesses++

        for (let j = i+1; j < a.length; j++) {
            accesses++, comparisons++
            yield [accesses, comparisons, [j-1, j], [], undefined]
            if (a[j-1] <= a[j]) break
            accesses++
            a.swap(j-1, j)
        }

        accesses++
    }

    return [accesses, comparisons] as [number, number]
}
/*

for i in a.length - 2 down to 0
    x ← a[i]
    j ← i+1
    while j < a.length
        y ← a[j]
        if x ≤ y: break
        a[j-1] ← y
        j ← j+1
    a[j-1] ← x

*/

// optimized Java implementation: http://hg.openjdk.java.net/jdk8/jdk8/jdk/file/687fd7c7986d/src/share/classes/java/util/TimSort.java#l273
function* insertionBS(a: number[]): StepGenerator {
    let accesses = 0
    let comparisons = 0

    for (let i = a.length - 2; i >= 0; i--) {
        accesses++

        // bounds are inclusive for prettier visualization
        let l = i + 1
        let r = a.length - 1

        // binary search for l = min { i < j ≤ a.length | a[i] ≤ a[j] }
        while (l <= r) {
            const m = Math.ceil((l + r) / 2)
            accesses++, comparisons++
            yield [accesses, comparisons, [i, m], [l, r], undefined]
            if (a[m] < a[i])
                l = m + 1
            else
                r = m - 1
        }

        // move a[i] to a[l-1] without comparisons
        accesses += 2 * (l - (i+1))
        for (let j = i+1; j < l; j++) a.swap(j-1, j)

        accesses++
    }

    return [accesses, comparisons] as [number, number]
}
