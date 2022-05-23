# URL Shortener
This small url-shortener generates a unique shorter URL of 7 characters. You will always get the same short-url given the same input. You can try this project at https://url-shortener-jan-bulling.vercel.app/.

## Tech-Stack:
- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Atlas MongoDB](https://www.mongodb.com/)
- **Deployment**: [Vercel](https://vercel.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Version Control**: [Github](https://github.com/)


## Overview
- `lib/*` - A collection of helpful functions and types or code for external services.
- `pages/api/*` - API Routes
- `pages/*` - All pages
- `components/*` - React.js components
- `public/*` - Static assets like images.
- `styles/*` - Global styles, Tailwing CSS integration
- `__tests__/*` - Unit tests for core functionaloty. To run, type `npm run test` in the console

## Api
Each functionality of the application is also available via api. Base URL: https://url-shortener-jan-bulling.vercel.app/

**Get all URLs**
[/api/all-urls](https://url-shortener-jan-bulling.vercel.app/api/all-urls): returns all URLs

**Get the long URL from a short version**
[/api/long-url](https://url-shortener-jan-bulling.vercel.app/api/long-url): Pass the short url as a parameter. Example Request:
```bash
https://url-shortener-jan-bulling.vercel.app/api/long-url?short=4FQ1TCi
```
This request returns the following:
```json
{"url": "https://google.com","shortened_url": "4FQ1TCi"}
```

**Get the most visited and most shortened URLs**
[/api/popular](https://url-shortener-jan-bulling.vercel.app/api/popular): returns the 6 most visited and the 6 most shortened urls. Example response:
```json
{
  "mostVisited": [
    {"url": "https://google.com/","shortened_url": "4FQ1TCi","attempts": 21,"visits": 23},
    {"url": "https://github.com/JanBulling","shortened_url": "10jQYzd","attempts": 9,"visits": 10},
  ],
  "mostAttemps": [
    {"url": "https://google.com/","shortened_url": "4FQ1TCi","attempts": 21,"visits": 23},
    {"url": "https://github.com/JanBulling","shortened_url": "10jQYzd","attempts": 9,"visits": 10},
  ]
}
```
**Shorten a given URL**
[/api/shorten-url](https://url-shortener-jan-bulling.vercel.app/api/shorten-url): Post the long-URL to this endpoint and you receive a shortened version of the URL.

## Algorithm
If the user types in an url, the input gets sanitized and validated. If it is a valid url, the md5 hashing algorithm generates a 128bit hash-number. This number gets converted into Base62 ([A-Z], [a-z], [0-9]) and the first 7 characters of the encoded string are the short-url. If there is already an existing short url with same characters (very very unlikely), the next 7 characters become the short-url (and so on).
To save the urls and the stats about each shorted link, this application uses MongoDB as the database. It integrates nicely to Next.js.

## Hosting
The project is hostet on https://vercel.com/, where you can simply host a next.js appication. Every time you push to github, a new version is automatically build and deployed.

## Running Locally
```bash
$ git clone https://github.com/JanBulling/url-shortener.git
$ cd url-shortener
```
Before running, you need to add a `.env.local` file to the root of the project with the following variable:
```env
MONGODB_URL=mongodb+srv://<USER>:<PASSWORD>@<DB_NAME>.mongodb.net/?retryWrites=true&w=majority
```
To run the project locally, type:
```bash
$ npm install
$ npm run dev
```
