export async function deleteRequest(url, body, successFunction, failFunction, headers = JSON.parse(sessionStorage.getItem('headers'))) {
    try {
        const response =  await fetch(url, {
            method: 'DELETE',
            headers: headers,
            body: body,
        });
        if (response.ok) {
            successFunction();
        }
        else {
            failFunction()
        }
    }
    catch (error) {
        console.error(`Error: ${error} for deleting url: ${url}`);
    }
}