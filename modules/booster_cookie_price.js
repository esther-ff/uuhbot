const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('cookieprice')
		.setDescription('This command gives the current booster cookie price!'),
	async execute(interaction) {
        (async () => {
            // Fetch bazaar
            var bazaar = await fetch('https://api.hypixel.net/v2/skyblock/bazaar')
            bazaar = await bazaar.json();

            // Round up prices
            var cookieSellPrice = Math.ceil(bazaar.products.BOOSTER_COOKIE.quick_status.sellPrice).toLocaleString('en-US')
            var cookieBuyPrice = Math.ceil(bazaar.products.BOOSTER_COOKIE.quick_status.buyPrice).toLocaleString('en-US')

            // Embed
            const Embed = new EmbedBuilder()
            .setColor('#5e03fc')
            .setTitle('Booster Cookie prices')
            .setAuthor({ name: "Bigeon"})
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Buy Price', value: `${cookieBuyPrice}`, inline: true },
                { name: 'Sell Price', value: `${cookieSellPrice}`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'Ni dieu, ni maitre' });

            console.log(bazaar.products.BOOSTER_COOKIE);
            try {await interaction.channel.send({ embeds: [Embed] })} catch (err) { console.log(err) }
            await interaction.reply({content: "Done!", ephemeral: true}) 
        })();
        
        
	},
};