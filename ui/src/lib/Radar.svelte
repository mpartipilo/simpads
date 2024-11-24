<script>
	let { input = $bindable(), ...props } = $props();
</script>

<label for="radarInput">Radar CSV Input:</label>
<textarea id='radarInput' name='radarInput' bind:value={input} rows="10">
</textarea>

<style>
  label {
    display: block
  }
  textarea {
    width: 100%;
  }
</style>