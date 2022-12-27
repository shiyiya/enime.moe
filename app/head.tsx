import { DEFAULT_SEO_PROPS } from '@/lib/seo';
import { NextSeo } from 'next-seo';

export default function Head() {
    return <>
        <NextSeo
            useAppDir
            {...DEFAULT_SEO_PROPS}
        />
    </>
}