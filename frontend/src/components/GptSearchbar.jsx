import { useRef } from 'react';
// import { useDispatch } from 'react-redux';

const GptSearchbar = () => {
    const intext = useRef(null);
    // const dispatch = useDispatch();

    const handleGptSearch = async () => {
        const query = intext.current.value.trim();
        if (!query) return;


        console.log("Searching for:", query);

        await fetch()

        // Example Redux Dispatch (Uncomment if using Redux)
        // dispatch(fetchGptResults(query));

        // Example API Call (Replace with actual API)
        // const response = await fetch(`/api/search?query=${query}`);
        // const data = await response.json();
        // console.log(data);
    };

    return (
        <div className='absolute top-[18%] flex justify-center z-10 w-full'>
            <form onSubmit={(e) => e.preventDefault()} className='w-[92%] md:w-1/2 bg-black grid grid-cols-12'>
                <input
                    ref={intext}
                    className="p-4 m-4 rounded-md col-span-9 text-white"
                    type='text'
                    placeholder="Enter your query here"
                />
                <button className='py-2 px-4 bg-red-800 rounded-lg col-span-3' onClick={handleGptSearch}>
                    Search
                </button>
            </form>
        </div>
    );
};

export default GptSearchbar;
