export async function jsonFetch<T>(link: string, request: RequestInit = {}) : Promise<T> {
    const response = await fetch(link, request);

    if(response.ok){
        return await response.json();
    } else {
        throw new Error(link + " request failed");
    }
}