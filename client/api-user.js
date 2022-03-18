const getVisData = async (params,signal) => {
    try {
        let response = await fetch('/api/getvisdata/', {
            method: 'GET',
            signal: signal,
        });
        return await response.json();
    } catch(err) {
        console.log(err);
    }
}