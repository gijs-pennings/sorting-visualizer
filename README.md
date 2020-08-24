# Sorting Visualizer
This project was inspired by [The Sound of Sorting](https://panthema.net/2013/sound-of-sorting) by Timo Bingmann (I recommend watching the [video](https://www.youtube.com/watch?v=kPRA0W1kECg)).
I wanted to create a sorting algorithm visualization tool on the web. For this I used TypeScript and HTML5 canvasses. You can play around with the most recent version [here](https://gijs-pennings.github.io/sorting-visualizer).
This project is licensed under the [ISC license](LICENSE.md).

## Algorithms

- **Bubble Sort**\
  One of the most well-known sorting algorithms, but also one of the worst. The somewhat faster bidirectional variant is included too, which is also known as *Cocktail Shaker Sort*.
- **Comb Sort**\
  The older brother of Bubble Sort. Using larger gaps, it eliminates [turtles](https://en.wikipedia.org/wiki/Bubble_sort#Rabbits_and_turtles) much more quickly, resulting in considerably better performance.
- **Heap Sort**\
  One of the better comparison sorts. It improves on Selection Sort by efficiently extracting the largest element using a [heap](https://en.wikipedia.org/wiki/Heap_(data_structure)). In the visualization, the colors allow you to see the 'levels' of the binary tree.
- **Insertion Sort**\
  A very simple algorithm and (therefore) very fast on small datasets. The variant *Binary Insertion Sort* uses binary search to determine the position of elements and, consequently, needs less comparisons.
- **Merge Sort**\
  Many [stable](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability), general-purpose sorting algorithms are a variant of this algorithm. Implementations can be divided into two categories: top-down and bottom-up. Although in the real world, bottom-up is most often used (since it doesn't need recursion), I chose top-down, since it creates fairer splits.
- **Quick Sort**\
  Another well-known sorting algorithm. Although in the worst case, it performs much worse than many other algorithms, it's the fastest algorithm on average in many cases. You can choose between two partitioning schemes: Hoare and Lomuto. While Lomuto is often taught in school, Hoare swaps less elements and creates more efficient partitions when many elements are equal.
- **Selection Sort**\
  A simple but inefficient algorithm without much practical use. Its relatively unknown sibling *Double Selection Sort* uses three comparisons per two elements to find both the minimum and the maximum. In total, it needs about 25% less comparisons.
- **Shell Sort**\
  This algorithm improves on Insertion Sort the way Comb Sort improves on Bubble Sort: starting with large gaps, it moves out-of-place elements into position more quickly. Unlike all algorithms above, its time complexity (for the gap sequence used) has not yet been determined.
