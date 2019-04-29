async function amazonListener(details) {
  let url = details.url;
  let amazonReg = /^(https:\/\/)(www)(\.amazon\.)(com|de|co\.uk)/;

  if (url.match(amazonReg)) {
    let currentCookieStore;
    let cookieStores = await browser.cookies.getAllCookieStores();
    for(let store of cookieStores) {
      if (store.tabIds.includes(details.tabId)) {
        let cookie = await browser.cookies.get({
          url: url,
          name: "x-main",
          storeId: store.id
        });

        if (cookie) {
          let replaced = url.replace(amazonReg, '$1smile$3$4');        
          return {redirectUrl: replaced}
        }
      }
    }
  }

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  amazonListener,
  {urls: ['https://www.amazon.com/*', 'https://www.amazon.co.uk/*', 'https://www.amazon.de/*'],
  types: ["main_frame"]},
  ["blocking"]
);