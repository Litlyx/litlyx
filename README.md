
<p align="center">
  <img src="assets/claim.png"/>
</p>

<h4 align="center">
📚 <a href="https://docs.litlyx.com">Docs</a> 👾 <a href="https://discord.gg/9cQykjsmWX">Join Discord</a> 🌐 <a href="https://litlyx.com">Website</a>  🔥 <a href="https://dashboard.litlyx.com">Try Litlyx Cloud. It's Free forever.</a> 
</h4>

#
<p align="center">
  Litlyx is a modern, developer-friendly, cookie-free analytics tool.<br>
  Setup takes less than 30 seconds! Completely self-hostable with docker.<br>
  Alternative to Google Analytics, Matomo, Umami, Plausible & Simple Analytics.
</p>

#

<br />

<p align="center">
  <img src="assets/dashboard-clip.png"/>
</p>

#

## Get Started on our Cloud Version

Sign-up on [Litlyx.com](https://dashboard.litlyx.com) and create a project. Then simply use your `project_id` to connect Litlyx to your website.

## Universal Installation

```html
<script defer data-project="your_project_id" src="https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js"></script>
```

Importing Litlyx with a direct script instantly starts tracking `Visits`, `Top Pages`, `Bouncing Rate`,  `Real-Time Online Users`, `Unique Visitors`, `Countries`, and `Average Session Duration`.

# All Javascript Runtimes

You can install Litlyx using `npm`, `pnpm` or any modern package managers:

```sh
npm i litlyx-js
```

Litlyx natively works with all JavaScript / TypeScript frameworks. You can use Litlyx in all WordPress Websites by injecting JS code using a third party plug-in. 

<p align="center">
  <img src="assets/tech.png" />
</p>

# Import using a package manager

First, Import litlyx-js library into your code:

```js
import { Lit } from 'litlyx-js';
```

Once imported, you need to initialize Litlyx:

```js
Lit.init('your_project_id');
```

After initialization, Litlyx will automatically track web analytics such as `Page visits`, `Real-Time Online Users`, `Unique Vistors`, and many more.

# Track Custom Events (Actions)

You aren't just limited to the built-in KPIs. With Litlyx, you can create your own events to track in your project.

```js
Lit.event('click_on_buy_item');
```

If you want more specific tracking, you can use the `metadata` field, like this:

```js
Lit.event('click_on_buy_item', {
  metadata: {
    'product-name': 'Coca-Cola',
    'price': 1.50,
    'currency': 'EUR'
  }
});
```

Litlyx makes it easy for you to tailor your analytics to your project's needs.


# Fire Your First Event with cURL

Want to quickly see how Litlyx works with events? Use the cURL command below to send a test event. Just replace the `project_id` with your actual project ID in your terminal.

```bash
curl -X POST "https://broker.litlyx.com/event" \
  -H "Content-Type: application/json" \
  -d '{
    "pid": "project_id",
    "name": "testEvent1",
    "metadata": "{\"test\": \"something\"}",
    "website": "something",
    "userAgent": "something"
  }'
```

# Self-hosting with docker

To self-host the Litlyx dashboard, first **clone** this repository. (Litlyx's Docker images are hosted on DockerHub). 

Then run the following command:
```bash
docker-compose up
```

at localhost:3000 you will see your own instance of the Litlyx Dashboard.

## Forward data to your self-hosted instance with script tag

To forward your data on your self-hosted instance, you need to set up the following variables: `data-host`, `data-port`,  `data-secure`(`true` if it is HTTPS or `false` if it is HTTP).

```html
<script defer data-project="your_project_id" 
        data-host="your-host-name" 
        data-port="your-port" 
        data-secure="true/false"
        src="https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js">
</script>
```

# Read our docs

For more info on how to use litlyx read our [documentation](https://docs.litlyx.com). 


# Stay updated with our roadmap

To keep track on what we are cooking behind the scene we have a public [Roadmap](https://litlyx.com/roadmap) for you to check. 


# Join discord

If you need more information, want to interact with us or the community, need help, or have feedback to share, feel free to join us on Litlyx's [Discord](https://discord.gg/9cQykjsmWX) channel.

# Contribution

If you want to contribute to Litlyx's development, reach out to us on [Discord](https://discord.gg/9cQykjsmWX) in our `#contribution` channel.

### Thank you!
<a href="https://github.com/litlyx/litlyx/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=litlyx/litlyx" />
</a>

# License

Litlyx is licensed under the [Apache 2.0](/LICENSE) license.
