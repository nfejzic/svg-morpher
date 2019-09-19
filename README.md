# SVG-Morpher

## About

This is a helper module for morphing between SVGs. Specifically, between two SVGs with different amount of Path elements.

## Usage

1. Import it as a module:

```
import SVGMorpher from "svg-morpher";
```

2. Use either morphFromTo or morphFromContainerToSvg function. First three parameters must be provided, callback is optional!

```
SVGMorpher.morphFromContainerToSvg(containerID, toSVG, duration, callback);

// or

SVGMorpher.morphFromTo(fromSVG, toSVG, duration, callback);
```

Note - the morph function provides callback function with a boolean parameter -> true when animation ends.

3. Have Fun!

## Dependencies

This module uses two dependencies:

1. Flubber - SVG Interpolator -> for the interpolation between SVG Paths

2. Just.animate - library for animation. In this case, Timeline is used for animation.

**Author** @nfejzic - Nadir Fejzic
