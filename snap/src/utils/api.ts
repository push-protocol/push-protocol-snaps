export const fetchGet = async (url: string): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error in fetchGet for ${url}:`, error);
    throw error;
  }
};

export const fetchPost = async (url: string, body: any): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error in fetchPost for ${url}:`, error);
    throw error;
  }
};
