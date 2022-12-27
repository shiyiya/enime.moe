import type { NextSeoProps } from 'next-seo';

export const DEFAULT_SEO_PROPS: NextSeoProps = {
    title: "Home",
    description: "An anime streaming site based on Enime API. Just hop in and watch with speed without VPN or ads",
    titleTemplate: "%s | Enime",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://enime.moe/",
        title: "Enime",
        description: "An anime streaming site based on Enime API. Just hop in and watch with speed without VPN or ads",
        siteName: "Enime",
    }
};