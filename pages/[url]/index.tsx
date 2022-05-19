import { GetServerSideProps } from "next"
import { getLongUrl } from "../api/long-url";

export default function Redirect() {
    return (
        <div>
            <h1>Error</h1>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps =async ({ params }) => {
    if (!params || !params.url) {
        return {
            props: {}
        };
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
    } else {
        return {
            props: {}
        };
    }
}