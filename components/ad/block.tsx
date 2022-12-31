'use client'

import { useEffect } from 'react';

export default function AdBlock() {
    useEffect(() => {
        const pushAd = () => {
            try {
                // @ts-ignore
                const adsbygoogle = window.adsbygoogle
                adsbygoogle.push({})
            } catch (e) {
                console.error(e)
            }
        }

        let interval = setInterval(() => {
            // Check if Adsense script is loaded every 300ms
            // @ts-ignore
            if (window.adsbygoogle) {
                pushAd()
                // clear the interval once the ad is pushed so that function isn't called indefinitely
                clearInterval(interval)
            }
        }, 300)

        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <ins
            className="adsbygoogle"
            style={{ width: "100%" }}
            data-ad-client="ca-pub-2103276838446130"
        ></ins>
    )
}