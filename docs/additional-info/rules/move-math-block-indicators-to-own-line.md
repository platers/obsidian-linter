#### What Math Formats Does the Linter Support?

The Linter uses [remark-math](https://github.com/remarkjs/remark-math) as its math block parser. This is not the one used by Obsidian.
So it may be that Obsidian and the Linter consider different things to be math blocks or inline math.

The expected format for inline math is `$MATH_HERE$`. The amount of dollar signs does not matter so long as it is less than the value being
used to indicate a math block. Math blocks should look something like the following:

``` markdown
$$
MATH_HERE
$$
```

The Linter will try to break inline math blocks into math blocks when the inline math block has the minimum number of `$` at the start of
the inline math.

##### Exceptions

The Linter tries to correct a couple of exceptions that seem to be weird results from the parser when the desired format is not followed for inline and math blocks.

###### Splitting Simple Combined Math Blocks

The Linter will try to fix some combined math blocks that the parser returns. For example the following is considered 2 math blocks even
though it is really 3 different math blocks:

``` markdown
$$a$$

$$
b$$

$$c
$$
```

The Linter does its best to break that apart under the hood into 3 separate math blocks which can then be handled appropriately.
!!! Warning
    This may not be reliable to use to fix more complex math block parsing issues, so please try to conform with the block and inline
    patterns described above for math blocks.

###### Moving Text after Closing Math Block Indicator to Its Own Line

The parser does not handle math block closing indicators on the same line as text as it will consider that text to be part of the math
block even if it comes after the ending indicator. For example, the following is considered to be an entire math block according to 
the underlying parser:

``` markdown
$$
a
$$b
```

The Linter does its best to make sure that the `b` is treated as not being part of the math block.
