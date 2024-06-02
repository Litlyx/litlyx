import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Litlyx',
  tagline: '',
  favicon: 'img/logo.png',
  url: 'https://litlyx.com',
  baseUrl: '/',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/', // Set this to '/' to make the docs page the main page
          sidebarPath: './sidebars.ts',
        },
        blog: false, // Disable the blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark', // Set default mode to dark
      disableSwitch: true, // Disable the switch so users cannot change the mode
      respectPrefersColorScheme: false, // Ensure it does not respect the user's system preference
    },
    navbar: {
      logo: {
        alt: 'Logo',
        src: 'img/logo.png',
        href: '/', // Ensure it points to the main docs page
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'DocsSideBar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/botkalista/litlyx-javascript-lib',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} LitLyx, All rights reserved. Made with ❤️ in Italy.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
