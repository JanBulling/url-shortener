import { getServerSideProps } from '../pages/[url]';
import * as longUrl from '../lib/urls';

describe('Redirect', () => {
    let func;
    const mockData = {
        url: "https://google.com",
        shortened_url: "ABCDEfg",
        visits: 2,
        attempts: 12,
    };

    afterEach(() => {
        jest.restoreAllMocks();
    })

    beforeEach(() => {
        func = jest.spyOn(longUrl, "getLongUrl").mockImplementation(async (shortUrl) => {
            if(shortUrl === mockData.shortened_url)
                return mockData;
            else
                return null;
        });
    })

    it('getServerSideProps returns the correct redirect', async () => {
        const response = await getServerSideProps({params: {url: mockData.shortened_url}});
        expect(func).toHaveBeenCalled();
        expect(response).toEqual({
            redirect: {
                destination: mockData.url,
                permanent: false,
            }
        });
    });

    it('getServerSideProps returns nothing, if no valid short url is given', async () => {
        const response = await getServerSideProps({params: {url: "hahiowf"}}); 
        expect(func).toHaveBeenCalled();
        expect(response).toEqual({
            notFound: true
        });
    })

    it('getServerSideProps returns nothing, if no short url is given', async () => {
        const response = await getServerSideProps({}); 
        expect(func).toHaveBeenCalledTimes(0);
        expect(response).toEqual({
            notFound: true
        });
    })
})