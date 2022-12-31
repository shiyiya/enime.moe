import RecentReleaseComponent from '@/components/recent-release';
import { enimeApi } from '@/lib/constant';
import Arrow from '@/components/arrow';
import AdBlock from '@/components/ad/block';

export default async function Home() {
    const { data, meta } = await (await fetch(enimeApi + "/recent?perPage=100&language=JP", { cache: "no-store" })).json();

    return (
        <>
            <div className="ml-[1%]">
                <div className="flex flex-row">
                    <p className="font-bold text-4xl mt-10 pl-5 mb-2">Recently Released</p>
                    <AdBlock/>
                </div>
                <Arrow>
                    <RecentReleaseComponent data={data} meta={meta}/>
                </Arrow>
            </div>
        </>
    )
}