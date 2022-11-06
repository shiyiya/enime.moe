import React from 'react';
import NextImage from 'next/image';

import '../styles/font.scss';
import '../styles/globals.scss';

import EnimeIcon from '@/public/icons/64x64.png';
import GithubIcon from '@/public/icons/github.png';
import DiscordIcon from '@/public/icons/discord.png';

import styles from './app.module.scss';
import classNames from 'classnames';
import TopNavigation from '@/components/navigation/top';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head>
          <title>Enime</title>
          <link rel="icon" href="/favicon.ico"/>
      </head>
      <body>
        <div className="bg-black text-white h-screen w-screen flex flex-col">
            <TopNavigation/>
            <div className="flex-grow w-screen p-0 m-0 mt-20">
                {children}
            </div>
            <footer className="bg-[#222] py-10">
                <div className={classNames(styles["foot-cont"], "flex flex-row content-between")}>
                    <div className={styles.disclaimer}>
                        <div className="flex flex-row items-center mb-3">
                            <NextImage src={EnimeIcon} alt="Enime Icon" className="w-6 mr-2"/>
                            <h1 className="text-2xl">Enime-Project</h1>
                        </div>
                        <p className={styles["gray-text"]}>ENIME.MOE is not affiliated with or endorsed by any of the anime studios
                            behind
                            the creation
                            of the anime presented on this site. This website is only an user interface presenting/linking
                            various
                            self-hosted
                            files
                            across the internet by other third-party providers for easy access.
                            <br/>
                            © ENIME.MOE {new Date().getFullYear()} | Built with <a
                                href="https://github.com/Enime-Project/api.enime.moe" target="_blank"
                                className="text-tertiary">Enime API</a>
                        </p>
                    </div>
                    <div className="flex-1 flex items-center justify-end">
                        <a target="_blank" href="https://github.com/Enime-Project/enime.moe"><NextImage className="w-7 mr-5"
                                                                                                        src={GithubIcon} alt="Github Icon"/></a>
                        <a target="_blank" href="https://discord.gg/nxr8be8WGa"><NextImage className="w-7"
                                                                                           src={DiscordIcon} alt="Discord Icon"/></a>
                    </div>
                </div>
            </footer>
        </div>
      </body>
    </html>
  )
}
