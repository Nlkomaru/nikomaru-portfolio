import parse from "html-react-parser";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export default async function Home({ params }: Params) {
    const resolvedParams = await params;
    const data: Works = await fetch(
        `https://nikomaru-portfolio-01.microcms.io/api/v1/products/${resolvedParams.id}`,
        {
            headers: {
                "X-MICROCMS-API-KEY": process.env.MICROCMS_API_KEY as string,
            },
            method: "GET",
        },
    ).then((res) => res.json());

    return (
        <>
            {data.title}
            <div>{parse(data.description)}</div>
        </>
    );
}
