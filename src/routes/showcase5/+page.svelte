<script>
    import UtsuboContactButton from './UtsuboContactButton.svelte';
  </script>
  
  <main>
    <div class="container">
      <h1>Utsubo-Inspired Contact Button</h1>
      <div class="button-container">
        <UtsuboContactButton text="Contact" buttonClass="primary-btn" />
      </div>
      <div class="button-container">
        <UtsuboContactButton text="Get in Touch" buttonClass="secondary-btn" />
      </div>
    </div>
  </main>
  
  <style>
    :global(:root) {
      --defaultColor: #FAF5F0;
      --hlColor: #f9b639;
      --mainEasing: cubic-bezier(.25, 1, .5, 1);
    }
  
    :global(body) {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: #04171f;
      color: var(--defaultColor);
    }
  
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      text-align: center;
    }
  
    h1 {
      margin-bottom: 40px;
    }
  
    .button-container {
      margin: 20px 0;
    }
  
    :global(.primary-btn) {
      background-color: rgba(255, 255, 255, 0.05);
    }
  
    :global(.secondary-btn) {
      border: 1px solid var(--hlColor);
      background-color: transparent;
    }
  </style>