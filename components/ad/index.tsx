import Script from 'next/script';

export default function Ad() {
    return <>
        <Script async strategy="afterInteractive" crossOrigin="anonymous" src="/google.js"/>
    </>
}