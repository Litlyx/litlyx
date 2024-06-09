---
sidebar_position: 1
---

# Ehy 👋 Welcome to LitLyx

This docs aim to be concise and simple to follow in order to setup quickly and easy Litlyx in your project. **Is just 1 minute read-time. ⏱️** Let's dive in!

## What is LitLyx?

LitLyx brings real-time analytics and custom events to any JS/TS project with just a single line of code. Enhance your projects with +10 KPIs effortlessly. Enjoy AI-powered dashboards for intuitive data insights, automatic reports sent straight to your email, and seamless CSV file downloads to work on your data.


## Integrating LitLyx

Integrating LitLyx is simple. Follow this simple code to add Litlyx to your project quickly:

## Quick Integration Guide

---

### Universal Insertion
Place this line in your project (recommended below the body tag in index.html):


```html
<script defer data-project="project_id_here" src="https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js"></script>
```

This script collects various data from your websites, including `page visits`, `referrers`, `page routes`, `operating systems (OS)`, `browsers`, `countries`, `unique users`, `average session times`, and `real-time user access`. All data is gathered and displayed in real-time in your Litlyx dashboard.

---

### Framework-Specific Steps (e.g., Nuxt.js, Next.js, Vue, Angular, React)

1. **Sign in**: Visit 👉 [sign in page](https://dashboard.litlyx.com).
2. **Create Your First Project**: Simply enter a name for your project to get started.
3. **Copy your project_id**: Copy the project id from the dashboard.
4. **Setup LitLyx**:  Use the following commands to install and initialize LitLyx 👇

```bash
npm i litlyx
```

```ts
//import
import { Lit } from 'litlyx-js';
```

```ts
//initialize & auto-collect page visits and many more insights
Lit.init('project_id');
```

---


## Why Choose LitLyx?

Litlyx have transparency at his core. We are `Open-Source`, so you can inspect our code, in his entirety and see what happen behind the scene.

### Our clients love it for this stuffs👇

- **Fast**: Setup in less than a minute.
- **Real-Time**: Real-time feedback on user interactions & website performance.
- **Lightweight**: less than 4 KB lib size.
- **User-Friendly**: Designed with simplicity in mind.

### Enhance your website or app with LitLyx today! 🔥
