import { GetServerSideProps } from "next"
import { getLongUrl } from "../lib/urls";

export default function Redirect() {
    return (
        <div>
            <h1>Error</h1>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps =async ({ params }) => {
    if (!params || !params.url) {
        return { notFound: true };
    }

    const shortUrl = params.url as string;

    const longUrl = await getLongUrl(shortUrl);

    if (longUrl) {
        return {
            redirect: {
                destination: longUrl.url,
                permanent: false,
            }
        };
    }
     
    return { notFound: true };
}