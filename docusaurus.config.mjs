// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import {
  github as lightCodeTheme,
  dracula as darkCodeTheme,
} from "prism-react-renderer";
import math from "remark-math";
import katex from "rehype-katex";
import dashes from "./src/remark/dashes.mjs";

const sidebarPath = "./sidebars.js";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "AuditHub Documentation",
  tagline: "Learn how to use Veridise tools",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://docs.veridise.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw",
      onBrokenMarkdownImages: "throw",
    },
  },

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // https://docusaurus-archive-october-2023.netlify.app/docs/2.3.1/markdown-features/math-equations
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath,
          exclude: [],
          remarkPlugins: [math, dashes],
          rehypePlugins: [katex],
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
        sidebarPath,
        lastVersion: "current",
        exclude: ["**/guide/other.md", "**/guide/usage.md", "**/reference/**"],
        remarkPlugins: [dashes],
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "orca",
        path: "orca",
        routeBasePath: "orca",
        sidebarPath,
        lastVersion: "current",
        exclude: ["**/internal/**"],
        remarkPlugins: [dashes],
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "vanguard",
        path: "vanguard",
        routeBasePath: "vanguard",
        sidebarPath,
        lastVersion: "current",
        sidebarCollapsed: false,
        remarkPlugins: [dashes],
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "zkvanguard",
        path: "zkvanguard",
        routeBasePath: "zkvanguard",
        sidebarPath,
        lastVersion: "current",
        sidebarCollapsed: false,
        remarkPlugins: [math, dashes],
        rehypePlugins: [katex],
        // TODO: Re-enable after DSS.
        exclude: [
          "detectors/private-input-leakage.md",
        ]
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "zkvanguard-legacy",
        path: "zkvanguard-legacy",
        routeBasePath: "zkvanguard-legacy",
        sidebarPath: require.resolve("./sidebars.js"),
        lastVersion: "current",
        sidebarCollapsed: false,
        remarkPlugins: [math, dashes],
        rehypePlugins: [katex],
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "picus",
        path: "picus",
        routeBasePath: "picus",
        sidebarPath,
        lastVersion: "current",
        remarkPlugins: [dashes],
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "picus-v2",
        path: "picus-v2",
        routeBasePath: "picus-v2",
        sidebarPath,
        lastVersion: "current",
        remarkPlugins: [math, dashes],
        rehypePlugins: [katex],
      },
    ],
    [
      "docusaurus-lunr-search",
      {
        // Do not index pages with routes like /orca/internal/dev-guide etc.
        excludeRoutes: ["**/internal/*"],
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
        title: "Veridise AuditHub Documentation",
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
            label: "AuditHub",
          },
          {
            // TODO: replace with dropdown when versions are available.
            type: "docsVersion",
            docsPluginId: "orca",
            position: "left",
            label: "OrCa",
          },
          {
            // TODO: replace with dropdown when versions are available.
            type: "docsVersion",
            docsPluginId: "vanguard",
            position: "left",
            label: "Vanguard",
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
            docsPluginId: "zkvanguard-legacy",
            position: "left",
            label: "ZK Vanguard (Circom)",
          },
          {
            // TODO: replace with dropdown when versions are available.
            type: "docsVersion",
            docsPluginId: "picus-v2",
            position: "left",
            label: "Picus",
          },
          {
            // TODO: replace with dropdown when versions are available.
            type: "docsVersion",
            docsPluginId: "picus",
            position: "left",
            label: "Picus (Circom)",
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
          {
            type: "docsVersionDropdown",
            docsPluginId: "picus-v2",
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
                to: "/saas/guide/on_boarding",
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
