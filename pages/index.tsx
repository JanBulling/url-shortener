import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link';
import { FormEvent, useCallback, useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState(null);

  const submitUrl = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const response = await fetch(
      "http://localhost:3000/api/shorten-url",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"url": url})
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      
      setShortUrl(data["shortened_url"]);
    }

    setLoading(false);

  }, [url]);

  return (
    <>
      <Head>
        <title>Url Shortener</title>
        <meta name="description" content="Url shortener by Jan Bulling" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-4">
        <h1>Hello</h1>
        <form 
          className='flex py-3 justify-around'
          action="submit" 
          onSubmit={(e) => submitUrl(e)}>

          <label htmlFor="url">Url</label>
          <input type="text" 
            className='bg-grey-100 p-2 border-2 rounded-xl border-black'
            onChange={(e) => setUrl(e.target.value)}
            value={url}
            required={true}
          />
          <button className='bg-orange-500 rounded-xl text-white px-3 font-bold hover:bg-orange-400' formAction='submit'>Shorten</button>
        </form>

        {
          loading && 
          <div className='text-red-500'>
            Loading...
          </div>
        }

        {
          shortUrl && 
          <div>
            <p>Short Url:</p>
            <Link href={"/"+shortUrl}>
              <a className='text-blue-500 hover:text-blue-400 underline font-semibold'>{"http://localhost:300/" + shortUrl}</a>
            </Link>
          </div>
          
        }
        
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    return {
      props: {}
    }
  } catch(e) {
    console.log(e);

    return {
      props: {}
    }
  }
}