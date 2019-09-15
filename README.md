# svg-morpher

Helper module for morphing between SVGs, specifically between two SVGs with different amount of Path elements.

## Usage

1. Import the SVGMorpher into your project

```
import SVGMorpher from "SVGMorpher.js";
```

2. Use the either the morphFromTo or morphFromContainerToSvg function

```
SVGMorpher.morphFromContainerToSvg(containerID, toSVG, durationOfAnimation, callbackFunction);

SVGMorpher.morphFromTo(fromSVG, toSVG, durationOfAnimation, callbackFunction);

```

First three parameters must be provided, callback is optional!

Note - the morph function provides callback function with a boolean parameter - true if the animation ended.

3. HAVE FUN!

## Dependencies

This helper uses two dependencies:

1. Flubber - SVG Interpolator
2. Just.animate - using Timeline for animation.
