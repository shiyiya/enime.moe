import { $ } from '@oplayer/core';

/**
 *
 * @param options [op end time, ed start time]
 * @returns PlayerPlugin
 */
const skipOpEd = (options = []) => ({
    name: 'skip-op-ed-plugin',
    apply: (player) => {
        const pos = $.css(`
      display: none;
      position: absolute;
      bottom: 25%;
      right: -2px;
      z-index: 1;`)

        const area = $.css(`
      color: #fff;
      background: rgba(28 ,28 ,28 , 0.9);
      padding: 6px 20px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;`)

        const $dom = $.create(`div.${pos}`, {}, `<div class=${area}>Skip</div>`)

        const [o = -1, e = Infinity] = options
        let duration = [o, e]

        $dom.onclick = function () {
            if (player.currentTime < duration[0]) {
                player.seek(duration[0])
            }
            if (player.currentTime > duration[1]) {
                // 🤖 play next ep
            }
        }

        player.on(['timeupdate', 'seeked'], () => {
            if (player.currentTime < duration[0] || player.currentTime > duration[1]) {
                $dom.style.display = 'block'
            } else {
                $dom.style.display = 'none'
            }
        })

        player.on('opedchange', ({ payload }) => {
            duration = payload
        })

        player.on('videosourcechange', () => {
            duration = [-1, Infinity]
        })

        $.render($dom, player.$root)
    }
});