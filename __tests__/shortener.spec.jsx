import { render, screen, waitFor } from '@testing-library/react';
import Shortener from "../components/InputShortener";
import userEvent from '@testing-library/user-event';

describe('The "Shortener" component', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    
    it('simulate shortening valid url', async () => {
        render(<Shortener />);
        const button = screen.getByRole('button', {name: "Shorten"});
        const input = screen.getByRole('textbox');

        //mocking the "fetch" function
        global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
                url: "https://google.com",
                shortened_url: "ABCDEfg",
            })
        }));

        // testing for form elements to be in the document
        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();

        // simulating typing and pressing the button
        userEvent.type(input, "https://google.com");
        await waitFor(() => expect(input).toHaveValue('https://google.com'));
        await waitFor(() => userEvent.click(button));

        // check for the data to appear on screen
        const url = screen.queryByText("https://google.com");
        const shortUrl = screen.getByRole("link", {name: "ABCDEfg"});
        const copyBtn = screen.getByRole("button", {name: "Copy"});

        expect(url).toBeInTheDocument();
        expect(shortUrl).toBeInTheDocument();
        expect(copyBtn).toBeInTheDocument();

        global.fetch.mockClear();
        delete global.fetch;
    });

    it('simulate shortening invalid url', async () => {
        const {debug} = render(<Shortener />);
        const button = screen.getByRole('button', {name: "Shorten"});
        const input = screen.getByRole('textbox');

        // mocking the "fetch" function to return wrong data
        global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
            ok: false,
            status: 400,
            json: async () => ({
                url: "https://googleo",
                shortened_url: "",
            })
        }));

        // testing for form elements to be in the document
        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();

        // simulating typing and pressing the button
        userEvent.type(input, "https://google.com");
        await waitFor(() => expect(input).toHaveValue('https://google.com'));
        await waitFor(() => userEvent.click(button));

        // checking for error message
        const errorMessage = screen.queryByText("Unable to shorten link. Not a valid url.");
        expect(errorMessage).toBeInTheDocument();

        global.fetch.mockClear();
        delete global.fetch;
    });
})