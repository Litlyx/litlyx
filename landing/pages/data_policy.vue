<script lang="ts" setup>


definePageMeta({ layout: 'header' });

</script>


<template>


    <div class="tutto-poppins flex flex-col gap-3 px-2 lg:px-96 mt-20 text-[1.2rem] leading-[2rem]">




        <div class="font-bold text-[2rem]">
            LitLyx Analytics Data Policy
        </div>

        <div class="bg-gray-500/90 h-[1px] w-full my-6"></div>

        <div>
            LitLyx is committed to protecting your privacy and ensuring that our data practices are transparent, secure,
            and compliant with all relevant regulations. This data policy outlines the information we collect, how we
            use it, and the measures we take to protect your data. Our services are hosted on servers provided by
            Hetzner in Nuremberg, Germany, and comply with European data protection laws, including GDPR, CCPA, and
            PECR.
        </div>


        <div class="font-bold mb-1 mt-4"> Data Collection and Usage : </div>
        <div>
            LitLyx is designed to provide insightful analytics without compromising user privacy. We adhere to the
            following principles:
        </div>
        <ul>
            <div class="ml-8"> 1. Non-Personal Data Collection: We do not collect personal data or personally
                identifiable information (PII). Our analytics focus on aggregated data to identify trends without
                tracking individual users.</div>
            <div class="ml-8"> 2 No Cookies or Persistent Identifiers: We do not use cookies, browser storage, or any
                form of persistent identifiers. All data is session-based and anonymized. </div>
        </ul>

        <div class="font-bold mb-1 mt-4"> Specific Data Points Collected </div>
        <div>We collect only the most essential data points, which are:</div>
        <ul>
            <div class="ml-8"> • Page URL: We track the URLs of pages viewed on your website to understand which pages
                are most popular. Query parameters and hash parameters are discarded.
            </div>
            <div class="ml-8"> • HTTP Referrer: This helps us determine the source of your traffic by identifying the
                referring website. </div>
            <div class="ml-8"> • Browser: We track the browser type and version (derived from the User-Agent header) to
                understand the technology used by visitors. The full User-Agent string is discarded.
            </div>
            <div class="ml-8"> • Operating System: We identify the operating system and its version (derived from the
                User-Agent header) to see what systems visitors use. The full User-Agent string is discarded.</div>
            <div class="ml-8"> • Device Type: We categorize devices into desktop, mobile, or tablet based on the
                User-Agent header. </div>
            <div class="ml-8"> • Geographical Location: We determine the visitor's country, region, and city using their
                IP address. We do not track anything more granular than the city level, and IP addresses are not stored.
            </div>
        </ul>

        <div class="font-bold mb-1 mt-4"> Unique User Counting Without Cookies </div>

        <div>
            Counting unique visitors is crucial for analytics, but we prioritize visitor privacy. We do not generate
            persistent identifiers. Instead, we use a combination of the visitor's IP address and User-Agent to create a
            unique identifier for each day.
        </div>
        <div>

            Formula for Unique User Identification -
            Every HTTP request includes the IP address and User-Agent. To generate a unique identifier while maintaining
            anonymity, we apply the following process:
        </div>

        <div class="bg-menu font-normal px-8 py-4 text-[1.1rem]" style="font-family:Consolas">
            hash(daily_salt + strip(website_domain) + strip(ip_address) + user_agent)
        </div>

        <ul>
            <div class="ml-8"> • Daily Salt: A randomly generated value that changes daily.</div>
            <div class="ml-8"> • Website Domain: The domain of the website being visited.</div>
            <div class="ml-8"> • IP Address and User-Agent: Used to create a unique but anonymized identifier.</div>
            <div class="ml-8"> • Strip function: Used to transform string in only [A-z0-9]</div>
        </ul>

        <div>This identifier is used to count unique visitors for a single day. The raw IP addresses and User-Agent
            strings are never stored. Daily salts are deleted every 24 hours to prevent linking visitor data across
            days.
        </div>


        <div class="font-bold mb-1 mt-4"> Custom Events and Custom Events Metadata </div>
        <div>
            At LitLyx, we understand the importance of flexibility and customization in web analytics. To cater to
            specific needs, we allow the tracking of custom events and the storage of custom events metadata. This
            section outlines how we manage these custom events while ensuring privacy and compliance with relevant
            regulations.
        </div>

        <div class="font-bold mb-1 mt-4"> Tracking Custom Events </div>
        <div>
            Custom events allow you to track specific interactions on your website beyond standard page views. These
            interactions might include button clicks, form submissions, or other user actions that are important for
            understanding user behavior on your site.
        </div>


        <div class="font-bold mb-1 mt-4"> Data Points for Custom Events </div>

        <ul>
            <div class="ml-8"> • Event Name: A descriptive name for the event (e.g., "Button Click", "Form Submission").
            </div>
            <div class="ml-8"> • Event Metadata: Additional metadata associated with the event (e.g., button ID,
                form ID).</div>
        </ul>


        <!-- <div class="font-bold mb-1 mt-4"> Storing Custom Events Metadata </div>
        <div>
            In addition to tracking custom events, we provide the capability to store metadata related to these events.
            This metadata can include any additional information you deem relevant, such as user attributes or
            contextual details about the event.
        </div>

        <div>
            Formula for Storing Custom Events Metadata -
            To ensure the privacy and security of custom events metadata, we use a hashing mechanism. The metadata is
            combined with the project ID and hashed before being stored in our database. This process ensures that the
            metadata is anonymized and cannot be linked back to individual users.
        </div>

        <div>
            Hashing Formula for Custom Events Metadata -
            We use the following formula to hash the custom events metadata:
        </div>

        <div>
            “Hash(text{project_id} + text{metadata as string})”
        </div>


        <ul>
            <div class="ml-8">
                • Project ID: The unique identifier for your project.
            </div>
            <div class="ml-8">
                • Metadata as String: The string representation of the custom events metadata.
            </div>
        </ul>
 -->


        <div class="font-bold mb-1 mt-4"> Data Hosting and Security </div>
        <ul>
            <div class="ml-8">
                • Hosting: All data is hosted on Hetzner servers in Nuremberg, Germany. These servers are powered by
                100% renewable energy and comply with EU data protection laws.
            </div>
            <div class="ml-8">
                • Security Measures: We use HTTPS for data transmission and employ hashing processes for data at rest.
                Regular backups are performed and stored within the EU in redundant locations.
            </div>
            <div class="ml-8">
                • No Third-Party Access: Apart from Hetzner, no third-party vendors have access to the data. This ensures
                all data remains within the EU and is protected by strict European privacy laws.
            </div>
        </ul>




        <div class="font-bold mb-1 mt-4"> Tracking Custom Events </div>
        <div>
            Custom events allow you to track specific interactions on your website beyond standard page views. These
            interactions might include button clicks, form submissions, or other user actions that are important for
            understanding user behavior on your site.
        </div>




        <div class="font-bold mb-1 mt-4"> Data Ownership </div>
        <div>
            LitLyx respects that you own your website data. We do not sell, share, or monetize your data. You retain
            full control over your data, with the ability to delete your account or data at any time. Upon deletion, all
            data is permanently removed from our servers and cannot be recovered.
        </div>


        <div class="font-bold mb-1 mt-4"> Trust and Transparency </div>
        <div>
            LitLyx is built on principles of transparency and openness. While our analytics tools are proprietary, we
            adhere strictly to our privacy commitments. Our policies and processes are open for review to ensure we meet
            our stated objectives.
        </div>


        <div class="font-bold mb-1 mt-4"> Compliance with GDPR, CCPA, and PECR </div>
        <div>
            Using LitLyx ensures compliance with GDPR, CCPA, and PECR regulations. Our data practices eliminate the need
            for complex privacy policies or intrusive cookie prompts. Visitors to your website can enjoy a seamless and
            privacy-respecting experience.
        </div>


        <div class="font-bold mb-1 mt-4"> Liability </div>
        <ul>
            <div class="ml-8">

            </div>
        </ul>

        <div> Contact Information </div>
        <div>
            For any questions or concerns about our data policy, please contact our data protection officer at
            <a class="text-blue-400" href="mailto:helplitlyx@gmail.com">helplitlyx@gmail.com</a>
        </div>
    </div>

</template>


<style scoped lang=scss>
.tutto-poppins * {
    font-family: "Poppins";
}
</style>