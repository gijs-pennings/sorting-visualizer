class SelectionSort extends Algorithm {

    private i = 0
    private j = this.i
    private jMin = this.j

    step() {
        if (this.i >= this.array.length - 1) return

        if (this.j >= this.array.length) {
            this.array.swap(this.i, this.jMin)
            this.j = 1 + (this.jMin = ++this.i) // ;)
            return
        }

        if (this.array[this.j] < this.array[this.jMin]) this.jMin = this.j

        this.j++
    }

}
