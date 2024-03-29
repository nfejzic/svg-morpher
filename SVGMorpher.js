import { interpolate, timeline } from "just-animate";

let flubber = require("flubber");

const SVGMorpher = {
  // animation resolution modifies flubbers maxSegmentLength option. The smaller
  // the number, animation looks better, but performs slower.
  animationResolution: 5,
  animationDuration: 0,
  createSVGfromString(string) {
    let div = document.createElement("div");
    div.innerHTML = string.trim();

    return div.getElementsByTagName("svg")[0];
  },

  // Morph elements
  // @parentElement - element which is the container of the SVG to animate
  // @roSvgEl - SVG element to which the animating element should morph
  // duration - length of the animation
  // callback - callback function to be called with boolean variable passed of
  // completing the animation
  morphFromContainerToSvg(parentElementID, toSvgEl, duration, callback) {
    let container = document.getElementById(parentElementID);
    let fromSVG = container.firstChild;

    // get the From SVG Element and pass it to the function for morphing
    SVGMorpher.morphFromTo(fromSVG, toSvgEl, duration, callback);
  },

  // morph the SVG
  morphFromTo(fromSvgEl, toSvgEl, duration, callback) {
    let testTime = Date.now();

    let fromSVG = fromSvgEl;
    let toSVG = toSvgEl;

    // paths are needed for flubber to animate.
    // this code gets all the path nodes from each of SVGs and converts it into
    // Array
    let fromPaths = Array.from(fromSVG.getElementsByTagName("path"));
    let toPaths = Array.from(toSVG.getElementsByTagName("path"));

    // Some SVGs have more paths than the others. This function makes sure that
    // the number of paths on two SVGs be the same, otherwise some pieces are
    // going to be missing!
    SVGMorpher.equalizeNumOfPaths(
      { parentSVG: fromSVG, paths: fromPaths },
      { parentSVG: toSVG, paths: toPaths }
    );

    // sort the paths here, from smallest to largest! - should I use this?
    // fromPaths.sort((a, b) => sortString(a, b));
    // toPaths.sort((a, b) => sortString(a, b));

    // This function is going to be the one handling the animation
    SVGMorpher.animatePaths(
      { parentSVG: fromSVG, paths: fromPaths },
      { parentSVG: toSVG, paths: toPaths },
      duration,
      callback
    );
    SVGMorpher.animationDuration = Date.now() - testTime;
    if (this.animationDuration > 400) {
      this.animationResolution =
        this.animationResolution < 20 ? this.animationResolution + 1 : 20;
    } else if (this.animationDuration < 200) {
      this.animationResolution =
        this.animationResolution > 5 ? this.animationResolution - 1 : 5;
    }
  },

  // Animate the SVG Paths
  // following options are available
  // @from - object containing fromPaths - paths to animate and fromSVG which
  // has
  // these paths element
  // @to - object containing paths we are animating to nad toSVG which has these
  // paths
  // @duration - how long should the transition last
  // @animatedStyleClass - optional style for SVGs while in transition (note use
  // animated-svg class in css)
  // @staticStyleClass - optional style for SVGs while in transition (note use
  // static-svg class in css)
  animatePaths(from, to, duration, callback) {
    let fromPaths = from.paths;
    let fromSVG = from.parentSVG;

    let toPaths = to.paths;
    let toSVG = to.parentSVG;

    let fromSVGID = fromSVG.id;
    let t1 = timeline();

    for (let i = 0; i < fromPaths.length; i++) {
      let fromPathID = (fromPaths[i].id = fromSVGID + "Path" + i);

      let fromD = fromPaths[i].getAttribute("d");
      let toD = toPaths[i].getAttribute("d");

      let target = "#" + fromPathID;

      t1.fromTo(0, duration, {
        targets: target,
        duration: duration,
        props: {
          d: {
            value: [fromD, toD],
            interpolate: this.interpolateWithFlubber
          }
        }
      });

      t1.play();
    }

    // animate viewbox of the SVG
    let newViewBox = toSVG.getAttribute("viewBox");
    let t2 = timeline();
    t2.animate({
      targets: fromSVG,
      duration: duration,
      props: {
        viewBox: {
          value: [fromSVG.getAttribute("viewBox"), newViewBox],
          interpolate: SVGMorpher.interpolateViewBox
        }
      }
    });
    t2.play().on("finish", () => {
      // report as animation done!
      callback(true);
    });
  },

  interpolateWithFlubber(fromShape, toShape) {
    return flubber.interpolate(fromShape, toShape, {
      maxSegmentLength: SVGMorpher.animationResolution
    });
  },

  // equalize the number of paths on two SVGs
  // @from - object containing fromSVG and fromPaths.
  // @to - object containing toSVG and toPaths
  // SVG elements are needed for insertion of additional Path elements.
  equalizeNumOfPaths(from, to) {
    let { parentSVG: fromSVG, paths: fromPaths } = from;
    let { parentSVG: toSVG, paths: toPaths } = to;

    // equalize if number of paths differs
    if (fromPaths.length - toPaths.length !== 0) {
      // determine which SVG has more paths
      const case1 = fromPaths.length < toPaths.length;

      // find out how many paths are needed and store into diff variable
      let diff = Math.abs(toPaths.length - fromPaths.length)

      // create new Path element
      const elemPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

      // the path to copy is going to be the last path of the SVG with fewer
      // paths
      const copyPath = case1 ? fromPaths[fromPaths.length - 1] : toPaths[toPaths.length - 1];

      // copy the path values - d element and store it into newly created Path
      elemPath.setAttributeNS(null, "d", copyPath.getAttribute("d"));

      // insert a path into SVG with fewer paths, and repeat 'diff' many times
      for (let i = 0; i < diff; i++) {
        // append Path to SVG element with fewer paths
        const clonePath = elemPath.cloneNode(true);
        copyPath.parentElement.appendChild(clonePath);

        if (case1) {
          fromPaths.push(clonePath);
        } else {
          toPaths.push(clonePath);
        }
      }
    }
  },

  // This function animates scaling of viewBox - since many SVGs have different
  // sizes, this is used to keep them in a constant size.
  interpolateViewBox(left, right) {
    const leftVal = left.split(" ").map(s => +s);
    const rightVal = right.split(" ").map(s => +s);

    return offset => {
      return leftVal
        .map((l, i) => interpolate(l, rightVal[i], offset))
        .join(" ");
    };
  }
};

export default SVGMorpher;
