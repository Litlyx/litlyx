<script lang="ts" setup>

definePageMeta({ layout: 'header' });


import { blogPosts, homePosts } from '~/blog/Blog';


</script>

<template>
    <div class="blog-home h-full flex justify-center overflow-y-auto">

        <div class="flex flex-col gap-6 px-6 py-6 max-w-[1200px]">

            <div>
                <h1> Blog </h1>
            </div>

            <div class="home-posts flex gap-10 justify-center">
                <NuxtLink tag="article" :to="post.id" v-for="post of homePosts" class="flex flex-col gap-2">
                    <img class="w-full h-full rounded-xl outline outline-[1px] outline-gray-100/20"
                        :src="'/blog/' + post.image" :alt="post.title">
                    <h4 class="font-normal mt-2"> {{ post.title }} </h4>
                    <div class="flex gap-3 items-center text-[1rem]">
                        <img class="w-9 h-9 rounded-full" :src="'/blog/' + post.authorImage" :alt="post.author">
                        <div class="font-normal"> {{ post.author }} </div>
                        <div class="text-gray-400"> • {{ post.created_at }} </div>
                    </div>
                </NuxtLink>
            </div>

            <h5 class="mt-12"> Latest posts </h5>

            <div class="grid grid-cols-3 gap-2">
                <NuxtLink tag="article" :to="post.id" v-for="post of blogPosts" class="flex flex-col gap-2">
                    <img class="rounded-xl outline outline-[1px] outline-gray-100/20" :src="'/blog/' + post.image"
                        :alt="post.title">
                    <h5 class="font-normal mt-2"> {{ post.title }} </h5>
                    <div class="flex gap-3 items-center text-[.9rem]">
                        <img class="w-8 h-8 rounded-full" :src="'/blog/' + post.authorImage" :alt="post.author">
                        <div class="font-normal"> {{ post.author }} </div>
                        <div class="text-gray-400"> • {{ post.created_at }} </div>
                    </div>
                </NuxtLink>
            </div>

            <div class="pb-20"></div>

        </div>
    </div>
</template>


<style scoped lang="scss">
h1 {
    font-size: 3rem;
}

h4 {
    font-size: 1.75rem;
}

h5 {
    font-size: 1.5rem;
}

h6 {
    font-size: 1.25rem;
}


.blog-home * {
    font-family: "Poppins"
}
</style>