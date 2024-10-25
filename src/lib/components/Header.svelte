<script lang="ts">
    import { page } from '$app/stores';

    let { showHomeLink = false } = $props<{
        showHomeLink?: boolean;
    }>();

    const isHomePage = $derived($page.url.pathname === '/');
</script>

<header class="relative z-20">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div class="w-full pt-6 flex items-center justify-between">
            <div class="flex items-center">
                <a href="/" class="flex items-center space-x-2 relative group">
                    {#if !isHomePage}
                        <span class="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300">
                            Next Gen Analytics
                            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                    {/if}
                </a>
            </div>
            <div class="ml-10 space-x-6">
                {#if showHomeLink}
                    <a 
                        href="/" 
                        class="text-gray-600 hover:text-blue-600 transition-colors duration-300 relative group"
                    >
                        Home
                        <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                {/if}
                <a 
                    href="mailto:sachskaren@gmail.com" 
                    class="inline-block px-4 py-2 border border-transparent rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                    Contact
                </a>
            </div>
        </div>
    </nav>
</header>
