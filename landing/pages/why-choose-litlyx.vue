<script lang="ts" setup>

definePageMeta({ layout: 'header' });

</script>

<template>
    <div class="px-8">

        <div class="section">
            <div class="title">
                Why Choose Litlyx
            </div>

            <div class="paragraph">
                Our product is simple and focuses on the developer's experience. Developers love free stuff, so Litlyx
                offers a generous Free-Forever plan to get started. Developers don't want to waste time setting up
                complex analytics to track key metrics for their websites. So, we asked ourselves, 'What would
                developers find easy and cool?' As a team of developers, we created the simplest, most optimized, and
                developer-friendly way to do analytics.
            </div>
        </div>

        <div class="section">
            <div class="title">
                Litlyx vs Plausible vs Google Analytics Comparison Table
            </div>

            <div class="paragraph">
                Comparisons between the most common softwares used for web analytics collection and Litlyx.
            </div>
        </div>


        <div class="section">

            <div class="hidden lg:grid grid-cols-[20%_20%_30%_30%]">
                <div> Feature </div>
                <div> Litlyx </div>
                <div> Plausible </div>
                <div> Google Analytics </div>
                <div> A </div>
                <div> B </div>
                <div> C </div>
                <div> D </div>
            </div>

            <div class="lg:hidden text-lyx-text-dark">
                [Table available only on desktop]
            </div>

        </div>


        <div class="section">
            <div class="subtitle">
                Google Analytics vs. Litlyx
            </div>
            <ul class="list-disc text-lyx-text-dark mt-4">
                <li>
                    Ease of Use: Google Analytics can be complex, with many features that may be overwhelming when
                    reading its documentation. Litlyx is simple and easy to use.
                </li>
                <li>
                    Setup: Google Analytics requires more time to set up, whereas Litlyx is quick and easy to set up
                    (just 30 seconds).
                </li>
                <li>
                    Free Plan: Google Analytics offers a free plan, but you do not own your data. Litlyx offers a
                    Free-Forever plan with generous limits, and you can handle raw data.
                </li>
                <li>
                    Developer Focus: Google Analytics is for general users, with libraries written by third parties.
                    Litlyx is built with developers in mind, supporting all tech stacks natively.
                </li>
            </ul>
        </div>


        <div class="section">
            <div class="subtitle">
                Plausible vs. Litlyx <span class="text-[.9rem]">(we ❤️ Plausible)</span>
            </div>
            <ul class="list-disc text-lyx-text-dark mt-4">
                <li>
                    Ease of Use: Plausible is simple and user-friendly. Litlyx is also simple and easy to use. Both
                    Plausible and Litlyx are awesome!
                </li>
                <li>
                    Setup: Plausible setup is quick and easy. Litlyx setup is equally quick and straightforward.
                </li>
                <li>
                    Free Plan: Plausible does not offer a free plan, giving you a 30-day free trial before you need to
                    pay. Litlyx offers a generous Free-Forever plan.
                </li>
                <li>

                    Developer Focus: Plausible is designed for general users with a focus on privacy, whereas Litlyx is
                    specifically designed for developers.
                </li>
            </ul>
        </div>


        <div class="section">
            <div class="title">
                Who can use Litlyx?
            </div>
            <div class="paragraph">
                We built Litlyx with developers in mind. If you want really good metrics, you should go through your
                development team. We created the simplest setup a developer can ask for, supporting all JavaScript and
                TypeScript runtimes. Litlyx can be used even by startup founders or business owners who have access to
                their landing page. We offer extensive support to guide you through the implementation. You can contact
                us anytime for information at help@litlyx.com. With Litlyx, you will not be alone.
            </div>
        </div>

        <div class="section">
            <div class="title">
                We are far from perfection...
            </div>
            <div class="paragraph">
                We are far from perfect. We are human, and we embrace that. Our imperfections drive us to always improve
                and innovate. We learn from our mistakes and use those lessons to create better solutions. By
                acknowledging our humanity, we connect more deeply with our users, understanding their needs and
                challenges. Our commitment to growth and improvement ensures that we constantly strive to deliver the
                best possible experience for developers.
            </div>
        </div>

        
        <div class="section">
            <div class="title">
                Is Impossible to Beat a giant, but...
            </div>
            <div class="paragraph">
                We know we can’t compete with Google directly—it’s like trying to challenge a giant. But even giants
                have weaknesses. Startups with bold ideas can find ways to disrupt the status quo and we see this many
                times in history. We’re here to support all innovators by providing a first-class developer experience
                with our product. Our goal is to empower every size companies to make a significant impact in the
                industry taking matrics driven decisions with semplicity.
            </div>
        </div>
        
        <div class="section">
            <div class="title">
                Help us improve!
            </div>
            <div class="paragraph">
                If you choose us today, you can help us improve and become first-class in analytics. We can’t do this
                alone; we need you! Your feedback and suggestions are very valuable to us. By working together, we can
                refine our product and create an exceptional experience for developers. Join us on this journey, and
                let's build something amazing together. Your input will help us reach new heights and set the standard
                of excellence next-generation developers deserve.
            </div>
        </div>


    </div>
</template>


<style scoped lang="scss">
.title {
    font-family: 'Poppins' !important;
    @apply font-semibold text-[1.8rem]
}

.subtitle {
    font-family: 'Poppins' !important;
    @apply font-medium text-[1.4rem]
}

.paragraph {
    font-family: 'Poppins' !important;
    @apply text-lyx-text-dark mt-4 text-[1.1rem]
}

.section {
    @apply mt-20
}
</style>