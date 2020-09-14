<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<style>
  .welcome__container {
    position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align:center;
  }
  .welcome__container p {
    font-size: 25px;
  }
</style>

<div class="welcome__container">
  <h1>Hi</h1>
  <p>
    This app uses <a href="https://webgazer.cs.brown.edu/">WebGazer js</a> and your
    webcam to detect where you are looking.
  </p>
  <p>
    You can answer questions just by looking at the answer, no clicks
    needed!
  </p>
  <button
    style="margin-top: 44px;cursor: pointer;"
    on:click={() => dispatch('next')}>But first, we must calibrate...</button>
</div>
