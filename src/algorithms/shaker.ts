class ShakerSort extends Algorithm {

    private i = 1
    private iStart = 0 // inclusive
    private iEnd = this.array.length - 1 // inclusive
    private iNew = this.iStart
    private direction = 1 // +1 => right, -1 => left

    step() {
        if (this.iStart >= this.iEnd) return

        if (this.i > this.iEnd) {
            this.i = this.iEnd = this.iNew - 1
            this.direction *= -1 // == -1
        } else if (this.i <= this.iStart) {
            this.iStart = this.iNew
            this.i = this.iStart + 1
            this.direction *= -1 // == +1
        }

        if (this.array[this.i - 1] > this.array[this.i]) {
            this.array.swap(this.i - 1, this.i)
            this.iNew = this.i
        }

        this.i += this.direction
    }

}
