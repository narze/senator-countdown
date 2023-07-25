<script lang="ts">
	export let text: string = '';
	export let imageDom: HTMLElement;

	$: transformedText = text;

	let domWidth: number;
</script>

<div
	class="flex items-center justify-center relative w-full max-w-5xl aspect-square mx-auto overflow-visible"
>
	<div
		bind:this={imageDom}
		bind:clientWidth={domWidth}
		class="w-full absolute inset-0 aspect-square bg-transparent"
	>
		<img src="/images/bg.png" class="z-10 absolute inset-0 w-full aspect-square" alt="template" />

		<div class="z-20 absolute inset-x-0 font-bold w-full">
			<svg id="transformedText" viewBox="0 0 900 900" style={'font-size: 185px;'}>
				<text class="stroked text-center" x="78%" y="57%" text-anchor="end" dominant-baseline="end"
					>{transformedText}</text
				>
				<text class="text-center" x="78%" y="57%" text-anchor="end" dominant-baseline="end"
					>{transformedText}</text
				>
			</svg>
		</div>
	</div>
</div>

<style>
	svg text {
		fill: #f47e18;
	}

	svg text.stroked {
		fill: #f47e18;
		stroke: black;
		stroke-width: 0.25em;
		stroke-linejoin: round;
	}
</style>
