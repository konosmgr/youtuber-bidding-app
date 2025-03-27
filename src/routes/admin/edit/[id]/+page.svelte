<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { isAuthenticated } from '$lib/stores/auth';
  import { fetchApi, getCsrfToken } from '$lib/utils/api';
  import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';
  import { onMount } from 'svelte';

  let item = null;
  let loading = true;
  let error = null;
  let imagePreviewUrls = [];
  let selectedFiles = [];
  let fileInput;
  let changeEndDate = false; // Toggle for changing the end date
  let originalEndDate = ''; // Store original end date for display
  let imagesToDelete = []; // Track image IDs to delete

  // Check authentication and admin status on mount
  onMount(async () => {
    try {
      if (!$isAuthenticated) {
        goto('/adminlogin');
        return;
      }
      
      // Verify staff status
      const userData = await fetchApi('users/me/');
      if (!userData.is_staff) {
        // Not admin - redirect to home
        alert('You do not have permission to access the admin area');
        goto('/');
        return;
      }
      
      // Continue with loading item data
      await loadItem();
    } catch (e) {
      console.error('Error checking admin status:', e);
      goto('/adminlogin');
    }
  });

  async function loadItem() {
    try {
      const id = $page.params.id;
      console.log(`Loading item ${id}`);
      
      const data = await fetchApi(`items/${id}/`);
      item = data;
      originalEndDate = new Date(item.end_date).toLocaleString();
      
      // Load image previews if available
      if (item.images && item.images.length > 0) {
        imagePreviewUrls = item.images.map(img => img.image);
      }
      
      loading = false;
    } catch (e) {
      console.error('Failed to load item:', e);
      error = 'Failed to load item';
      loading = false;
    }
  }

  async function handleSubmit() {
    try {
      loading = true;
      error = null;
      
      // Create a JSON object for update
      const updateData = {
        title: item.title,
        category_id: item.category.id,
        description: item.description,
        starting_price: item.starting_price,
        is_active: item.is_active,
        youtube_url: item.youtube_url || '' // Always include youtube_url, empty string if null
      };
      
      // Only include end_date if the toggle is checked
      if (changeEndDate) {
        updateData.end_date = item.end_date;
      }
      
      console.log("Submitting update with data:", updateData);
      
      // Use fetchApi for the basic update with JSON
      await fetchApi(`items/${item.id}/`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      // If we have images to delete, handle that first
      if (imagesToDelete.length > 0) {
        await handleImageDeletion();
      }
      
      // If we have new images, handle them in a separate request
      if (selectedFiles.length > 0) {
        await handleImageUpload();
      }
      
      // Redirect back to admin dashboard
      goto('/admin');
    } catch (e) {
      console.error('Error updating item:', e);
      error = e.message || 'Failed to update item';
      loading = false;
    }
  }

  // Handle image deletion
  async function handleImageDeletion() {
    try {
      console.log(`Deleting ${imagesToDelete.length} images with IDs:`, imagesToDelete);
      
      const csrfToken = await getCsrfToken();
      
      // Make API request to delete images
      const response = await fetch(`/api/items/${item.id}/delete_images/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ image_ids: imagesToDelete })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to delete images');
      }
      
      return await response.json();
    } catch (e) {
      console.error('Image deletion error:', e);
      throw e;
    }
  }
  
  // Separate function to handle image uploads
  async function handleImageUpload() {
    try {
      console.log(`Uploading ${selectedFiles.length} new images`);
      
      const csrfToken = await getCsrfToken();
      const form = new FormData();
      
      // Add each image to the form
      selectedFiles.forEach(file => {
        form.append('images', file);
      });
      
      // Make a separate request for image uploads
      const response = await fetch(`/api/items/${item.id}/add_images/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: form
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to upload images');
      }
      
      return await response.json();
    } catch (e) {
      console.error('Image upload error:', e);
      throw e;
    }
  }
  
  // Handle image addition
  function handleImageChange(event) {
    const newFiles = Array.from(event.target.files);
    console.log(`Selected ${newFiles.length} new images`);
    
    // Add to selected files
    selectedFiles = [...selectedFiles, ...newFiles];
    
    // Generate previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviewUrls = [...imagePreviewUrls, e.target.result];
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    fileInput.value = '';
  }
  
  // Delete an existing image
  function deleteExistingImage(imageId, index) {
    console.log(`Marking image ${imageId} for deletion`);
    
    // Add image ID to the deletion list
    imagesToDelete.push(imageId);
    
    // Remove from image preview array and update UI
    const filteredUrls = [...imagePreviewUrls];
    filteredUrls.splice(index, 1);
    imagePreviewUrls = filteredUrls;
    
    // Also remove the image from the item.images array if needed
    if (item.images) {
      item.images = item.images.filter(img => img.id !== imageId);
    }
  }
  
  // Remove a newly added image (not yet uploaded)
  function removeNewImage(newIndex) {
    // Find the overall index in the image previews
    const existingImageCount = item.images ? item.images.length : 0;
    const overallIndex = existingImageCount + newIndex;
    
    // Remove from preview URLs
    const filteredUrls = [...imagePreviewUrls];
    filteredUrls.splice(overallIndex, 1);
    imagePreviewUrls = filteredUrls;
    
    // Remove from selected files
    selectedFiles = selectedFiles.filter((_, i) => i !== newIndex);
  }
</script>

<div class="container mx-auto p-8">
  <div class="mx-auto max-w-3xl">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-amber-600">Edit Item</h1>
      <a href="/admin" class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded shadow transition-colors">
        Back to Admin
      </a>
    </div>

    {#if loading}
      <div class="flex justify-center p-6">
        <div class="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="ml-2">Loading item data...</p>
      </div>
    {:else if error}
      <div class="p-4 bg-red-100 text-red-700 rounded-md border border-red-300">
        <p>{error}</p>
      </div>
    {:else if item}
      <form on:submit|preventDefault={handleSubmit} class="space-y-6 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-gray-200/30">
        <div>
          <label for="title" class="block text-sm font-medium mb-1 text-gray-700">Title</label>
          <input
            id="title"
            type="text"
            bind:value={item.title}
            class="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200"
            required
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium mb-1 text-gray-700">Description</label>
          <textarea
            id="description"
            bind:value={item.description}
            class="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200"
            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <label for="youtube_url" class="block text-sm font-medium mb-1 text-gray-700">
            YouTube URL (Optional)
          </label>
          <input
            id="youtube_url"
            type="url"
            bind:value={item.youtube_url}
            class="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <!-- End date section with toggle -->
        <div class="border border-gray-200 p-4 rounded-md bg-gray-50/80">
          <div class="flex items-center mb-2">
            <input
              type="checkbox"
              id="changeEndDate"
              bind:checked={changeEndDate}
              class="mr-2 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <label for="changeEndDate" class="text-sm font-medium text-gray-700">
              Change End Date and Time
            </label>
          </div>
          
          {#if changeEndDate}
            <input
              id="end_date"
              type="datetime-local"
              bind:value={item.end_date}
              class="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200"
              required
            />
            <p class="text-xs text-gray-500 mt-1">
              Current end date: {originalEndDate}
            </p>
          {:else}
            <p class="text-sm text-gray-600">
              Current end date: {originalEndDate}
            </p>
          {/if}
        </div>

        <div>
          <label class="flex items-center">
            <input
              type="checkbox"
              bind:checked={item.is_active}
              class="mr-2 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <span class="text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>
        
        <!-- Current Images -->
        {#if item.images && item.images.length > 0}
          <div class="border border-gray-200/30 rounded-md p-4 bg-gray-50/50">
            <h3 class="text-sm font-medium mb-3 text-gray-700">Current Images</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {#each item.images as image, i}
                <div class="relative rounded-md border border-gray-200 overflow-hidden shadow-sm hover:shadow transition">
                  <ResponsiveImage
                    src={image.image}
                    webpSrc={image.webp_url}
                    width={image.width}
                    height={image.height}
                    alt="Item"
                    className="h-28 w-full object-cover"
                  />
                  <button 
                    type="button" 
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-600 transition"
                    on:click={() => deleteExistingImage(image.id, i)}
                  >
                    ×
                  </button>
                </div>
              {/each}
            </div>
          </div>
        {/if}
        
        <!-- Add new images -->
        <div>
          <label for="images" class="block text-sm font-medium mb-2 text-gray-700">Add New Images</label>
          <input
            id="images"
            type="file"
            on:change={handleImageChange}
            bind:this={fileInput}
            multiple
            accept="image/*"
            class="w-full rounded-md border border-gray-300 p-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-amber-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-amber-700 hover:file:bg-amber-100"
          />
          
          {#if selectedFiles.length > 0}
            <div class="mt-4">
              <p class="text-sm text-gray-600 mb-2">{selectedFiles.length} new image(s) selected</p>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {#each selectedFiles as _, i}
                  <div class="relative rounded-md border border-gray-200 overflow-hidden shadow-sm hover:shadow transition">
                    <img 
                      src={imagePreviewUrls[(item.images ? item.images.length : 0) + i]} 
                      alt="Preview" 
                      class="h-28 w-full object-cover" 
                    />
                    <button 
                      type="button" 
                      class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-600 transition"
                      on:click={() => removeNewImage(i)}
                    >
                      ×
                    </button>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <div class="flex justify-end gap-4 pt-2">
          <button
            type="button"
            on:click={() => goto('/admin')}
            class="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 shadow transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700 shadow transition-colors"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    {/if}
  </div>
</div>