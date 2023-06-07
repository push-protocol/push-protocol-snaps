export const fetchChannels =async(address:string)=>{
    const url = `https://backend-prod.epns.io/apis/v1/users/eip155:5:${address}/feeds`;
    const response = await fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
}