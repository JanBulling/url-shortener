import { getCookie, setCookies } from "cookies-next";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

interface ShortUrl {
    url: string,
    shortUrl: string,
}

export default function Shortener() {
    const [input, setInput] = useState('');
    const [shortUrls, setShortUrls] = useState<ShortUrl[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copying, setCopying] = useState<number[]>([]);

    const submitUrl = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await fetch(
                "/api/shorten-url",
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({"url": input})
                }
            );
        
            if (response.ok) {
                const data = await response.json();
                const shortUrlData: ShortUrl = {
                    url: data["url"],
                    shortUrl: data["shortened_url"]
                };

                // limit last urls to a maximum of 5
                while (shortUrls.length >= 5) {
                    shortUrls.pop();
                }

                console.log(shortUrls)

                const shortUrlsList = [shortUrlData, ...shortUrls];
            
                setCookies('urls', JSON.stringify(shortUrlsList), {maxAge: 60*10});   //10 min

                setShortUrls(shortUrlsList);
                setInput('');
                setError(null);

            } else {
                setError("Not a valid url.");
            }

        } catch(err) {
            setError("Something went wrong.");
        }

        setLoading(false);
    };

    useEffect(() => {
        const cookie = getCookie('urls') as string;
        if (cookie) {
            const json = JSON.parse(cookie) as ShortUrl[];
            setShortUrls(json);
        }
    }, [])

    useEffect(() => {
        if (error != null) {
            setTimeout(() => {
                setError(null);
            }, 3000);
        }
    }, [error])

    useEffect(() => {
        if (copying.length > 0) {
            setTimeout(() => {
                setCopying([]);
            }, 3000);
        }
    }, [copying])

    return (
        <div className="bg-blue-900 py-4 px-10">
            <div className="max-w-4xl mx-auto">
                <form action="submit" onSubmit={(e) => submitUrl(e)} 
                    className="flex-grow flex flex-col md:flex-row justify-between">
                    <label htmlFor="url"></label>
                    <input type="text" 
                            value={input}
                            placeholder="Shorten link"
                            onChange={(e) => setInput(e.target.value)}
                            className="p-3 rounded-xl border-0 w-full"
                        />
                    <button 
                        disabled={loading}
                        className="bg-blue-700 text-white rounded-xl mt-2 md:ml-5 md:mt-0 px-5 py-3 font-semibold text-lg hover:bg-blue-600"
                        formAction="submit">{!loading ? "Shorten" : "Loading..."}</button>
                </form>
                <p className="mt-2 text-gray-400 text-sm">By clicking SHORTEN, we will generate a short version of the given url</p>
                {
                    error &&
                    <div className="mt-2 py-4 bg-red-300 rounded-xl text-center text-sm text-gray-800">
                        <p>{"Unable to shorten link. " + error}</p>
                    </div>
                }
                <div className="bg-white rounded-xl mt-5 m-auto">
                    {
                        shortUrls.map((e, i) => (
                            <div key={i} className="flex justify-between items-center p-3">
                                <p className="text-gray-400 text-sm text-ellipsis whitespace-nowrap overflow-hidden mx-3">{e.url}</p>
                                <div className="flex items-center">
                                    <Link href={"https://url-shortener-jan-bulling.vercel.app/" + e.shortUrl}>
                                        <a className="text-blue-500">{e.shortUrl}</a>
                                    </Link>
                                    <CopyToClipboard
                                        text={"https://url-shortener-jan-bulling.vercel.app/" + e.shortUrl}
                                        options={{
                                            format: "text/plain",
                                        }}
                                        >
                                        <button 
                                            className={"text-white font-semibold ml-10 px-3 py-2 rounded-xl " + 
                                                (copying.includes(i) ? "bg-green-600 hover:bg-green-600" : "bg-blue-700 hover:bg-blue-600")}
                                            onClick={() => setCopying([...copying, i])}
                                            >
                                            Copy
                                        </button>
                                    </CopyToClipboard>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}