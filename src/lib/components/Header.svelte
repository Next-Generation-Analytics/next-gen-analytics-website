<script lang="ts">
    import { page } from '$app/stores';

    const isHomePage = $derived($page.url.pathname === '/');
</script>

<header class="relative z-20">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div class="w-full sm:pt-6 py-3 flex flex-row items-center justify-between gap-4 sm:gap-0">
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
            <div class="flex self-end items-center gap-6 sm:ml-10">
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
