type SvgAndPathData = {
  parentSVG: SVGElement;
  paths: SVGPathElement[];
}

declare namespace SVGMorpher {
  /** animation resolution modifies flubbers maxSegmentLength option. The smaller
  the number, animation looks better, but performs slower. */
  const animationResolution: number;
  const animationDuration: number;

  /** Creates an SVG from loaded string (in a file) */
  function createSVGfromString(string: string): SVGElement;
  

  /** Morph elements
  - parentElement - element which is the container of the SVG to animate
  - roSvgEl - SVG element to which the animating element should morph
  - duration - length of the animation
  - callback - callback function to be called with boolean variable passed of completing the animation */
  function morphFromContainerToSvg(parentElementID: string, toSvgEl: string, duration: number, callback: (val: boolean) => void): void;

  /** morph the SVG */
  function morphFromTo(fromSvgEl: string, toSvgEl: string, duration: number, callback: (val: boolean) => void): void;

  /** Animate the SVG Paths
    following options are available
  - from - object containing fromPaths - paths to animate and fromSVG which - has - these paths element
  - to - object containing paths we are animating to nad toSVG which has these - paths
  - duration - how long should the transition last
  - callback - callback function to be called with boolean variable passed of completing the animation */
  function animatePaths(from: { paths: SVGPathElement[] }, to: { paths: SVGPathElement[] }, duration: number, callback: (val: boolean) => void): void;
  function interpolateWithFlubber(fromShape: any, toShape: any): any;

  function equalizeNumOfPaths(from: SvgAndPathData, to: SvgAndPathData): void;
  function interpolateViewBox(left: string, right: string): string;
}

export default SVGMorpher;