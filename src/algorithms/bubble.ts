class BubbleSort extends Algorithm {

    private i = 1
    private n = this.array.length // exclusive
    private nNew = 0

    step() {
        if (this.n <= 1) return

        if (this.i >= this.n) {
            this.i = 1
            this.n = this.nNew
            this.nNew = 0
        }

        if (this.array[this.i - 1] > this.array[this.i]) {
            this.array.swap(this.i - 1, this.i)
            this.nNew = this.i
        }

        this.i++
    }

}
