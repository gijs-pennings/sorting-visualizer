function* selection(a: number[]): StepGenerator {
    let accesses = 0
    let comparisons = 0

    for (let i = a.length-1; i >= 1; i--) {
        accesses++
        let jMax = 0
        for (let j = 1; j <= i; j++) {
            accesses++, comparisons++
            yield [accesses, comparisons, [jMax, j]]
            if (a[j] >= a[jMax]) jMax = j
        }
        if (i !== jMax) {
            accesses += 3
            a.swap(i, jMax)
        }
    }

    return [accesses, comparisons] as Pair<number>
}
/*

for i in a.length-1 down to 1
    maxIndex ← 0
    max ← a[maxIndex]
    for j in 1 to i
        x ← a[j]
        if x ≥ max
            maxIndex ← j
            max ← x
    if i ≠ maxIndex
        a[maxIndex] ← a[i]
        a[i] ← max

*/

function* selectionDbl(a: number[]): StepGenerator {
    let accesses = 0
    let comparisons = 0

    for (let i = 0; i < Math.floor(a.length / 2); i++) {
        // Initialize maximum and minimum values. Due to the bound for i, there
        // are at least two unsorted elements in the array. Note that a single
        // element is trivially sorted.
        accesses += 2, comparisons++
        yield [accesses, comparisons, [i, i+1]]
        let jMax = a[i] >  a[i+1] ? i : i+1
        let jMin = a[i] <= a[i+1] ? i : i+1

        // Compare the next elements in pairs. Only three comparisons are needed
        // per pair to determine the maximum and minimum. In case of duplicates,
        // the rightmost maximum and leftmost minimum are taken.
        const jLast = a.length-i-1
        for (let j = i+2; j < jLast; j += 2) {
            accesses += 2, comparisons++
            yield [accesses, comparisons, [j, j+1]]
            if (a[j] > a[j+1]) {
                comparisons++
                yield [accesses, comparisons, [jMax, j]]
                jMax = a[j] >= a[jMax] ? j : jMax

                comparisons++
                yield [accesses, comparisons, [jMin, j+1]]
                jMin = a[j+1] < a[jMin] ? j+1 : jMin
            } else {
                comparisons++
                yield [accesses, comparisons, [jMax, j+1]]
                jMax = a[j+1] >= a[jMax] ? j+1 : jMax

                comparisons++
                yield [accesses, comparisons, [jMin, j]]
                jMin = a[j] < a[jMin] ? j : jMin
            }
        }

        // If the array is of odd length, the last element is not part of a pair
        // and must be compared separately.
        if (a.length % 2 === 1) {
            accesses++, comparisons++
            yield [accesses, comparisons, [jMax, jLast]]
            if (a[jLast] >= a[jMax]) {
                jMax = jLast
            } else {
                comparisons++
                yield [accesses, comparisons, [jMin, jLast]]
                if (a[jLast] < a[jMin]) jMin = jLast
            }
        }

        // TODO: I don't like this piece of code, and, more importantly, I don't
        //       know if it's 100% correct (and if it is, whether it's worth it)
        if (jMax === jLast && jMin === i) {
            // no accesses necessary
        } else if (jMax === jLast || jMin === i) {
            accesses += 3
        } else {
            if (jMax === i && jMin === jLast) {
                // no (further) accesses necessary
            } else if (jMax === i || jMin === jLast) {
                accesses += 2
            } else {
                accesses += 4
            }
            accesses += 2
        }

        // Move the maximum and minimum to their final position. Be careful
        // swapping elements that are in "each other's" final position.
        if (jMax === i) {
            a.swap(jMax, jLast)
            if (jMin !== jLast) a.swap(jMin, i)
        } else {
            a.swap(jMin, i)
            a.swap(jMax, jLast)
        }
    }

    return [accesses, comparisons] as Pair<number>
}
/*

for i in 0 until ⌊a.length / 2⌋
    maxIndex ← i+1
    minIndex ← i
    max ← a[maxIndex]
    min ← a[minIndex]
    if max < min
        swap(maxIndex, minIndex)
        swap(max, min)
    jLast ← a.length-i-1
    for j in i+2 until jLast step 2
        x ← a[j]
        y ← a[j+1]
        if x > y
            if x ≥ max: maxIndex ← j,   max ← x
            if y < min: minIndex ← j+1, min ← y
        else
            if y ≥ max: maxIndex ← j+1, max ← y
            if x < min: minIndex ← j,   min ← x
    if odd(a.length)
        x ← a[jLast]
        if x ≥ max
            maxIndex ← jLast, max ← x
        else if x < min
            minIndex ← jLast, min ← x
    if maxIndex = jLast
        if minIndex ≠ i
            a[minIndex] ← a[i]
            a[i] ← min
    else if minIndex = i
        a[maxIndex] ← a[jLast]
        a[jLast] ← max
    else
        if maxIndex = i
            if minIndex ≠ jLast
                a[minIndex] ← a[jLast]
        else if minIndex = jLast
            a[maxIndex] ← a[i]
        else
            a[maxIndex] ← a[jLast]
            a[minIndex] ← a[i]
        a[i] ← min
        a[jLast] ← max

*/
