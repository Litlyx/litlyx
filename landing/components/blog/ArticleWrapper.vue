<script lang="ts" setup>
import { blogPosts } from '~/blog/Blog';

definePageMeta({ layout: 'header' });
const route = useRoute();
const id = route.path.replace('/blog/', '');
const blogPost = blogPosts.value.find(e => e.id == id);

</script>

<template>

    <div class="article flex justify-center">
        <article class="max-w-[1000px]">
            <header>
                <div class="flex flex-col items-center">
                    <h1 class="text-6xl font-normal">
                        {{ blogPost?.title }}
                    </h1>
                    <p class="mt-6 text-2xl">
                        {{ blogPost?.subtitle }}
                    </p>
                    <div class="flex items-center gap-2">
                        <img class="w-9 h-9 rounded-full" :src="'/blog/' + blogPost?.authorImage" :alt="blogPost?.author">
                        <p class="align-middle mt-4">
                            {{ blogPost?.author }}
                        </p>
                        <span class="text-gray-400"> • {{ blogPost?.created_at }}</span>
                    </div>
                </div>

                <img class="w-full h-full rounded-xl outline outline-[1px] outline-gray-100/20 mt-10 mb-10"
                    :src="'/blog/' + blogPost?.image" :alt="blogPost?.title">
            </header>
            <slot></slot>
        </article>
    </div>
</template>

<style scoped>
.article * {
    font-family: 'Poppins', sans-serif;
}

article {
    margin: 2rem;
}

header,
section,
footer {
    margin-bottom: 2rem;
}

p {
    margin-bottom: 1rem;
}
</style>