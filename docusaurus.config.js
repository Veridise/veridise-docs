// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Veridise Saas Documentation",
  tagline: "Learn how to use Veridise tools",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://your-docusaurus-test-site.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          exclude: ["orca/*", "vanguard/*"],
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
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "saas",
        path: "saas",
        routeBasePath: "saas",
        sidebarPath: require.resolve("./sidebars.js"),
        lastVersion: "current",
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "zkvanguard",
        path: "zkvanguard",
        routeBasePath: "zkvanguard",
        sidebarPath: require.resolve("./sidebars.js"),
        lastVersion: "current",
        sidebarCollapsed: false,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "picus",
        path: "picus",
        routeBasePath: "picus",
        sidebarPath: require.resolve("./sidebars.js"),
        lastVersion: "current",
      },
    ],
    [
      require.resolve("docusaurus-lunr-search"),
      {
        // Do not index pages with routes like /orca/internal/dev-guide etc.
        excludeRoutes: ["**/internal/*", "orca/*", "vanguard/*"],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      // Replace with your project's social card
      // image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: "Veridise SaaS Documentation",
        logo: {
          alt: "Veridise Logo",
          src: "img/veridise-logo-square-light.png",
          srcDark: "img/veridise-logo-square-dark.png",
        },
        items: [
          {
            type: "docsVersion",
            docsPluginId: "saas",
            position: "left",
            label: "SaaS",
          },
          {
            // TODO: replace with dropdown when versions are available.
            type: "docsVersion",
            docsPluginId: "zkvanguard",
            position: "left",
            label: "ZK Vanguard",
          },
          {
            // TODO: replace with dropdown when versions are available.
            type: "docsVersion",
            docsPluginId: "picus",
            position: "left",
            label: "Picus",
          },
          // {to: '/blog', label: 'Blog', position: 'left'},
          {
            type: "docsVersionDropdown",
            docsPluginId: "orca",
            position: "right",
          },
          {
            type: "docsVersionDropdown",
            docsPluginId: "vanguard",
            position: "right",
          },
          {
            type: "docsVersionDropdown",
            docsPluginId: "zkvanguard",
            position: "right",
          },
          {
            type: "docsVersionDropdown",
            docsPluginId: "picus",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Tutorial",
                to: "/docs/intro",
              },
            ],
          },
          {
            title: "Community",
            items: [
              // {
              //   label: 'Discord',
              //   href: 'https://discordapp.com/invite/yoururlhere',
              // },
              {
                label: "Twitter",
                href: "https://twitter.com/VeridiseInc",
              },
            ],
          },
          {
            title: "More",
            items: [
              /*
              {
                label: 'Blog',
                to: '/blog',
              },
              */
              {
                label: "Homepage",
                href: "https://veridise.com/",
              },
              {
                label: "Blog",
                href: "https://veridise.medium.com/",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Veridise, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["solidity"],
      },
    }),
};

module.exports = config;

// vim: set expandtab shiftwidth=2 softtabstop=2 :
