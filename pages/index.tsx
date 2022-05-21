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