<script>
  import { fetchApi } from '$lib/utils/api';
  import { goto } from '$app/navigation';
  import { isAuthenticated } from '$lib/stores/auth';
  import GoogleSignIn from '$lib/components/GoogleSignIn.svelte';
  import { onMount, onDestroy } from 'svelte';
  
  let email = '';
  let password = '';
  let error = '';
  let successMessage = '';
  let isLoading = false;
  let redirectUrl = '/';
  let needsVerification = false;
  let isResendingVerification = false;
  let verificationEmail = '';
  let verificationSent = false;

  // reCAPTCHA state
  let captchaRequired = false;
  let captchaToken = '';
  let captchaContainer = null; // Element reference for captcha widget
  let captchaWidgetId = null; // ID returned by grecaptcha.render
  let captchaScriptLoaded = false;

  const RECAPTCHA_SITE_KEY = '6LcghQkrAAAAANF060YhRpUbd5gPDt9sQxuN1EiV';

  // --- reCAPTCHA Functions ---
  function loadRecaptchaScript() {
    if (document.getElementById('recaptcha-script')) return; // Already loaded or loading
    
    window.onRecaptchaLoadCallback = () => {
      console.log('reCAPTCHA script loaded.');
      captchaScriptLoaded = true;
      // If captcha was required before script loaded, render it now
      if (captchaRequired && captchaContainer) {
        renderCaptcha();
      }
    };

    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoadCallback&render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
  
  function handleCaptchaSolved(token) {
    console.log('CAPTCHA solved:', token ? 'Token received' : 'Token null');
    captchaToken = token;
    // Potentially trigger form submission automatically here if desired,
    // or just enable the submit button.
  }
  
  function handleCaptchaExpired() {
    console.log('CAPTCHA expired');
    captchaToken = '';
    if (window.grecaptcha && captchaWidgetId !== null) {
        window.grecaptcha.reset(captchaWidgetId);
    }
  }

  function renderCaptcha() {
    if (!captchaScriptLoaded) {
      console.log('reCAPTCHA script not loaded yet, rendering deferred.');
      return; 
    }
    if (captchaContainer && window.grecaptcha && captchaWidgetId === null) {
      console.log('Rendering CAPTCHA widget in container');
      try {
          captchaWidgetId = window.grecaptcha.render(captchaContainer, {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: handleCaptchaSolved, // Called when solved
          'expired-callback': handleCaptchaExpired // Called when expired
        });
        console.log('CAPTCHA widget rendered with ID:', captchaWidgetId);
      } catch (renderError) {
          console.error('Error rendering reCAPTCHA:', renderError);
          error = 'Failed to load CAPTCHA. Please refresh the page.';
      }
    } else if (captchaWidgetId !== null) {
        console.log('CAPTCHA already rendered or container not ready.');
    }
  }
  // --- End reCAPTCHA Functions ---

  onMount(() => {
    console.log("Login page mounted");
    loadRecaptchaScript(); // Load the script when component mounts
    
    // Get redirect URL from query params
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('redirect')) {
        redirectUrl = urlParams.get('redirect');
        console.log("Redirect URL set to:", redirectUrl);
      }
      
      // Check if we just verified email
      if (urlParams.has('verified') && urlParams.get('verified') === 'true') {
        successMessage = "Your email has been verified successfully! You can now log in.";
      }
    }
  });
  
  onDestroy(() => {
    // Optional: Clean up global callback function
    if (window.onRecaptchaLoadCallback) {
        delete window.onRecaptchaLoadCallback;
    }
  });

  async function handleLogin() {
    // Reset captcha state on new attempt unless it was just required
    if (!captchaRequired) {
      captchaToken = ''; 
    }
    
    // Basic validation
    if (!email || !password) {
      error = 'Please enter both email and password';
      return;
    }
    if (captchaRequired && !captchaToken) {
      error = 'Please complete the CAPTCHA verification.';
      // Ensure widget is rendered if token is missing but required
      if (captchaContainer && captchaWidgetId === null) {
          renderCaptcha();
      }
      return;
    }

    error = '';
    isLoading = true;
    needsVerification = false; // Reset verification state on new attempt
    console.log("Attempting login for:", email);
    
    const requestBody = {
      email: email.trim(),
      password: password.trim(),
    };
    
    if (captchaRequired && captchaToken) {
      requestBody.captcha_response = captchaToken;
    }

    try {
      const response = await fetchApi('login/', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      // Login successful
      captchaRequired = false; // Reset captcha requirement on success
      $isAuthenticated = true;
      console.log("Login successful, user data:", response.user);
      
      // Check if nickname exists
      if (!response.user.nickname) {
        console.log("No nickname set, redirecting to set-nickname");
        
        // Use explicit window.location for most reliable redirect
        window.location.href = `/set-nickname?redirect=${encodeURIComponent(redirectUrl)}`;
      } else {
        console.log("User has nickname, redirecting to:", redirectUrl);
        window.location.href = redirectUrl;
      }
    } catch (e) {
      console.error("Login error response:", e);
      
      // Reset CAPTCHA token as it's single-use or expired
      captchaToken = '';
      if (window.grecaptcha && captchaWidgetId !== null) {
          window.grecaptcha.reset(captchaWidgetId);
      }
      
      // Check if CAPTCHA is now required
      if (e.data && e.data.captcha_required === true) {
        console.log('CAPTCHA is required by backend.');
        error = e.message || 'Too many failed attempts. Please complete the CAPTCHA.';
        captchaRequired = true;
        // Ensure script is loaded and trigger rendering
        loadRecaptchaScript(); 
        // Use timeout to ensure container is available in the DOM if conditional
        setTimeout(renderCaptcha, 0); 
      } else if (e.message && e.message.includes('verify your email')) {
        needsVerification = true;
        verificationEmail = email;
        error = 'Please verify your email before logging in.';
        captchaRequired = false; // Ensure captcha doesn't show on verification error
      } else {
        error = e.message || 'Login failed';
        captchaRequired = false; // Ensure captcha doesn't show on other errors
      }
    } finally {
        // Only set isLoading false if not navigating away
        // Navigation might happen on success, so check if error exists
        if (error || needsVerification) {
          isLoading = false;
        }
    }
  }
  
  async function resendVerification() {
    if (!verificationEmail) {
      verificationEmail = email;
    }
    
    if (!verificationEmail) {
      error = 'Email is required';
      return;
    }
    
    isResendingVerification = true;
    error = '';
    
    try {
      await fetchApi('resend-verification/', {
        method: 'POST',
        body: JSON.stringify({
          email: verificationEmail.trim()
        })
      });
      
      verificationSent = true;
      successMessage = `Verification email sent to ${verificationEmail}. Please check your inbox.`;
    } catch (e) {
      error = e.message || 'Failed to resend verification email';
    } finally {
      isResendingVerification = false;
    }
  }
  
  function handleGoogleSuccess(event) {
    console.log("Google login successful, redirecting based on nickname");
    
    // The redirect is handled in GoogleSignIn component
  }
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
  <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg sm:p-8">
    <h1 class="mb-6 text-center text-2xl font-bold text-gray-900">Login</h1>

    {#if successMessage}
      <div class="mb-6 rounded-lg bg-green-50 p-4 text-green-800">
        <p>{successMessage}</p>
      </div>
    {/if}

    {#if needsVerification}
      <div class="mb-6 rounded-lg bg-blue-50 p-4">
        <h3 class="font-semibold text-blue-700">Email Verification Required</h3>
        <p class="mt-2 text-blue-600">
          Please verify your email address before logging in. Check your inbox for a verification link.
        </p>
        
        {#if verificationSent}
          <p class="mt-2 text-green-600">
            Verification email sent! Please check your inbox.
          </p>
        {:else}
          <div class="mt-3">
            <p class="text-sm text-gray-600">
              Didn't receive the email? We can send it again.
            </p>
            <button
              on:click={resendVerification}
              class="mt-2 inline-flex items-center rounded-md bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
              disabled={isResendingVerification}
            >
              {#if isResendingVerification}
                <span class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></span>
                Sending...
              {:else}
                Resend Verification Email
              {/if}
            </button>
          </div>
        {/if}
      </div>
    {/if}

    <form on:submit|preventDefault={handleLogin} class="space-y-4">
      <!-- Email field -->
      <div>
        <label for="email" class="mb-1 block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email" 
          bind:value={email}
          placeholder="Enter your email"
          class="w-full rounded-md border border-gray-300 px-3 py-2"
          required
          autocomplete="username"
        />
      </div>

      <!-- Password field -->
      <div>
        <label for="password" class="mb-1 block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="Enter your password"
          class="w-full rounded-md border border-gray-300 px-3 py-2"
          required
          autocomplete="current-password"
        />
      </div>

      <!-- CAPTCHA Widget Placeholder -->
      {#if captchaRequired}
        <div class="my-4 flex justify-center">
          <div bind:this={captchaContainer}></div>
        </div>
      {/if}

      <!-- Error message -->
      {#if error && !needsVerification}
        <div class="rounded-r border-l-4 border-red-500 bg-red-50 p-4">
          <p class="text-sm text-red-700">{error}</p>
        </div>
      {/if}

      <!-- Submit button -->
      <button
        type="submit"
        class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        disabled={isLoading}
      >
        {#if isLoading}
            <span class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
        {/if}
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>

    <!-- Divider -->
    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="bg-white px-2 text-gray-500">Or continue with</span>
      </div>
    </div>

    <!-- Google Sign-In -->
    <div class="mt-2">
      <GoogleSignIn redirect={redirectUrl} on:success={handleGoogleSuccess} />
    </div>

    <!-- Register link -->
    <div class="mt-6 text-center text-sm">
      <p>
        Don't have an account?
        <a href="/register" class="font-medium text-blue-600 hover:text-blue-500">
          Register
        </a>
      </p>
    </div>
  </div>
</div>