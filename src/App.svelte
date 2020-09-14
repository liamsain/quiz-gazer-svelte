<script>
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";
  import Calibration from "./Calibration.svelte";
  import Welcome from "./Welcome.svelte";
  import Quiz from "./Quiz.svelte";

  const States = {
    Welcome: "welcome",
    Calibration: "calibration",
    Quiz: "quiz",
  };

  let currentState = States.Welcome;
  let webgazerLoading = true;

  let calibrationComplete = false;
  let x = 0;
  let y = 0;
  let eyeCoords = spring(
    { x: 50, y: 50 },
    {
      stiffness: 0.1,
      damping: 1,
    }
  );
  onMount(async () => {
    webgazer.params.showVideoPreview = true;
    await webgazer
      .setGazeListener(function (data, clock) {
        webgazerLoading = false;
        if (!data) {
          return;
        }
        eyeCoords.x = data.x;
        eyeCoords.y = data.y;
        eyeCoords.set({ x: data.x, y: data.y });
      })
      .begin();
    webgazer.showPredictionPoints(false);
  });
</script>

<style>
  main {
    height: 100%;
  }
  svg {
    width: 100%;
    height: 100%;
  }
  circle {
    fill: #ff3e00;
  }
  h1 {
    text-align: center;
  }
</style>

<main>
  {#if webgazerLoading}
    <h1 style="margin-top: 100px;">Loading Webgazer...</h1>
  {/if}
  {#if !webgazerLoading}
    {#if currentState === States.Welcome}
      <Welcome on:next={() => (currentState = States.Calibration)} />
    {/if}
    {#if currentState === States.Calibration}
      <Calibration
        on:calibrationComplete={() => {
          currentState = States.Quiz;
        }} />
    {/if}
    {#if currentState === States.Quiz}
      <Quiz eyeX={eyeCoords.x} eyeY={eyeCoords.y} />
    {/if}
  {/if}

  {#if calibrationComplete}
    <svg>
      <circle cx={$eyeCoords.x} cy={$eyeCoords.y} r={10} />
    </svg>
  {/if}
</main>
