const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js')
const config = require('../config.json')
const apikey = 'e04b6f2a-ec5e-4c73-9205-596676ec6ac3' //6948e0a6-4ff6-45c2-93e2-601453c0bc39
module.exports = {
	data: new SlashCommandBuilder()
		.setName('online')
		.setDescription('Checks for online and offline people in the guild!'),
	async execute(interaction) {

		// Deferred reply due to somewhat long time of execution
		await interaction.deferReply({ ephemeral: true });
		
		// Variables
		let array = [];
		let urls = [];
		let embeds = [];
		let hypixel_api_fetch = await fetch('https://api.hypixel.net/guild?key='+apikey+"&name=Ironballers")
		let apijson = await hypixel_api_fetch.json();

		if (apijson.success === false){
			interaction.editReply({ content: "Failed to fetch information from Hypixel API", ephemeral: true})
			return;
		}
		
		let count_online = 0;
		
		
		// Checks which players are offline and online via api, and also counts them
        for (user in apijson.guild.members){
			uuid = apijson.guild.members[user].uuid;
			urls.push(`https://api.hypixel.net/v2/player?key=${apikey}&uuid=${uuid}`)
		}

		// amount of members
		let count_members = urls.length;

		// Promise for all the users, to fetch them asynchronously
		Promise.all(urls.map(url => fetch(url)))
		.then(responses => {
			return Promise.all(responses.map(response => response.json()))
		})
		.then(data => {
			let pstatus = "OFFLINE!"
			data.map(obj => {
				pstatus = 'OFFLINE!'
				try {
					if(obj.player.lastLogin > obj.player.lastLogout) {
						pstatus = 'ONLINE!'
						count_online++;
					}
				} catch (err) {
					interaction.editReply({ content: "Failed to fetch information from Hypixel API", ephemeral: true})
					return;
				}

				array.push(`${obj.player.displayname.replace(/_/g, "\\_")}, ${pstatus}`)
			})
			
			return Promise.all(array)
		})
		.then(array => {
			// Creating of embeds and pushing them to a array once they have 25 fields (limit)
			let i=0;
			
			for (a in array){
				if (i==0){
					var Embed = new EmbedBuilder()
					.setColor(`#${config.embedcolor}`)
					.setTitle('Guild list')
					.setAuthor({ name: "Bigeon"})
					.setTimestamp()
				} 
				b = array[a].split(",")
				Embed.addFields({ name: `${b[0]}`, value: `${b[1]}`, inline: true})
				i++;
				if (i==25){
					embeds.push(Embed);
					i=0;
				}
			}

			// Last embed for online and offline player count
			var OnlineEmbed = new EmbedBuilder()
			.setColor(`#${config.embedcolor}`)
			.setTitle('Online and offline players!')
			.setAuthor({ name: "Bigeon"})
        	.setTimestamp()
        	.setFooter({ text: 'Ni dieu, ni maitre' })
			.addFields({ name: "Online", value: `${count_online}`, inline: true})
			.addFields({ name: "Offline", value: `${count_members-count_online}`, inline: true});

			// Sending the embeds
			for (n in embeds){
				interaction.channel.send({ embeds: [embeds[n]]})
			};
			interaction.editReply({ embeds: [OnlineEmbed]});
		})
	},
};