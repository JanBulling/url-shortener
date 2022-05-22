import { render, screen } from '@testing-library/react';
import * as getPopular from '../lib/urls';
import Home, { getServerSideProps } from '../pages/index';

describe('The home page', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    })

    const mockData = {
        mostVisited: [
            {
                url: "https://test1.com",
                shortened_url: "ABCDEFG",
                visits: 23,
                attempts: 2
            },
            {
                url: "https://test2.com",
                shortened_url: "HIJKLMN",
                visits: 12,
                attempts: 1
            }
        ],
        mostAttemps: [
            {
                url: "https://test3.com",
                shortened_url: "OPQRSTU",
                visits: 10,
                attempts: 5
            },
            {
                url: "https://test4.com",
                shortened_url: "VWXYZAB",
                visits: 2,
                attempts: 3
            }
        ]
    }

    it('renders popular data correctrly', async () => {
        render(<Home mostVisited={mockData.mostVisited} mostAttemps={mockData.mostAttemps} />);

        const tables = screen.getAllByRole("table");
        tables.forEach((table) => expect(table).toBeInTheDocument())

        mockData.mostVisited.forEach((e) => {
            const url = screen.getByRole("cell", {name: e.url});
            const shortUrl = screen.getByRole("link", {name: e.shortened_url});
            const visits = screen.getByRole("cell", {name: e.visits});

            expect(url).toBeInTheDocument();
            expect(shortUrl).toBeInTheDocument();
            expect(visits).toBeInTheDocument();
        });

        mockData.mostAttemps.forEach((e) => {
            const url = screen.getByRole("cell", {name: e.url});
            const shortUrl = screen.getByRole("link", {name: e.shortened_url});
            const attempts = screen.getByRole("cell", {name: e.attempts});

            expect(url).toBeInTheDocument();
            expect(shortUrl).toBeInTheDocument();
            expect(attempts).toBeInTheDocument();
        });
    });

    it('getServersideProps returns the correct data', async () => {
        const func = jest.spyOn(getPopular, "getPopular").mockImplementation(async () => (mockData));
        const response = await getServerSideProps({});
        expect(func).toHaveBeenCalled();
        expect(response).toEqual({
            props: {
                mostVisited: mockData.mostVisited,
                mostAttemps: mockData.mostAttemps
            }
        });
    })
})