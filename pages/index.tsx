import axios from "axios";
import {FormEvent, useState} from "react";

export default function IndexPage({apiKey}: { apiKey: string }) {
    const [joke, setJoke] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        // Set the request parameters
        const params = {
            model: 'text-davinci-002',
            prompt: 'tell me a joke',
            max_tokens: 2048,
        };

// Make the request
        const response = await axios.post('https://api.openai.com/v1/completions', params, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
        })
        setJoke(response.data.choices[0].text)
        setLoading(false)
    }
    return (
        <div className="text-white w-screen flex flex-col items-center p-8">
            {loading ? <p>Loading...</p> : <>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Tell me a joke
                    </button>
                </form>
                <div>
                    {joke}
                </div>
            </>}
        </div>
    )
}

export function getStaticProps() {
    return {
        props: {
            apiKey: process.env.OPENAI_API_KEY,
        },
    };
}
