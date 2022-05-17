import { GetServerSideProps } from "next"

export default function Redirect() {
    return (
        <div>
            <h1>Error</h1>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps =async ({ params }) => {
    try {
        if(!params) {
            return {
                props: {}
            };
        }

        const shortUrl = params.url as string;

        const response = await fetch(
            "http://localhost:3000/api/long-url?short=" + shortUrl,
            
        );
        const data = await response.json();

        if (response.status === 200) {
            return {
                redirect: {
                    destination: data["url"],
                    permanent: false,
                }
            };
        }

        return {
            props: {}
        };

    } catch(e) {
        return {
            props: {}
        };
    }
}