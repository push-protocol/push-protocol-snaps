/**
 * Performs a GET request to the specified URL and returns the response data.
 * @param url The URL to fetch data from.
 * @returns The response data from the GET request.
 * @throws Error if there is an issue fetching data.
 */
export const fetchGet = async <T>(url: string): Promise<T> => {
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

    return response.json() as T;
  } catch (error) {
    console.error(`Error in fetchGet for ${url}:`, error);
    throw error;
  }
};

/**
 * Performs a POST request to the specified URL with the given body and returns the response data.
 * @param url The URL to post data to.
 * @param body The body of the POST request.
 * @returns The response data from the POST request.
 * @throws Error if there is an issue fetching data.
 */
export const fetchPost = async <T>(url: string, body: T): Promise<T> => {
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

    return response.json() as T;
  } catch (error) {
    console.error(`Error in fetchPost for ${url}:`, error);
    throw error;
  }
};
