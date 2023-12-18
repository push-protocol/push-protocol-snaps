import { assert, bytesToBase64 } from "@metamask/utils";

export async function fileURLToDataURL(fileURL) {
    try {
        const response = await fetch(fileURL);
        const blob = await response.blob();
    
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
    
            reader.onload = () => {
            const dataURL = reader.result;
                resolve(dataURL);
                console.log(dataURL)
            };
    
            reader.onerror = error => {
            reject(error);
            };
    
            reader.readAsDataURL(blob);
        });
    } catch (error) {
    throw new Error('Error fetching image');
    }
}

export async function getRawImageData(url: string, options?: RequestInit) {
    if (typeof fetch !== "function") {
        throw new Error(
            `Failed to fetch image data from "${url}": Using this function requires the "endowment:network-access" permission.`
        );
    }

    return fetch(url, options).then(async (response) => {
        if (!response.ok) {
            throw new Error(
            `Failed to fetch image data from "${url}": ${response.status} ${response.statusText}`
        );
    }

    const blob = await response.blob();
        assert(
            blob.type === "image/jpeg" || blob.type === "image/png",
            "Expected image data to be a JPEG or PNG image."
        );

        return blob;
    });
}

export async function getImageData(url: string, options?: RequestInit) {
    const blob = await getRawImageData(url, options);
    const bytes = new Uint8Array(await blob.arrayBuffer());

    return `data:${blob.type};base64,${bytesToBase64(bytes)}`;
}