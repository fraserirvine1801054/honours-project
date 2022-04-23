const getVisualisationData = async (signal,query) => {
    console.log("getting visualisation data");
    try {
        let response = await fetch(`/api/visualisation/${query}`, {
            method: 'GET',
            signal: signal,
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}
export {
    getVisualisationData
}