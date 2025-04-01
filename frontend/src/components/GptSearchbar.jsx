import { useRef, useState } from 'react';
import Results from './Results';

const GptSearchbar = () => {
    const intext = useRef(null);
    const [results, setResults] = useState(null);

    const handleGptSearch = async () => {
        const value = intext.current.value.trim();
        if (!value) return;
        const prompt = { "prompt": value };

        console.log("Searching for:", prompt);

        try {
            const data = await fetch("http://localhost:8080/search", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify(prompt)
            });

            const response = await data.json();
            console.log(response);
            setResults(response);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    return (
        <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center py-8 px-4">
            <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-lg bg-gray-950 p-8 rounded-3xl shadow-2xl">
                <h1 className="text-4xl font-extrabold text-white mb-6 text-center">Search query</h1>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        ref={intext}
                        className="p-4 flex-grow rounded-xl bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-red-500"
                        type="text"
                        placeholder="Enter your query here..."
                        style={{ minHeight: '56px' }}
                    />
                    <button
                        className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg transform hover:scale-105"
                        onClick={handleGptSearch}
                    >
                        Search
                    </button>
                </div>
            </form>
            {results && (results.statusCode==200?<Results data={results?.data?.response?.candidates[0]?.content?.parts[0]?.text} />:<p className='text-white m-2 text-3xl'>{results.message}</p>)}
        </div>
    );
};
// results.data.response.candidates[0].context.parts[0].text

export default GptSearchbar;
