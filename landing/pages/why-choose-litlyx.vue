<script lang="ts" setup>

definePageMeta({ layout: 'header' });


const featureStyle = 'font-bold poppins text-lyx-text';
const cellStyle = 'poppins text-lyx-text'
const activeStyle = 'poppins !text-lyx-text border-solid border-[1px] border-green-400 bg-green-400/5'


const columns = [{
    key: 'feature',
    label: 'Feature'
}, {
    key: 'litlyx',
    label: 'Litlyx'
}, {
    key: 'plausible',
    label: 'Plausible'
}, {
    key: 'google',
    label: 'Google Analytics'
}]

const comparisons = ref<any[]>([
    {
        feature: { text: 'Setup Time', class: featureStyle },
        litlyx: { text: '30 seconds', class: activeStyle },
        plausible: { text: 'A few Minutes', class: cellStyle },
        google: { text: 'Hours', class: cellStyle }
    },
    {
        feature: { text: 'Real-Time Collection', class: featureStyle },
        litlyx: { text: 'Instant', class: activeStyle },
        plausible: { text: 'each 5 minutes', class: cellStyle },
        google: { text: 'from few minutes, to hours', class: cellStyle }
    },
    {
        feature: { text: 'Documentation', class: featureStyle },
        litlyx: { text: 'Small, Easy & Modern', class: activeStyle },
        plausible: { text: 'Longer than necessary', class: cellStyle },
        google: { text: 'Mstodon & Complex', class: cellStyle }
    },
    {
        feature: { text: 'Modern UI', class: featureStyle },
        litlyx: { text: 'Yes', class: activeStyle },
        plausible: { text: 'Yes', class: activeStyle },
        google: { text: 'Yes', class: activeStyle }
    },
    {
        feature: { text: 'Developers Centric Approach', class: featureStyle },
        litlyx: { text: 'Yes', class: activeStyle },
        plausible: { text: 'Partially', class: cellStyle },
        google: { text: 'No', class: cellStyle }
    },
    {
        feature: { text: 'Website Loading Time', class: featureStyle },
        litlyx: { text: '3 ms', class: activeStyle },
        plausible: { text: '3 ms', class: activeStyle },
        google: { text: '5-15 ms', class: cellStyle }
    },
    {
        feature: { text: 'Library Size', class: featureStyle },
        litlyx: { text: '3 kb', class: '' },
        plausible: { text: '2 kb', class: activeStyle },
        google: { text: 'avg. 50 kb', class: cellStyle }
    },
    {
        feature: { text: 'Custom Events Support', class: featureStyle },
        litlyx: { text: 'Yes', class: activeStyle },
        plausible: { text: 'Yes', class: activeStyle },
        google: { text: 'Yes', class: activeStyle }
    },
    {
        feature: { text: 'Native Js Runtimes', class: featureStyle },
        litlyx: { text: 'Yes', class: activeStyle },
        plausible: { text: 'No', class: cellStyle },
        google: { text: 'No', class: cellStyle }
    },
    {
        feature: { text: 'Custom Events metadata Support', class: featureStyle },
        litlyx: { text: 'Yes', class: activeStyle },
        plausible: { text: 'No', class: cellStyle },
        google: { text: 'Limited', class: cellStyle }
    },
    {
        feature: { text: 'Raw Data Export', class: featureStyle },
        litlyx: { text: 'Yes', class: activeStyle },
        plausible: { text: 'No', class: cellStyle },
        google: { text: 'No', class: cellStyle }
    },
    {
        feature: { text: 'Data Ownership', class: featureStyle },
        litlyx: { text: 'Yes', class: activeStyle },
        plausible: { text: 'Yes', class: activeStyle },
        google: { text: 'No', class: cellStyle }
    },
    {
        feature: { text: 'Open-Source', class: featureStyle },
        litlyx: { text: 'Self-Hostable', class: activeStyle },
        plausible: { text: 'Self-Hostable', class: activeStyle },
        google: { text: 'No', class: cellStyle }
    },
    {
        feature: { text: 'Privacy-focused', class: featureStyle },
        litlyx: { text: 'Yes', class: activeStyle },
        plausible: { text: 'Yes', class: activeStyle },
        google: { text: 'No', class: cellStyle }
    },
    {
        feature: { text: 'Cookies Stored', class: featureStyle },
        litlyx: { text: '0 Cookies', class: activeStyle },
        plausible: { text: '0 Cookies', class: activeStyle },
        google: { text: 'Yes, many', class: cellStyle }
    },
    {
        feature: { text: 'EU standard', class: featureStyle },
        litlyx: { text: 'Yes', class: activeStyle },
        plausible: { text: 'Yes', class: activeStyle },
        google: { text: 'Limited', class: cellStyle }
    },
    {
        feature: { text: 'Ad Blockers', class: featureStyle },
        litlyx: { text: 'Impossible to block', class: activeStyle },
        plausible: { text: 'Possible, but hard!', class: cellStyle },
        google: { text: 'Possible', class: cellStyle }
    },
    {
        feature: { text: 'AI Data Analyst Assistant', class: featureStyle },
        litlyx: { text: 'Yes', class: activeStyle },
        plausible: { text: 'No', class: cellStyle },
        google: { text: 'No', class: cellStyle }
    },
    {
        feature: { text: 'Report Generation', class: featureStyle },
        litlyx: { text: 'Detailed reports in seconds', class: activeStyle },
        plausible: { text: 'Basic Reports', class: cellStyle },
        google: { text: 'Extensive, but complex to do', class: cellStyle }
    },
    {
        feature: { text: 'User-Friendly interface', class: featureStyle },
        litlyx: { text: 'Yes', class: activeStyle },
        plausible: { text: 'Yes', class: activeStyle },
        google: { text: 'Moderate Complexity', class: cellStyle }
    },
    {
        feature: { text: 'Agglomeration from third parties DB’s', class: featureStyle },
        litlyx: { text: 'Yes', class: activeStyle },
        plausible: { text: 'No', class: cellStyle },
        google: { text: 'No', class: cellStyle }
    },
    {
        feature: { text: 'Free Options (Cloud)', class: featureStyle },
        litlyx: { text: 'Free-Forever plan to start.', class: activeStyle },
        plausible: { text: '30 days free trial.', class: cellStyle },
        google: { text: 'Free forever. No Ownership.', class: activeStyle }
    },
    {
        feature: { text: 'Cost Effective (Cloud)', class: featureStyle },
        litlyx: { text: 'Basic plan: €4,99/mo for 50k visits/events', class: activeStyle },
        plausible: { text: 'Basic plan: €9,00/mo for 10k page visits', class: cellStyle },
        google: { text: 'Offers Enterprise only Premium prices (really expansive)', class: cellStyle }
    }
]);


