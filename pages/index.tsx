import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link';
import Shortener from '../components/Shortener';
import StatsTable from '../components/StatsTable';
import { ShortenedUrl } from "../lib/types";
import { getPopular } from '../lib/urls';

interface HomeProps {
  mostVisited: ShortenedUrl[],
  mostAttemps: ShortenedUrl[],
}

export default function Home(props: HomeProps) {
  return (
    <>
      <Head>
        <title>Url Shortener</title>
        <meta name="description" content="Url shortener by Jan Bulling" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className='m-5 font-bold text-3xl'>Make your URL shorter</h1>
        
        <Shortener />

        <div className='my-5 px-10 mx-auto flex lg:flex-row flex-col max-w-4x'>
          <p className='mr-2'>You can reach your shortened url at </p>
          <Link href='/'>
            <a className='text-blue-600 hover:cursor-pointer font-semibold'>https://url-shortener-jan-bulling.vercel.app/[SHORT-URL]</a>
          </Link>
        </div>

        <div className="py-4 pb-20 px-10">
          <div className="max-w-4xl mx-auto">
            <StatsTable 
              title='Most visited links'
              isVisits={true}
              stats={props.mostVisited}
            />
            <StatsTable 
              title='Most shortened links'
              isVisits={false}
              stats={props.mostAttemps}
            />
          </div>
        </div>        
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async(context) => {

  const popular = await getPopular();

    if (popular) {
      return {
        props: {mostVisited: popular.mostVisited, mostAttemps: popular.mostAttemps}
      }
    } else {
      return {
        props: {mostVisited: [], mostAttemps: []}
      }
    }
}