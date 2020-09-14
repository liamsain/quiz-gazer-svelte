<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let innerWidth;
  let innerHeight;
  let pointsPerPlane = 5;
  let radius = 15;

  $: centerPoint = { x: innerWidth / 2, y: innerHeight / 2 };

  $: horizontalCircles = getCirclesWithIndexOperation((index) => ({
    x: (innerWidth / pointsPerPlane) * index - radius,
    y: centerPoint.y,
  })).slice(1, pointsPerPlane);

  $: verticalCircles = getCirclesWithIndexOperation((index) => ({
    x: centerPoint.x - radius,
    y: (innerHeight / pointsPerPlane) * index,
  })).slice(1, pointsPerPlane);

  $: topLeftStartingHorizontalCircles = getCirclesWithIndexOperation(
    (index) => ({
      x: (innerWidth / pointsPerPlane) * index - radius,
      y: (innerHeight / pointsPerPlane) * index,
    })
  ).slice(2, pointsPerPlane);

  $: bottomLeftStartingHorizontalCircles = getCirclesWithIndexOperation(
    (index) => ({
      x: (innerWidth / pointsPerPlane) * index - radius,
      y: innerHeight - (innerHeight / pointsPerPlane) * index,
    })
  ).slice(1, pointsPerPlane);
  $: circlesList = [
    horizontalCircles,
    verticalCircles,
    topLeftStartingHorizontalCircles,
    bottomLeftStartingHorizontalCircles,
  ];
  $: activeCircles = circlesList[0];

  function getCirclesWithIndexOperation(indexOperation) {
    return isNaN(centerPoint.x)
      ? []
      : new Array(pointsPerPlane)
          .fill({
            radius,
            visible: true,
          })
          .map((val, index) => ({ ...val, ...indexOperation(index) }));
  }

  function onCircleClick(circ) {
    circ.radius += radius / 2;
    // if (circ.radius >= radius * 2) {
      circ.visible = false;
    // }
    if (activeCircles.every((x) => !x.visible)) {
      if (circlesList.length - 1 > 0) {
        circlesList = circlesList.slice(1, circlesList.length);
        activeCircles = circlesList[0];
      } else {
        calibrationComplete();
      }
    }

    activeCircles = activeCircles.map((x) => ({ ...x }));
  }

  function calibrationComplete() {
    dispatch("calibrationComplete");
  }
</script>

<style>
  svg {
    width: 100%;
    height: 100%;
  }

  circle {
    stroke: black;
    fill: red;
    transition: 0.3s;
    cursor: pointer;
  }
  .calibration__title {
    text-align: center;
  }
</style>

<svelte:window bind:innerWidth bind:innerHeight />
<h2 class="calibration__title">Click the circles while looking at them</h2>
<svg>
  {#each activeCircles as circ}
    {#if circ.visible}
      <circle
        cx={circ.x}
        cy={circ.y}
        r={circ.radius}
        fill="red"
        on:click={() => onCircleClick(circ)} />
    {/if}
  {/each}
</svg>
