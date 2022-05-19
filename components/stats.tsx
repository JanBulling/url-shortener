import Link from "next/link";
import ShortenedUrl from "../lib/model/shortened_url";

interface StatsProps {
    mostVisited: ShortenedUrl[],
    mostAttemps: ShortenedUrl[],
}

export default function Stats({
    mostVisited,
    mostAttemps
}: StatsProps) {

    return (
        <div className="py-4 px-10">
            <div className="max-w-4xl mx-auto">
                
                <h2 className="text-xl font-semibold my-2">Most Visited Links</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto overflow-scroll text-sm whitespace-nowrap text-gray-500">
                        <thead className="text-sm text-black uppercase bg-gray-200">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left">
                                    Url
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Short Url
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Clicked
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                mostVisited.map((e, i) => (
                                    <tr key={i} className="bg-white border-b-2">
                                        <td scope="row" className="px-6 py-4 text-ellipsis whitespace-nowrap overflow-hidden text-left max-w-md">
                                            {e.url}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link href={"https://url-shortener-jan-bulling.vercel.app/" + e.shortened_url}>
                                                <a className="text-blue-600">{e.shortened_url}</a>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {e.visits}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

                <h2 className="text-xl font-semibold mt-10 mb-2">Most Shortened Links</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto overflow-hidden text-sm whitespace-nowrap text-gray-500">
                        <thead className="text-sm text-black uppercase text-left bg-gray-200">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left">
                                    Url
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Short Url
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Shortened
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                mostAttemps.map((e, i) => (
                                    <tr key={i} className="bg-white border-b-2">
                                        <td scope="row" className="px-6 py-4 text-ellipsis whitespace-nowrap overflow-hidden text-left max-w-md">
                                            {e.url}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link href={"https://url-shortener-jan-bulling.vercel.app/" + e.shortened_url}>
                                                <a className="text-blue-600">{e.shortened_url}</a>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {e.attempts}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

}