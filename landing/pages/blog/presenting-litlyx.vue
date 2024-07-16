<script lang="ts" setup>

definePageMeta({ layout: 'header' });

import { blogPosts } from '~/blog/Blog';

definePageMeta({ layout: 'header' });
const route = useRoute();
const id = route.path.replace('/blog/', '');
const blogPost = blogPosts.value.find(e => e.id == id);

useSeoMeta({
    title: () => `Litlyx Blog - ${blogPost?.title}`,
    ogTitle: () => `Litlyx Blog - ${blogPost?.title}`,
    description: () => blogPost?.subtitle,
    ogDescription: () => blogPost?.subtitle,
    keywords: 'Litlyx blog, analytics insights, real-time analytics, AI-powered analytics, data visualization, performance metrics, KPI tracking, custom events, open-source analytics, business intelligence, data trends, developer insights, analytics updates, data-driven decisions, blog updates, tech news, Litlyx updates, analytics best practices',
    author: () => blogPost?.author,
    ogImage: () => 'https://litlyx.com/blog/posts/' + blogPost?.image,
    ogType: 'website',
    ogUrl: 'https://litlyx.com/blog',
    twitterCard: 'summary_large_image',
    twitterTitle: () => `Litlyx Blog - ${blogPost?.title}`,
    twitterDescription: () => blogPost?.subtitle,
    twitterImage: () => 'https://litlyx.com/blog/posts/' + blogPost?.image,
    ogSiteName: 'Litlyx',
    ogLocale: 'en_US',
    ogImageWidth: '1200',
    ogImageHeight: '630'
})

</script>

<template>
    <BlogArticleWrapper>
        <div>
            <section>
                <h2 class="text-3xl font-semibold">Why?</h2>
                <p>When I was a CTO at one of my previous startups, I faced significant challenges in tracking and
                    analyzing
                    metrics effectively. Our team needed <strong>real-time analytics</strong>, yet existing solutions
                    were
                    often outdated, expensive, and complicated to set up.</p>
                <p>I needed speed. Speed like a Ferrari.</p>
                <p>We started working closely with a growth hacking team at that time. With pressure from the CEO and
                    the
                    growth team, I had to manage a team of five developers, organize feature implementations, and set up
                    analytics.</p>
                <p>It was rough.</p>
                <p>I struggled to get actionable data without a complex setup, and the lack of a <strong>lightweight,
                        customizable analytics tool</strong> that was fast to implement.</p>
                <p>It was a real problem.</p>
                <p>Frustrated with the limitations of current analytics solutions, I opted for MixPanel for tracking
                    custom
                    events, Google Analytics for tracking visits & superficial metrics, and Clarity for tracking user
                    behaviors. But… MixPanel required intricate setups for detailed event tracking, Google Analytics
                    provided robust data on page visits but was hard to configure, and Clarity offered insights into
                    user
                    behavior but lacked real-time capabilities. There wasn’t a tool that did it all in one solution nor
                    was
                    created for each tech-stack out there.</p>
                <p>For this level of complexity in metrics, <strong>developers MUST be involved</strong>. period.</p>
            </section>
            <section>
                <h2 class="text-3xl font-semibold">Why Dev-Centric</h2>
                <p>We're building <strong>Litlyx</strong>, an <strong>open-source, lightweight analytics
                        platform</strong>
                    designed for simplicity to empower each developer to track analytics within seconds.</p>
                <p>Our mission was to achieve a <strong>30-seconds setup</strong> in all tech stacks.</p>
                <p><strong>Spoiler Alert: we did!</strong></p>
                <p>We needed to create a tool that not only tracks your KPIs but also offers <strong>high
                        customization</strong>, an <strong>AI data-analyst assistant</strong>, and <strong>comprehensive
                        analytics report generation</strong>.</p>
                <p>Everything about analytics with Litlyx should be Exceptionally Easy and Fast.</p>
                <p>Devs should be focusing on actual Feature implementations and not wasting-time on reading complex
                    documentations.</p>
            </section>
            <section>
                <h2 class="text-3xl font-semibold">Why now, in 2024?</h2>
                <p>The current landscape of <strong>analytics tools</strong> is outdated and fragmented. Most solutions
                    were
                    developed over a decade ago, primarily focusing on large enterprises and emphasizing sales-led
                    growth or
                    marketing.</p>
                <p>These tools often ignore the needs of developers and smaller teams. But they are essential.</p>
                <p>No one is prioritizing a <strong>developer-first analytics experience</strong> or innovating in the
                    analytics space.</p>
                <p>The time has come to rethink analytics for 2024 and beyond. We need a tool that aligns with modern
                    app
                    development standards and provides a seamless, intuitive, and most importantly, <strong>dev-centric
                        experience</strong>.</p>
            </section>
            <section>
                <h2 class="text-3xl font-semibold">How the future looks</h2>
                <p><strong>Litlyx</strong> aims to be the No.1 tool for analytics tracking that comes to mind for
                    developers, known for efficiency, simplicity, and cost-effectiveness.</p>
                <p>We want to be the <strong>go-to solution for collecting analytics</strong>, reducing fragmentation,
                    enhancing aggregation, and acting as a connector for databases and analytics tools that people
                    already
                    use. Our goal is to be the only place people need for everything related to analytics.</p>
                <p>We are committed to being dev-centric always.</p>
            </section>
            <section>
                <h2 class="text-3xl font-semibold">Join us</h2>
                <p>The Litlyx Team have taken the responsibility to create the simplest yet most effective way to track
                    analytics.</p>
                <p>We're building something that developers can really love.</p>
                <p>We're building it <a href="https://github.com/Litlyx/litlyx"><strong>Open-Source</strong></a>,
                    because we
                    trust transparency and we know how much difficult it is to gain control on where your data goes.</p>
                <p>Probably we will make some mistakes in the process, but we are humans. We are devs!</p>
                <p>Join our journey and be among the pioneer developers to experience analytics tracking with
                    <strong>Litlyx</strong>.
                </p>
            </section>
        </div>
    </BlogArticleWrapper>
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