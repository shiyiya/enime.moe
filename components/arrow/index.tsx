'use client'

import classNames from 'classnames';
import styles from './index.module.scss';
import { PropsWithChildren, useRef } from 'react';

function ArrowIcon({ color, className }) {
    return (
        <svg className={className} width="48pt" height="48pt" version="1.1" viewBox="0 0 48 48" fill="none">
            <path d="m18.75 36-2.15-2.15 9.9-9.9-9.9-9.9 2.15-2.15L30.8 23.95Z" fill={color} />
        </svg>
    )
}

export default function Arrow({ children }: PropsWithChildren) {
    const wrapperRef = useRef<HTMLDivElement>();

    const scroll = (number) => {
        const e = wrapperRef.current.children.item(1);
        e.scrollTo({
            left: e.scrollLeft + number * window.innerWidth,
            behavior: "smooth"
        });
        return e.scrollLeft + number * window.innerWidth;
    }

    return (
        <div ref={wrapperRef} className="relative flex flex-row items-center mt-6 left-0 right-0 m-0 p-0 w-full mb-[5rem]">
            <div onClick={() => scroll(-1)} className={classNames(styles.left, styles.button, "p-0 w-10 h-10")}>
                <ArrowIcon className={styles.arrow} color="#ffF"/>
            </div>
            {children}
            <div onClick={() => scroll(1)} className={classNames(styles.right, styles.button, "p-0 w-10 h-10")}>
                <ArrowIcon className={styles.arrow} color="#ffF"/>
            </div>
        </div>
    )
}