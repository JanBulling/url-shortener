import Link from "next/link";
import { ShortenedUrl } from "../lib/types";

interface StatsProps {
    isVisits: boolean,
    stats: ShortenedUrl[],
}

export default function StatsTable({ isVisits, stats }: StatsProps) {
    return (
        <>
            <h2 className="text-xl font-semibold mt-10 mb-2">{isVisits ? ("Most visited links") : ("Most shortened links")}</h2>
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
                                {isVisits ? ("Visited") : ("Shortened")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                stats.map((stat, i) => (
                                    <tr key={i} className="bg-white border-b-2">
                                        <td scope="row" className="px-6 py-4 text-ellipsis whitespace-nowrap overflow-hidden text-left max-w-md">
                                            {stat.url}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link href={"/" + stat.shortened_url}>
                                                <a className="text-blue-600">{stat.shortened_url}</a>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {isVisits ? (stat.visits) : (stat.attempts)}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
        </>
    )
}