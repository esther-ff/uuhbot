const hypixelchat_run = async (bot) => {
    var bazaar = await fetch('https://api.hypixel.net/v2/skyblock/bazaar')
    bazaar = await bazaar.json();
    var cookieSellPrice = Math.ceil(bazaar.products.BOOSTER_COOKIE.quick_status.sellPrice).toLocaleString('en-US')
    var cookieBuyPrice = Math.ceil(bazaar.products.BOOSTER_COOKIE.quick_status.buyPrice).toLocaleString('en-US')
    bot.chat(`[Booster Cookie] Buy price: ${cookieBuyPrice} coins Sell price: ${cookieSellPrice} coins`)
};
module.exports = hypixelchat_run;