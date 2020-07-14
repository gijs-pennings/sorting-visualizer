class InsertionSort extends Algorithm {

    private i = 1
    private j = this.i

    step() {
        if (this.i < this.array.length)
            if (this.j > 0 && this.array[this.j - 1] > this.array[this.j])
                this.array.swap(this.j - 1, this.j--)
            else
                this.j = ++this.i
    }

}
