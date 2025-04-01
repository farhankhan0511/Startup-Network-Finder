import PropTypes from 'prop-types';

const Results = ({ data }) => {
    return (
        <div className="mt-8 w-full max-w-lg bg-gray-950 p-6 rounded-3xl shadow-2xl text-gray-200">
            <h2 className="text-3xl font-bold mb-4">Search Results:</h2>
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

Results.propTypes = {
    data: PropTypes.any.isRequired
};

export default Results;
