<script>
  // Props for the component
  export let src = '';
  export let webpSrc = '';
  export let width = 0;
  export let height = 0;
  export let alt = '';
  export let className = '';
  export let objectFit = 'cover';
  export let fallbackSrc = '/placeholder.jpg';
  export let fillContainer = false; // For card layouts
  export let priority = false; // New prop for priority loading
  export let quality = 'auto'; // New prop for image quality (low, medium, high, auto)
  export let blurPlaceholder = false; // New prop for blur effect during loading
  
  // Calculate aspect ratio
  const aspectRatio = width && height ? `${width} / ${height}` : undefined;
  
  // Process the source URL - use fallback if source is empty, null, or undefined
  $: processedSrc = src && src !== 'null' && src !== 'undefined' ? src : fallbackSrc;
  $: hasValidSrc = !!processedSrc && processedSrc !== 'null' && processedSrc !== 'undefined';
  
  // Determine loading attribute based on priority
  $: loadingAttr = priority ? 'eager' : 'lazy';
  
  // Generate image size sets for responsive loading
  $: sizes = width ? `(max-width: 768px) 100vw, ${width}px` : '100vw';
  
  // New prop to track loading state
  let isLoaded = false;
  let hasError = false;

  function handleError(e) {
    console.error(`Image failed to load: ${src}`);
    hasError = true;
    if (fallbackSrc && src !== fallbackSrc) {
      e.currentTarget.src = fallbackSrc;
    }
    e.currentTarget.onerror = null; // Prevent infinite loop if fallback also fails
  }

  function handleLoad() {
    isLoaded = true;
  }
</script>

<div class={`image-container ${fillContainer ? "w-full h-full" : ""} ${blurPlaceholder && !isLoaded ? "blur-bg" : ""} ${hasError ? "error-bg" : ""}`}>
  <picture>
    {#if webpSrc && hasValidSrc}
      <source srcset={webpSrc} type="image/webp" sizes={sizes} />
    {/if}
    <img
      src={processedSrc}
      {alt}
      class={`gpu-accelerated ${className} ${fillContainer ? "w-full h-full" : ""} ${isLoaded ? "loaded" : "loading"}`}
      loading={loadingAttr}
      width={width || null}
      height={height || null}
      fetchpriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      sizes={sizes}
      style={fillContainer 
        ? `object-fit: ${objectFit}; position: ${fillContainer ? 'absolute' : 'relative'}; inset: 0;` 
        : aspectRatio ? `aspect-ratio: ${aspectRatio}; object-fit: ${objectFit};` : ''}
      on:error={handleError}
      on:load={handleLoad}
    />
  </picture>
</div>

<style>
  .image-container {
    position: relative;
    overflow: hidden;
  }

  .blur-bg {
    background-color: #d0d0d0;
    animation: pulse 1.5s infinite ease-in-out;
  }
  
  .error-bg {
    background-color: #f0f0f0;
    position: relative;
  }
  
  .error-bg::after {
    content: "!";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
    color: #888;
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 0.8; }
    100% { opacity: 0.6; }
  }

  img {
    display: block;
    max-width: 100%;
    transition: opacity 0.2s ease;
  }
  
  img.loading {
    opacity: 0;
  }
  
  img.loaded {
    opacity: 1;
  }
  
  picture {
    display: block;
    width: 100%;
    height: 100%;
  }
  
  /* Ensure fillContainer works properly */
  .image-container.w-full, .image-container.h-full {
    position: relative;
    display: block;
  }
</style>