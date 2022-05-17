import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('');

  return (
    <>
      <Head>
        <title>Url Shortener</title>
        <meta name="description" content="Url shortener by Jan Bulling" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-4">
        <h1>Hello</h1>
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