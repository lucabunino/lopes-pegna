<script>
    import { page } from "$app/state";
    import { browser, dev } from "$app/environment";
    import { urlFor } from "$lib/utils/image";
    
    // 1. Handle the array: Extract the first item from the Layout SEO array
    const seoBase = $derived(Array.isArray(page.data?.seo) ? page.data.seo[0] : page.data?.seo);
    const seoSingle = $derived(page.data?.seoSingle);
    
    const canonicalUrl = $derived(page.url.origin + page.url.pathname);

    // 2. Logic: If seoSingle exists, use "Page | Base". If not, just "Base" (Homepage)
    const displayTitle = $derived(
        seoSingle?.seoTitle 
            ? `${seoSingle.seoTitle} | ${seoBase?.seoTitle || ''}` 
            : (seoBase?.seoTitle || "")
    );

    // 3. Fallback logic for Description
    const rawDesc = $derived(seoSingle?.seoDescription || seoBase?.seoDescription || "");
    const displayDesc = $derived(rawDesc.length > 157 ? rawDesc.slice(0, 157) + "..." : rawDesc);

    // 4. Fallback logic for Social Image
    const seoImgObj = $derived(seoSingle?.seoImage || seoBase?.seoImage);
    const socialImageUrl = $derived(
        seoImgObj 
            ? urlFor(seoImgObj).width(1200).height(630).fit('crop').quality(70).format('jpg').url() 
            : undefined
    );
</script>

<svelte:head>
    {#if displayTitle}
        <title>{displayTitle}</title>
        <meta name="title" content={displayTitle} />
        <meta property="og:title" content={displayTitle} />
        <meta name="twitter:title" content={displayTitle} />
        <meta property="og:site_name" content={seoBase?.seoTitle} />
    {/if}

    {#if displayDesc}
        <meta name="description" content={displayDesc} />
        <meta property="og:description" content={displayDesc} />
        <meta name="twitter:description" content={displayDesc} />
    {/if}

    {#if socialImageUrl}
        <meta property="og:image" content={socialImageUrl} />
        <meta property="og:image:secure_url" content={socialImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content={socialImageUrl} />
    {/if}

    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:locale" content="it_IT" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href={canonicalUrl} />

    {#if page.data?.hidden}
        <meta name="robots" content="noindex, nofollow" />
    {:else}
        <meta name="robots" content="index, follow" />
    {/if}
</svelte:head>