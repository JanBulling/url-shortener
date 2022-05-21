import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Shortener from '../components/shortener';
import Stats from '../components/stats';
import ShortenedUrl from '../lib/model/shortened_url';
import { getPopular } from './api/popular';

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
          <a href='/' className='text-blue-600 hover:cursor-pointer font-semibold'>https://url-shortener-jan-bulling.vercel.app/[SHORT-URL]</a>
        </div>

        <Stats 
          mostVisited={props.mostVisited}
          mostAttemps={props.mostAttemps}
        />
        
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