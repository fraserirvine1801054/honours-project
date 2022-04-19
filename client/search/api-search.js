const getSearchReturns = async (signal,query) => {
    console.log("getting search returns");
    try {
        let response = await fetch(`/api/search/${query}`, {
            method: 'GET',
            signal: signal,
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

export {
    getSearchReturns,
}