</script>

<template>
    <div class="px-8 lg:px-40">

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

            <div class="hidden lg:flex lg:justify-center w-full lg:flex-nowrap">
                <UTable :rows="comparisons" :columns="columns" :ui="{
                    td: {
                        base: 'border-x-[1px] border-solid border-lyx-widget-lighter'
                    },
                    th: {
                        base: 'border-[1px] border-solid border-lyx-widget-lighter bg-lyx-widget'
                    }
                }">

                    <template #litlyx-data="{ row }">
                        {{ row.litlyx.text }}
                    </template>
                    <template #feature-data="{ row }">
                        {{ row.feature.text }}
                    </template>
                    <template #plausible-data="{ row }">
                        {{ row.plausible.text }}
                    </template>
                    <template #google-data="{ row }">
                        {{ row.google.text }}
                    </template>
                </UTable>
            </div>

            <div class="lg:hidden text-lyx-text-dark">
                [Table available only on desktop]
            </div>

        </div>


        <div class="section">
            <div class="title">
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
            <div class="title">
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

        <div class="section">

            <div class="title text-center">
                Ready to start with Litlyx?
            </div>

            <div class="button-container flex-col items-center gap-6">
                <LyxUiButton link="https://dashboard.litlyx.com/live_demo" target="_blank" class="button" type="outline">
                    Go to Live Demo
                </LyxUiButton>
                <LyxUiButton link="https://dashboard.litlyx.com" target="_blank" class="button" type="primary">
                    Start for free now
                </LyxUiButton>
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

.button {
    @apply font-medium text-[1rem] px-6 py-2
}

.button-container {
    @apply flex justify-center mt-8
}

</style>