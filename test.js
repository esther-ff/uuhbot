(async () => {
    var bazaar = await fetch('https://api.hypixel.net/v2/skyblock/bazaar')
    bazaar = await bazaar.json();
    console.log(bazaar.products.BOOSTER_COOKIE);
})();