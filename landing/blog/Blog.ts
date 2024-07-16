export type BlogPost = {
    author: string,
    authorImage: string,
    created_at: string,
    image: string,
    title: string,
    subtitle: string,
    id: string
}

export const homePostsIndexes = ref<number[]>([
    0
])

export const blogPosts = ref<BlogPost[]>([
    {
        author: 'Antonio, CEO at Litlyx',
        authorImage: 'AntonioVerdiglione.jpg',
        image: 'posts/presenting-litlyx.jpg',
        created_at: "Jul 16, 2024",
        title: 'Presenting Litlyx',
        subtitle: 'Our Why. Our Vision. Our Manifestation of Intent',
        id: 'presenting-litlyx'
    }
]);

export const homePosts = computed(() => {
    return blogPosts.value.filter((e, i) => homePostsIndexes.value.includes(i));
})