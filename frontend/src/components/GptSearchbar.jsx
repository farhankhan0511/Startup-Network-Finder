import { useRef } from 'react';
// import { useDispatch } from 'react-redux';

const GptSearchbar = () => {
    const intext = useRef(null);
    // const dispatch = useDispatch();

    const handleGptSearch = async () => {
        const value = intext.current.value.trim();
        if (!value) return;
        const prompt={
            "prompt":value
        }


        console.log("Searching for:", prompt);

        const data=await fetch("http://localhost:8080/search",
        {method:'POST',
        headers:{'Content-Type':'application/json',},credentials:"include",
      body: JSON.stringify(prompt)})
        const response=await data.json()
        console.log(response)
        
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
