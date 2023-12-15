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
