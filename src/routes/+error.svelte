<script>
    import { page } from '$app/stores';
    
    // Log error details to help with debugging
    console.error('Error details:', {
        status: $page.status,
        error: $page.error
    });
</script>

<div class="flex min-h-screen items-center justify-center p-4">
    <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">Error {$page.status}</h1>
        <p class="text-lg text-gray-600 mb-4">{$page.error?.message || 'An unexpected error occurred'}</p>
        <a 
            href="/"
            class="inline-flex items-center px-6 py-2 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
        >
            Return Home
        </a>
    </div>
</div> 