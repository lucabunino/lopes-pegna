<script>
    // imports
    import { onMount } from 'svelte';
    import ImageShopify from './ImageShopify.svelte';

    // stores

    // functions
    let { slides } = $props();
    let container = $state();
    let x = $state(0);
    let isDragging = $state(false);
    let startX = $state(0);
    let velocity = $state(0);
    let lastMouseX = $state(0);
    let lastTimestamp = $state(0);
    let lastInteractionTime = $state(0);
    const PAUSE_DURATION = 1000;
    const BASE_SPEED = 0.3;
    const FRICTION = 0.96;

    function update() {
        const now = Date.now();
        const isPaused = now - lastInteractionTime < PAUSE_DURATION;
        if (!isDragging) {
            if (!isPaused) x -= BASE_SPEED;
            x += velocity;
            velocity *= FRICTION;
            if (Math.abs(velocity) < 0.01) velocity = 0;
            if (container) {
                const halfWidth = container.scrollWidth / 2;
                if (x <= -halfWidth) x += halfWidth;
                if (x > 0) x -= halfWidth;
            }
        }
        requestAnimationFrame(update);
    }
    onMount(() => {
        const frame = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frame);
    });
    function handleMouseDown(e) {
        isDragging = true;
        lastInteractionTime = Date.now(); 
        startX = e.pageX - x;
        velocity = 0;
        lastMouseX = e.pageX;
        lastTimestamp = Date.now();
    }
    function handleMouseMove(e) {
        if (!isDragging) return;
        const now = Date.now();
        const dt = now - lastTimestamp;
        if (dt > 0) {
            const instantVelocity = (e.pageX - lastMouseX);
            velocity = velocity * 0.2 + instantVelocity * 0.8;
        }
        x = e.pageX - startX;
        lastMouseX = e.pageX;
        lastTimestamp = now;
    }
    function handleMouseUp() {
        if (!isDragging) return;
        isDragging = false;
        lastInteractionTime = Date.now(); 
        velocity *= 1.2; 
    }
    function handleTouchStart(e) {
        isDragging = true;
        lastInteractionTime = Date.now(); 
        startX = e.touches[0].pageX - x;
        velocity = 0;
        lastMouseX = e.touches[0].pageX;
        lastTimestamp = Date.now();
    }
    function handleTouchMove(e) {
        if (!isDragging) return;
        const now = Date.now();
        const dt = now - lastTimestamp;
        const pageX = e.touches[0].pageX;
        if (dt > 0) {
            const instantVelocity = (pageX - lastMouseX);
            velocity = velocity * 0.2 + instantVelocity * 0.8;
        }
        x = pageX - startX;
        lastMouseX = pageX;
        lastTimestamp = now;
    }
    function handleTouchEnd() { handleMouseUp(); }
	function handleWheel(e) {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            lastInteractionTime = Date.now();
            velocity -= e.deltaX * 0.1;
        }
    }
</script>

<div 
    bind:this={container}
    class="marquee-container" 
    onmousedown={handleMouseDown}
    onmousemove={handleMouseMove}
    onmouseup={handleMouseUp}
    onmouseleave={handleMouseUp}
    onwheel={handleWheel}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
>
    <div 
        class="marquee-content" 
        style:transform="translate3d({Math.round(x * 100) / 100}px, 0, 0)"
    >
        {#each [...slides, ...slides] as slide}
            <div class="marquee-item" ondragstart={(e) => e.preventDefault()}>
                <!-- <Media media={slide} cover={false} className={'sliderMarquee'} loading={'eager'}/> -->
				<ImageShopify image={slide} className="sliderMarqueeShopify"/>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .marquee-container {
        overflow: hidden;
        width: 100%;
		grid-column: span 12;
        user-select: none;
        touch-action: pan-y;
        cursor: grab;
        
        &:active {
            cursor: grabbing;
        }
    }

    .marquee-content {
        display: flex;
        gap: var(--sp-3);
        width: max-content;
        will-change: transform;
        contain: layout paint;
    }

    .marquee-item {
        flex-shrink: 0;
        height: 100%;
        
        :global(.swiperFixedHeight) {
            pointer-events: none;
            user-select: none;
        }
    }
</style>