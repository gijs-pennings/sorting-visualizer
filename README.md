# Sorting Visualizer

This project was inspired by [The Sound of Sorting](https://panthema.net/2013/sound-of-sorting) by Timo Bingmann (I recommend watching the [video](https://www.youtube.com/watch?v=kPRA0W1kECg)).
My goal was to create a sorting algorithm visualization tool on the web. For this I used TypeScript and HTML5 canvasses. You can play around with the most recent version [here](https://gijs-pennings.github.io/sorting-visualizer).
This project is licensed under the [ISC license](LICENSE.txt).


## Scope of the project

The topic of sorting is vast. To give myself any chance of finishing this project, I made some design choices.
As a rule of thumb, I only included algorithms that have real-world applications or are typically included in educational programs. Additionally, I adhered to the following principles.

- **Only random access**\
  The implementations of all algorithms use arrays to store data, rather than lists, which only allow sequential access. Many algorithms work on both types, but may require modification.
- **Only comparison sorts**\
  Only algorithms that determine the right order by comparing elements were included; such algorithms can sort any type of data, as long as a comparison operator is defined. I did therefore not include algorithms such as Counting Sort or Bogo Sort.
- **No hybrid sorts**\
  Although hybrid sorting algorithms are often used in practice (since they are designed to perform better), they are less interesting visually: you can arguably get a clearer picture by watching the algorithms separately. Hence, algorithms such as Intro Sort were left out. Tim Sort is a grey area (since it uses additional logic), but due to its complexity, I decided to leave it out as well.


## List of algorithms

- **Bubble Sort**\
  One of the most well-known sorting algorithms, but also one of the worst. The somewhat faster bidirectional variant is included too, which is also known as *Cocktail Shaker Sort*.
- **Comb Sort**\
  The older brother of Bubble Sort. Starting with larger gaps, it eliminates [turtles](https://en.wikipedia.org/wiki/Bubble_sort#Rabbits_and_turtles) much more quickly, resulting in considerably better performance.
- **Heap Sort**\
  One of the better comparison sorts. It improves on Selection Sort by efficiently extracting the largest element using a [heap](https://en.wikipedia.org/wiki/Heap_(data_structure)). In the visualization, the colors allow you to distinguish the 'levels' of the binary tree.
- **Insertion Sort**\
  A very simple algorithm and (therefore) very fast on small datasets. The variant *Binary Insertion Sort* uses binary search to determine the position of elements and, consequently, needs less comparisons.
- **Merge Sort**\
  Many [stable](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability), general-purpose sorting algorithms are a variant of this algorithm. Implementations can be divided into two categories: top-down and bottom-up. Although in real-world applications, bottom-up is most often used (it doesn't need recursion), I chose top-down, since it creates fairer splits.
- **Quick Sort**\
  Another well-known sorting algorithm. Although in the worst case, it performs much worse than many other algorithms, it's the fastest algorithm on average in many cases. You can choose between two partitioning schemes: the one by *Hoare* and the one by *Lomuto*. While Lomuto is often taught in school, Hoare swaps less elements and creates more efficient partitions when many elements are equal.
- **Selection Sort**\
  A simple but inefficient algorithm without much practical use. Its relatively unknown sibling *Double Selection Sort* uses three comparisons per two elements to find both the minimum and the maximum. As a result, it needs about 25% less comparisons.
- **Shell Sort**\
  This algorithm improves on Insertion Sort similarly to how Comb Sort improves on Bubble Sort: starting with larger gaps, it moves out-of-place elements into position more quickly. Unlike all algorithms above, its time complexity (for the gap sequence used) has not yet been determined.


## How it works & limitations

You can select one algorithm, or multiple to watch them simultaneously. Then, you can either let it play or walk through it, step by step. Each step represents exactly one comparison between two elements. The current comparison is highlighted in red, while any additional information is displayed by other colors. After each step, the number of array accesses and comparisons is updated and shown in the header of the figure.

It is important to note that each step representing one comparison can result in a distorted perspective of the speed of the algorithms. For example, Binary Insertion Sort may appear to run faster than Quick Sort (using Hoare's partitioning scheme), since the animation finishes earlier. However, for an array of only 512 elements, it already needs to access the array almost *seventeen times* as much as Quick Sort (test it yourself!). This is why, if you measure the actual runtime, Quick Sort still comes out on top.

The number of accesses and comparisons were (heavily) optimized. Hence, they may not represent real-world implementations. This is partly because I don't need to optimize the actual runtime or have concerns like [cache hit rate](https://en.wikipedia.org/wiki/CPU_cache#Cache_performance). In fact, the number of accesses may not even match the animation itself. The reason is that values can often be cached instead of swapped, while in the animation they *are* swapped to paint a clearer picture. An example of this is Bubble Sort ([source](src/algorithms/bubble.ts)).
