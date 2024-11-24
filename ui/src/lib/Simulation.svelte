<script>
  import { RunSimulation } from "@simlib/simulation.js";

	let { input = $bindable() } = $props();
  let output = $state([])
  let randomSeed = $state(1000)
  let pkRatio = $state(0.8)

  function handleRunSim() {
    output = RunSimulation({data: input ?? '', randomSeed, pkRatio})
  }
</script>

<label for="randomSeed">Random Seed:</label>
<input type="text" id="randomSeed" name="randomSeed" bind:value={randomSeed} />

<label for="pkRatio">Probability of Kill (Pk) ratio:</label>
<input type="text" id="pkRatio" name="pkRatio" bind:value={pkRatio} />

<button onclick={handleRunSim}>Run</button>

<table border="1">
  <thead>
  <tr>
    <th>0:Even/1:Odd</th>
    <th>Hostile Detected</th>
    <th>Missile Fired</th>
    <th>PoK</th>
    <th>Engagement Success</th>
  </tr>
</thead>
<tbody>
  {#each output as timestep, idx }
  <tr 
    class:nohostile={!timestep.hostileDetected} 
    class:hostile={timestep.hostileDetected && !timestep.engagementSuccess}
    class:kill={timestep.engagementSuccess}
    >
    <td>{timestep.radarInput}</td>
    <td>{timestep.hostileDetected}</td>
    <td>{timestep.missileFired}</td>
    <td>{timestep.calculatedPok}</td>
    <td>{timestep.engagementSuccess}</td>
  </tr>
  {/each}
</tbody>
</table>

<style>
  .nohostile { background-color: green }
  .hostile { background-color: orange }
  .kill { background-color: red }
</style>