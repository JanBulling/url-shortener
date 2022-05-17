import { GetServerSideProps } from 'next'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Url Shortener</title>
        <meta name="description" content="Url shortener by Jan Bulling" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-4">
        
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