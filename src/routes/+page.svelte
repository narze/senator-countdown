<script lang="ts">
	import Canvas from '../components/Canvas.svelte';
	import { saveAs } from 'file-saver';
	import { copyImageToClipboard } from '$lib/copy-image-clipboard';
	import * as htmlToImage from 'html-to-image';
	import { onMount } from 'svelte';
	import { Facebook, Twitter } from 'svelte-share-buttons-component';
	import * as base64 from 'base64util';
	import dayjs from 'dayjs';
	import duration, { type Duration } from 'dayjs/plugin/duration';

	dayjs.extend(duration);

	import { page } from '$app/stores';

	let data = $page.url.searchParams.get('d') || '';
	let decodedData = data.split(',').map((d) => {
		try {
			return base64.urlDecode(d);
		} catch (e) {
			return null;
		}
	});

	let text: string = decodedData[0] || ``;
	let imageDom: HTMLElement;

	$: ogImageUrl = `https://senator-countdown.vercel.app/i?t=${text}`;
	$: shareUrl = `https://senator-countdown.vercel.app`;

	onMount(() => {
		setInterval(updateTimer, 1000);
	});

	function copyImage() {
		htmlToImage
			.toJpeg(imageDom, { canvasWidth: 600, canvasHeight: 600, pixelRatio: 1 })

			.then(function (dataUrl) {
				const img = new Image();
				img.src = dataUrl;
				copyImageToClipboard(img.src);
				// saving = false
			})
			.catch(function (error) {
				console.error('oops, something went wrong!', error);
				console.log(error.message);
			});
	}

	function saveImage() {
		htmlToImage
			.toJpeg(imageDom, { canvasWidth: 600, canvasHeight: 600, pixelRatio: 1 })
			.then(function (blob) {
				saveAs(blob, `senator-countdown-${text}.jpg`);
				// saving = false
			})
			.catch(function (error) {
				console.error('oops, something went wrong!', error);
			});
	}

	// OG
	const title = 'Senator Countdown';
	const description = '=นับถอยหลัง สว==';

	// Countdown
	const targetDate = dayjs('2024-05-11');

	let countdown: Duration;

	// Update the countdown timer every second
	function updateTimer() {
		const currentDate = dayjs();
		const timeDifference = targetDate.diff(currentDate);
		countdown = dayjs.duration(timeDifference);
	}

	$: if (countdown) {
		text = String(Math.ceil(countdown.asDays()));
	}
</script>

<svelte:head>
	<title>{title}</title>

	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta property="og:url" content={'https://senator-countdown.vercel.app'} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImageUrl} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={ogImageUrl} />
</svelte:head>

<div class="container hero">
	<h1 class="text-6xl">
		<span class="highlight">Senator</span> Countdown
		<div class="text-3xl mt-2">
			นับถอยหลัง <span class="highlight">สว.</span>
		</div>
	</h1>

	<!-- Show time in days, hours:minute:seconds -->
	<div class="text-3xl mt-4">
		{#if countdown}
			อีก {Math.floor(countdown.asDays())} วัน {countdown.hours()} ชั่วโมง {countdown.minutes()} นาที
			{countdown.seconds()}
			วินาที
		{:else}
			Loading
		{/if}
	</div>

	<Canvas bind:text bind:imageDom />

	<div class="flex gap-4">
		<button
			on:click={() => copyImage()}
			disabled={!text.length}
			class="bg-blue-500 hover: text-white font-bold py-2 px-4 rounded"
		>
			ก็อปภาพ
		</button>
		<button
			on:click={() => saveImage()}
			disabled={!text.length}
			class="bg-blue-500 hover: text-white font-bold py-2 px-4 rounded"
		>
			เซฟภาพ
		</button>
	</div>

	<div class="flex gap-2 justify-center items-center w-full bottom-4 center">
		<span class="text-lg"> Share: </span>
		<Facebook class="h-10 w-10 rounded" url={shareUrl} text="" />
		<Twitter class="h-10 w-10 rounded" url={shareUrl} text="" />
	</div>

	<div class="flex gap-2">
		<span
			>เครดิตภาพ <a
				class="text-blue-500 hover:underline"
				target="_blank"
				href="https://www.facebook.com/wirojlak/posts/pfbid02hE2YENA48P2skBJmoF1UzYcos4VcfPfSLBn47jPbAhut5LQWyHU2eC6Du5BRdMbzl"
				>Facebook: วิโรจน์ ลักขณาอดิศร</a
			></span
		>

		<span>|</span>

		<a
			class="text-blue-500 hover:underline"
			target="_blank"
			href="https://github.com/narze/senator-countdown">Source Code</a
		>
	</div>
</div>

<style lang="postcss">
	.hero {
		display: flex;
		vertical-align: middle;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		gap: 40px;
	}

	@media screen and (min-width: 768px) {
		.hero {
			gap: 60px;
		}
	}
</style>
