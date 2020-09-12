<script>
  export let x = 0;
  export let y = 0;
</script>

<style>
  .circle {
    width: 25px;
    height: 25px;
    border-radius: 50%;
  }
  	svg {
		width: 100%;
		height: 100%;
	}
</style>

<div>
   <svg >
    <circle cx={x} cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
  </svg>
</div>
