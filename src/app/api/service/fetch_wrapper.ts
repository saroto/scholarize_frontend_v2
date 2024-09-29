"use server";

export async function fetchWrapper(url: string, options: any) {
    const response = await fetch(url, options);

    const data = await response.json();
    
    if (!response.ok) {
        if (data.error === "Unauthorized") {
            // Handle unauthorized error
        }
    }

    return response;
}