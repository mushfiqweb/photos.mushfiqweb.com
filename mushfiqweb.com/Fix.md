Next.js Build Error Analysis & SolutionBased on the Vercel logs and your configuration files, your build is failing with a Module not found error in several of your core routing files (app/page.tsx, app/blog/page.tsx, app/sitemap.ts, etc.).Since you are on the upgrade/nextjs branch, this error is happening because of a combination of a version typo, missing alias paths, and potentially a missing package.Here is why it's happening and how to fix it:1. The Next.js Version Typo (Critical)Why it's happening:In your package.json, you have defined your Next.js versions as follows:"next": "16.2.9""@next/bundle-analyzer": "16.2.9"Next.js version 16 does not exist yet. The latest stable major release is Next.js 15, and the previous was 14. It looks like you may have accidentally done a find-and-replace (e.g., replacing 14.2.9 with 16.2.9) during your upgrade attempt. This invalid version severely breaks Vercel's build environment and internal Webpack module resolution.The Solution:Update your package.json to a valid Next.js version (for React 19, you should use Next.js 15)."next": "15.1.0",
"@next/bundle-analyzer": "15.1.0",
(Note: Ensure you run pnpm install locally to update your pnpm-lock.yaml file after making this change!)2. Unresolved Contentlayer AliasesWhy it's happening:Your log shows the build failing on files that usually import contentlayer/generated. When migrating to Next.js 15 and next-contentlayer2, the build process often loses track of where the generated .contentlayer folder is located because Webpack strictness has increased.The Solution:You must explicitly tell Next.js and TypeScript where to find these generated files.Step A: Update your tsconfig.json to include the correct paths and includes:{
"compilerOptions": {
"baseUrl": ".",
"paths": {
"contentlayer/generated": ["./.contentlayer/generated"]
}
},
"include": [
"next-env.d.ts",
"**/*.ts",
"**/*.tsx",
".next/types/**/*.ts",
".contentlayer/generated"
]
}
Step B: Ensure your Next.js config uses the Contentlayer wrapper. In your next.config.mjs (or .js), ensure it looks like this:import { withContentlayer } from 'next-contentlayer2';

/\*_ @type {import('next').NextConfig} _/
const nextConfig = {
// your existing config options
};

export default withContentlayer(nextConfig); 3. Missing pliny PackageWhy it's happening:Your setup looks identical to the popular Tailwind Next.js Starter Blog. The files failing (app/page.tsx, app/blog/[...slug]/page.tsx) typically use the pliny package heavily at the very top of the file (e.g., import { sortPosts } from 'pliny/utils/contentlayer').Looking closely at the alphabetical order of your package.json snippet, pliny is completely missing from your dependencies (it should be right before "postcss"). If it was accidentally removed during the upgrade, Next.js will throw a Module not found error on line 1 of every blog-related file.The Solution:Add pliny back to your project by running:pnpm add pliny
Summary Checklist before your next commit:[ ] Change "next" to a valid version (15.x.x or 14.2.x) in package.json.[ ] Re-install dependencies locally so pnpm-lock.yaml is updated.[ ] Verify pliny is in your package.json.[ ] Verify tsconfig.json contains the "contentlayer/generated" path.[ ] Push to Vercel.
