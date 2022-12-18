import RecentReleaseComponent from '@/components/recent-release';
import { enimeApi } from '@/lib/constant';
import Arrow from '@/components/arrow';

export const revalidate = 300;

export default async function Page() {
    const { data, meta } = await (await fetch(enimeApi + "/recent?perPage=100")).json();

    return (
        <>
            <div className="ml-[1%]">
                <p className="font-bold text-4xl mt-10 pl-5 mb-2">Recently Released</p>
                <RecentReleaseComponent data={data} meta={meta}/>
            </div>
        </>
    )
}