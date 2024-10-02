export async function putRequest(url, body, successFunction, failFunction, headers = JSON.parse(sessionStorage.getItem('headers'))) {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: body,
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