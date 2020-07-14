const msPerStep = 10 // => 100 steps per second (temp)

abstract class Algorithm {

    private lastTime: number | undefined

    constructor(protected readonly array: number[]) {}

    update(time: number) {
        if (this.lastTime === undefined) {
            this.lastTime = time
            return
        }

        let steps = Math.round((time - this.lastTime) / msPerStep)
        this.lastTime += steps * msPerStep

        while (steps-- > 0) this.step()
    }

    abstract step(): void

}
