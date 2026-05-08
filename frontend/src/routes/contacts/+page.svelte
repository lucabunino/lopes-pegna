<script>
	import { m } from '$lib/paraglide/messages.js';
	import Media from '$lib/components/Media.svelte';
	import Image from '$lib/components/Image.svelte';
	import SliderHalf from '$lib/components/SliderHalf.svelte';
	import { PortableText } from '@portabletext/svelte';
	import PortableTextStyleContent from '$lib/components/portableTextStyles/PortableTextStyleContent.svelte';

	let { data } = $props()

	// Header first setup
	import { getMenu } from '$lib/stores/menu.svelte.js';
    let menuer = getMenu(); menuer.setDark(false); menuer.setDifference(false); menuer.setSmall(false);
</script>

<main class="wo-24">
	{#if data.contacts.heroMedia}
		<section id="hero">
			<Media media={data.contacts.heroMedia} cover={true}/>
		</section>
	{/if}
	<section id="contacts">
		<h4 class="section-title in-14">{m.contacts()}</h4>
		<div class="contacts">
			{#if data.contacts.infoEmail}
				<div class="info">
					<label class="in-14">{m.for_info()}</label>
					<p><a href="mailto:{data.contacts.infoEmail}">{data.contacts.infoEmail}</a></p>
				</div>
			{/if}
			{#if data.contacts.phone}
				<div class="phone">
					<label class="in-14">{m.phone()}</label>
					<p><a href="tel:{data.contacts.phone}">{data.contacts.phone}</a></p>
				</div>
			{/if}
			{#if data.contacts.salesEmail}
				<div class="sales">
					<label class="in-14">{m.customer_service_sales_gifts()}</label>
					<p><a href="mailto:{data.contacts.salesEmail}">{data.contacts.salesEmail}</a></p>
				</div>
			{/if}
			{#if data.contacts.instagram}
				<div class="instagram">
					<label class="in-14">Instagram</label>
					<p><a href={data.contacts.instagram.instagramHref} target="_blank" rel="noopener noreferrer">{data.contacts.instagram.instagramHandle}</a></p>
				</div>
			{/if}
			{#if data.contacts.showroomAdressLabel}
				<div class="showroom">
					<label class="in-14">{m.showroom()}</label>
					{#if data.contacts.showroomAdressHref}
						<p><a href={data.contacts.showroomAdressHref} target="_blank" rel="noopener noreferrer">{data.contacts.showroomAdressLabel}</a></p>
					{:else}
						<p>{data.contacts.showroomAdressLabel}</p>
					{/if}
				</div>
			{/if}
		</div>
	</section>
	{#if data.contacts.slider}
		<section id="slider" class="slider-wrapper">
			<SliderHalf slides={data.contacts.slider} className={'contacts'}/>
		</section>
	{/if}
	{#if data.contacts.appointmentText}
		<section id="appointment">
			<h4 class="section-title in-14">{m.book_an_appointment()}</h4>
			<div class="contacts">
				<div class="appointment">
					<p>{data.contacts.appointmentText}</p>
					{#if data.contacts.infoEmail}
						<a class="btn-m in-12 uppercase" href={data.contacts.infoEmail} target="_blank" rel="noopener noreferrer">{m.book_an_appointment()}</a>
					{/if}
				</div>
			</div>
		</section>
	{/if}
	{#if data.contacts.closingMedia}
		<section id="closing">
			<Media media={data.contacts.closingMedia} cover={true}/>
		</section>
	{/if}
</main>

<style lang="scss">
	#hero {
		height: 70vh;
		min-height: 500px;
		max-height: 650px;
		position: relative;
		
		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 50%;
			z-index: 1;
			pointer-events: none;
			background: linear-gradient(
				to bottom, 
				rgba(0, 0, 0, .5) 50%, 
				rgba(0, 0, 0, 0) 100%
			);
		}
	}
	#contacts {
		padding: var(--sp-80) var(--sp-24) 0;
		display: grid;
    	grid-template-columns: repeat(2, 1fr);
		column-gap: var(--sp-6);

		.contacts {
			grid-column: 2 / span 1;
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			column-gap: var(--sp-6);
			row-gap: var(--sp-36);

			label {
				display: block;
				margin-bottom: var(--sp-6);
			}
		}
	}
	#slider {
		padding: var(--sp-80) 0 0;
	}
	#appointment {
		padding: var(--sp-80) var(--sp-24);
		display: grid;
    	grid-template-columns: repeat(2, 1fr);
		column-gap: var(--sp-6);

		.appointment {
			grid-column: 2 / span 1;
			
			p {
				max-width: 600px;
				margin-bottom: var(--sp-24);
			}
		}
	}
	#closing {
		padding: 0 var(--sp-24);
		height: 70vh;
		min-height: 500px;
		max-height: 700px;
		position: relative;
	}
</style>