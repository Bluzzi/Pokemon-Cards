export async function jsonFetch(link, request = {}) : Promise<any> {
    const response = await fetch(link, request);

    if(response.ok){
        return await response.json();
    } else {
        throw new Error("Request failed");
    }
}