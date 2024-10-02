export async function getRequest(url, successFunction, failFunction, headers = JSON.parse(sessionStorage.getItem('headers'))) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });
        if (response.ok) {
            const data = await response.json();
            successFunction(data);
        }
        else {
            failFunction();
        }
    } catch (error) {
        console.error(`Error: ${error} for fetching url: ${url}`);
    }
}