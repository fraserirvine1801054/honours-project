
const getPackage = async (signal, params) => {
    try {
        let response = await fetch(`/api/packageview/${params}`, {
            method: 'GET',
            signal: signal,
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

export {
    getPackage
}