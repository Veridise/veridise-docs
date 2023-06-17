// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Veridise Docs',
  tagline: 'Learn how to use Veridise tools',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-test-site.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Veridise', // Usually your GitHub org/user name.
  projectName: '', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        /*
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        */
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'saas',
        path: 'saas',
        routeBasePath: 'saas',
        sidebarPath: require.resolve('./sidebars.js'),
        lastVersion: 'current',
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'vanguard',
        path: 'vanguard',
        routeBasePath: 'vanguard',
        sidebarPath: require.resolve('./sidebars.js'),
        lastVersion: 'current',
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'orca',
        path: 'orca',
        routeBasePath: 'orca',
        sidebarPath: require.resolve('./sidebars.js'),
        lastVersion: 'current',
      }
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      // image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Veridise Documentation',
        logo: {
          alt: 'Veridise Logo',
          src: 'img/veridise-logo-round-blue.svg',
        },
        items: [
          {
            type: 'docsVersion',
            sidebarId: 'saasSidebar',
            docsPluginId: 'saas',
            position: 'left',
            label: 'SaaS',
          },
          {
            // TODO: replace with dropdown when versions are available.
            type: 'docsVersion',
            //sidebarId: 'orcaSidebar',
            docsPluginId: 'orca',
            position: 'left',
            label: 'OrCa',
          },
          {
            // TODO: replace with dropdown when versions are available.
            type: 'docsVersion',
            //sidebarId: 'vanguardSidebar',
            docsPluginId: 'vanguard',
            position: 'left',
            label: 'Vanguard',
          },
          // {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/Veridise',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              // {
              //   label: 'Discord',
              //   href: 'https://discordapp.com/invite/yoururlhere',
              // },
              {
                label: 'Twitter',
                href: 'https://twitter.com/VeridiseInc',
              },
            ],
          },
          {
            title: 'More',
            items: [
              /*
              {
                label: 'Blog',
                to: '/blog',
              },
              */
              {
                label: 'Homepage',
                href: 'https://veridise.com/',
              },
              {
                label: 'Blog',
                href: 'https://veridise.medium.com/',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Veridise',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Veridise, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;

// vim: set expandtab shiftwidth=2 softtabstop=2 :
