import ShortenedUrl from "../lib/model/shortened_url";

interface StatsProps {
    mostVisited: ShortenedUrl[],
    mostAttemps: ShortenedUrl[],
}

export default function Stats({
    mostVisited,
    mostAttemps
}: StatsProps) {

    return (
        <div className="flex">
            {
                mostVisited.map((e) => (
                    <div>
                        {e.visits}
                    </div>
                ))
            }
            {
                mostAttemps.map((e) => (
                    <div>
                        {e.attempts}
                    </div>
                ))
            }
        </div>
    )

}