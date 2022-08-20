export default function vttThumbnailPlugin(options) {
    const src = options.src;

    const getVttFile = (url) => {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line no-undef
            const req = new XMLHttpRequest();

            // @ts-ignore
            req.data = {
                resolve
            };

            req.addEventListener("load", this.vttFileLoaded);
            req.open("GET", url);
            req.overrideMimeType("text/plain; charset=utf-8");
            req.send();
        });
    }
}