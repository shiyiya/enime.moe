import { enimeApi } from '@/lib/constant';
import { title } from '@/lib/helper';
import Arc from '@/components/arc';

export default async function Head({ params }) {
    if (!params.anime || !params.number) return <></>

    const episode = await (await fetch(enimeApi + `/view/${params.anime}/${params.number}`, { next: { revalidate: 600 }})).json();
    if (episode.message) return <></>

    return <>
        <title>{`Episode ${ episode.number } ${ episode.title ? `- ${episode.title}` : "" } | ${ title(episode.anime.title) } | Enime`}</title>
        <Arc/>
    </>
}