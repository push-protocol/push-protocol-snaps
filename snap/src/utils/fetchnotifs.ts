import { fetchAddress } from "./fetchAddress";
import { ethers } from "ethers";
import { getImageData } from "../helper/imageHelper";

export const getNotifications = async (address: string) => {
  try {
    let addressValidation = ethers.utils.isAddress(address);

    if (addressValidation) {
      const url = `https://backend-staging.epns.io/apis/v1/users/eip155:5:${address}/feeds`;
      const response = await fetch(url, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data, "api data");
      return data;
    } else {
      return { feeds: [] };
    }
  } catch (err) {
    console.log(err);
    return { feeds: [] };
  }
};

export const filterNotifications = async (address: string) => {
  let fetchedNotifications = await getNotifications(address);
  fetchedNotifications = fetchedNotifications?.feeds;
  let notiffeeds = [];
  const currentepoch = Math.floor(Date.now() / 1000);

  console.log(fetchedNotifications, "fetched notifs: ");

  if (fetchedNotifications && fetchedNotifications.length > 0) {
    for (let i = 0; i < fetchedNotifications.length; i++) {
      let feedepoch = parseInt(fetchedNotifications[i].payload.data.epoch, 10);
      if (feedepoch > currentepoch - 60) {
        const message =
          fetchedNotifications[i].payload.data.app +
          " : " +
          convertText(fetchedNotifications[i].payload.data.amsg);

        notiffeeds.push({ message });
      }
    }
  }

  return notiffeeds.reverse();
};

export const fetchImageUrl = async (address: string) => {
  let fetchedNotifications = await getNotifications(address);
  fetchedNotifications = fetchedNotifications?.feeds;
  let imageBase64;

  if (fetchedNotifications && fetchedNotifications.length > 0) {
    for (let i = 0; i < fetchedNotifications.length; i++) {
      const aimg = fetchedNotifications[i].payload.data.aimg;

      imageBase64 = null;

      if (fetchedNotifications[i]) {
        try {
          imageBase64 = await getImageData(aimg);
        } catch (error) {
          console.error("Error fetching image: ", error);
        }
      } else {
        imageBase64;
      }

      return imageBase64;
    }
  }

  return imageBase64;
};

export const fetchAllAddrNotifs = async () => {
  const addresses = await fetchAddress();
  let notifs: String[] = [];
  if (addresses.length == 0) return notifs;
  const promises = addresses.map((address) => filterNotifications(address));
  const results = await Promise.all(promises);
  notifs = results.reduce((acc, curr) => acc.concat(curr), []);
  return notifs;
};

function convertText(text: string) {
  let newText = text.replace(/\n/g, " ");

  const tagRegex = /\[(d|s|t):([^\]]+)\]/g;
  newText = newText.replace(tagRegex, (match, tag, value) => value);

  const timestampRegex = /\[timestamp:\s*(\d+)\]/g;
  let processedTimestamps = new Set();
  newText = newText.replace(timestampRegex, (match, timestamp) => {
    if (processedTimestamps.has(timestamp)) {
      return "";
    } else {
      const date = new Date(parseInt(timestamp) * 1000);
      processedTimestamps.add(timestamp);
      return date.toLocaleString();
    }
  });

  return newText;
}
