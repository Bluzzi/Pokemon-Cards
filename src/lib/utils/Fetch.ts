export async function jsonFetch(link: string, request: RequestInit = {}) : Promise<any> {
    const response = await fetch(link, request);

    if(response.ok){
        return await response.json();
    } else {
        throw new Error(link + " request failed");
    }
}