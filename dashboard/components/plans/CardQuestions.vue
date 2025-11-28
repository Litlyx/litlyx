<script lang="ts" setup>

const questions = [
        {
        title: 'Is the plan at account level?',
        description: 'Yes! Your plan applies at the account level, covering all workspaces and the domains within them.'
    },
    {
        title:'What plan is active during my free trial?',
        description:"During your free trial, you're on the Mini Plan. No credit card required, and full access to its features. It's the perfect way to explore what Litlyx offer."
    },
    {
        title: 'What is a workspace?',
        description: 'A workspace is a container for all the domains you want to track. It helps you stay organized and manage member access with ease.'
    },
    {
        title: 'Do you handle proration?',
        description: 'Yes! If you’re on a Mini annual plan and decide to upgrade, we’ll automatically deduct the unused portion of your current plan. The price difference is clearly shown at checkout, so no surprises.'
    },
    {
        title: 'What if I have a Premium plan and want to cancel my subscription?',
        description: 'You can manage your subscription anytime from Account Settings > Billing. After canceling, your plan will remain active until the end of your current billing period. Need help? Reach out to us at help@litlyx.com… we’re here for you.'
    },
    {
        title: 'I accidentally upgraded my plan. Can I get a refund?',
        description: 'Please check our Terms of Service for refund eligibility. If you need assistance, just email us at help@litlyx.com… our support team is happy to help. We truly care about your experience.'
    },
    {
        title: 'Do pageviews include custom events in the count?',
        description: 'Yes! Both pageviews and custom events count equally toward your account limit.'
    },
    {
        title: 'Have another question or want to share feedback?',
        description: 'We’d love to hear from you! You can send feedback directly from the dashboard via the Feedback section. Or simply write to us at help@litlyx.com… we read every message and will get back to you as quickly as possible.'
    },
]
</script>

<template>
    <PageHeader title="Frequently asked questions"
        description="Our FAQ page covers popular topics like pricing, setup, account management, and support." />
    <Separator />

    <Accordion type="single" collapsible class="border rounded-xl px-4 py-1 bg-white dark:bg-black poppins">
        <AccordionItem v-for="(q, index) of questions" :value="`item-${index}`" class="p-1">
            <AccordionTrigger class="normal-case font-semibold">{{ q.title }}</AccordionTrigger>
            <AccordionContent class="text-muted-foreground">
                {{ q.description }}
            </AccordionContent>
        </AccordionItem>
    </Accordion>

</template>