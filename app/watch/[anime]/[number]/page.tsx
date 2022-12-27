import { enimeApi } from '@/lib/constant';
import styles from './page.module.scss';

import EnimePlayer from '@/components/player';
import classNames from 'classnames';
import NextLink from 'next/link';
import { title } from '@/lib/helper';
import EpisodeListItem from '@/components/episode-list-item';

export default async function Watch({ params }) {
    if (!params.anime || !params.number) return <></>

    const episode = await (await fetch(enimeApi + `/view/${params.anime}/${params.number}`, { next: { revalidate: 600 }})).json();

    if (!episode.anime) return <></>

    return (
        <div className={classNames(styles.cont, "my-20 items-stretch")}>
            <div className={classNames(styles.episode)}>
                <EnimePlayer className="relative w-full aspect-video mb-8" episode={episode}/>
                <div className="m-2">
                    <NextLink href={`/anime/${episode.anime.slug}`} prefetch={false}>
                        <span className="text-3xl">{ title(episode.anime.title) }</span>
                    </NextLink>
                    <p className="text-xl text-tertiary">
                        Episode { episode.number }{ episode.title && <span>: { episode.title }</span> }
                    </p>
                </div>
            </div>
            <div className={classNames(styles["next-eps"], "pl-10 flex flex-col items-start justify-start overflow-y-auto m-0 p-0 w-[17.5rem] h-full max-lg:(w-0 hidden)")}>
                <span className="text-3xl mb-4 pl-3 m-0">Episodes</span>
                <div className={styles.line}/>
                <div className={classNames(styles.nextEps, "flex flex-col py-3 p-0 m-0 justify-start overflow-y-auto w-full")}>
                    {episode.anime.episodes.map(ep => {
                        return (
                            <NextLink key={ep.id} href={`/watch/[anime]/[number]/`} as={`/watch/${episode.anime.slug}/${ep.number}`} prefetch={false}>
                                <div className={classNames(styles["next-ep"], "w-full px-1 py-2 relative")}>
                                    <EpisodeListItem episode={ep}/>
                                    {ep.number === episode.number && <div className={classNames(styles.currenttext, "absolute top-0 right-0 left-0 bottom-0 bg-[#000000b0] font-bold text-5xl")}>
                                        Current
                                        <br/>
                                        <br/>
                                    </div>}
                                </div>
                            </NextLink>
                        )
                    })}
                </div>
                <div className={styles.line}/>
            </div>
        </div>
    )
}