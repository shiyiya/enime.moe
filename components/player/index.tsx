'use client'

import { enimeApi } from '@/lib/constant';
import { useEffect, useRef, useState } from 'react';
import { Episode, Source } from '@/lib/types';
import Player from '@oplayer/core';
import ui from '@oplayer/ui';
import hls from '@oplayer/hls';

export default function EnimePlayer(props) {
    const { sources, image } = props.episode as Episode
    const [sourceIndex, setSourceIndex] = useState(0)
    const playerContainerRef = useRef<HTMLDivElement>()
    const playerRef = useRef<Player>()
    const [source, setSource] = useState(undefined)
    // const { data: source, error } = useSWR<Source>(enimeApi + `/source/${sources[sourceIndex].id}`, url => fetch(url, { cache: "no-store" }).then(res => res.json()));
    const poster = !image ? undefined : `https://images.weserv.nl/?url=${image}`

    useEffect(() => {
        fetch(enimeApi + `/source/${sources[sourceIndex].id}`)
            .then((res) => res.json())
            .then((res) => {
                setSource(res)
            })
            .catch(console.log)
    }, [sourceIndex])

    useEffect(() => {
        if (playerRef.current) return;

        // @ts-ignore
        playerRef.current = Player.make(playerContainerRef.current, {

        })
            .use([
                ui(),
                hls({
                    options: {
                        hlsQualityControl: true,
                        hlsQualitySwitch: "immediate",
                    },
                }),
            ])
            .create()
            .on(["error", "pluginerror"], ({ type, payload }) => {
                if (payload?.fatal) {
                    setSourceIndex(sourceIndex + 1)
                }
            });

        playerRef.current.emit("menubar:register", {
            name: 'Source',
            children: sources.map((source) => {
                return {
                    name: source.url.includes('gogoanime') ? 'Gogoanime' : 'Zoro',
                    default: source.url.includes('gogoanime'),
                    value: source.id,
                }
            }),
            onChange({ value }) {
                setSourceIndex(sources.findIndex((source) => source.id === value))
            },
            onClick() {},
        })
    }, []);

    useEffect(() => {
        if (!source) return;

        playerRef.current.changeSource({
            src: source.url,
            ...(!!poster && {
                poster: poster,
            }),
        }).then(() => {
            if (source.subtitle) {
                playerRef.current.emit('subtitlechange', [
                    {
                        default: true,
                        src: source.subtitle,
                        name: 'English',
                    }
                ])
            }
        });
    }, [source])

    return (
        <div className={props.className}>
            <div className="w-full h-full p-0 m-0" ref={playerContainerRef} />
        </div>
    )
}
