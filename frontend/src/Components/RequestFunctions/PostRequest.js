export async function postRequest(url, body, successFunction, failFunction, headers = JSON.parse(sessionStorage.getItem('headers'))) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body,
        });
        console.log('response: ',response);
        if (response.ok) {
            // See if there is an response that is a json.
            try {
                const data = await response.json();
                successFunction(data);
            }
            // If the response is not a json (e.g. a simple message) just execute the success function.
            // The provided data are not important in this case.
            catch (e) {
                if (e instanceof SyntaxError) {
                    successFunction(null);
                }
                else {
                    console.log('Unknown error in PostRequest.js.');
                };
            }
        }
        else {
           failFunction();
        }
    } catch (error) {
        console.error(`Error: ${error} for fetching url: ${url}`);
    }
}