const config = require('./config.json')
const mfr = require('mineflayer');
const registry = require('prismarine-registry')('1.8.9');
const ChatMessage = require('prismarine-chat')(registry);
const { Client, Events, GatewayIntentBits, SlashCommandBuilder, Collection } = require('discord.js');
const fs = require('node:fs')

// Locations of log files relative to main.js
const discordLogs = './logs/logs-discord.txt'
const guildchatLogs = './logs/logs-guildchat.txt'

// Options for the mineflayer bot
const options = {
    auth: 'microsoft',
    host: 'mc.hypixel.net',
    username: `${config.botname}`,
    version: '1.8.9'
};

// Regexes and arrays for filtering
const filtered_output = [
    'left.', 'joined.', `${options.username}`
]
var regex2_str = "";
for (item in filtered_output){
    if (item == 0){
          regex2_str = regex2_str + `(${filtered_output[item]})`;
    } else {
           regex2_str = regex2_str + `|(${filtered_output[item]})`;
    }
}

var regex_str = "";
let file = fs.readFileSync('./data/filtered.txt', 'utf8');
data_array = file.toString().split('\n');

for (a in data_array){
    data_array[a] = data_array[a].replace('\r',"")
}

for (item in data_array){
    if (item == 0){
          regex_str = regex_str + `${data_array[item]}`;
    } else {
           regex_str = regex_str + `|${data_array[item]}`;
    }
}
// Final variables for regexes
const regex2 = new RegExp(`${regex_str}`);
const regex  = new RegExp(`${regex2_str}`);
const prefix_regex = /^\.\w+/ ;
const hypixel_chat_regex = /.+?\w{0,} \[\w{1,5}\]:\B /

// Mineflayer bot object
const bot = mfr.createBot(options);

// Discord bot object
const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
]});

// Modules for slash commands
client.commands = new Collection();
const folderpath = './modules'
const cmdfolder = fs.readdirSync('./modules')

for (folder in cmdfolder){
    console.log(`${cmdfolder[folder]} - Discord`)
    const command = require(`${folderpath}/${cmdfolder[folder]}`)
    client.commands.set(command.data.name, command);
}

// Channel id of the channel used for bridging chats
const ChannelID = '1286687362281242736'

// Modules for chat commands in minecraft
const cmds = [];
const path = './modules-hypixel-chat'
const commandloc = fs.readdirSync('./modules-hypixel-chat')
for (folder in commandloc){
    console.log(`${commandloc[folder]} - Hypixel`)
    var command = require(`${path}/${commandloc[folder]}`)
    cmds.push(commandloc[folder]);
}

// Executed when the bot is ready (discord.js)
client.once(Events.ClientReady, cl => {
    console.log(`${cl.user.tag} - discord bot part ready`)                                            
});

// on message in minecraft chat
bot.on('message', (message, pos) => {
    const channel_fetch = client.channels.fetch(ChannelID)
    const channel = client.channels.cache.get(ChannelID) 
    var chatmsg = message.toString();
    const guild_regex = new RegExp("(Guild >)")

    if (regex.exec(chatmsg) != null | guild_regex.exec(chatmsg) == null){
        chatmsg = chatmsg.replace("Guild >", "").replace(/_/g, "\\_");
        if (chatmsg.includes("left.") == true){
            channel.send(chatmsg);
        } else if (chatmsg.includes("joined. ") == true) {
            channel.send(chatmsg);
        } else {
            console.log(chatmsg);
        }
    } else {
        console.log("Guild message!");

        // Guild message without the "Guild >"
        var cleanmsg = chatmsg.replace("Guild >", "")

        // Check for . at the start
        if (prefix_regex.exec(cleanmsg.replace(hypixel_chat_regex, "")) == null){
            channel.send(cleanmsg);
        } else {
            // command is the variable containing the executed command (ex. .test)
            var command = prefix_regex.exec(cleanmsg.replace(hypixel_chat_regex, ""))
            // cmd_args are the arguments after the command, the command itself is the array's first element at index 0.
            var cmd_args = command.input.split(' ');
            
            // Check if command exists in the directory as a .js file
            if (cmds.includes(`${cmd_args[0].replace(".", "")}.js`)){
                var chat_command = require(`./modules-hypixel-chat/${command.input.replace(".", "")}.js`) //variable for requiring the module's function
                chat_command(bot);  
            } else { 
                console.log(`${command.input.replace(".", "")} not found!` ) 
            }
        }
        // Append guild chat to log file
        fs.appendFile(guildchatLogs, cleanmsg+'\n', (error) =>{
            if (error) {
                console.log(error);
            }
        })
    }
})

// on bot login
bot.on('login', () => {
    console.log('mineflayer bot ready!')
})

// Slash command handler
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()){return};
    var command = interaction.client.commands.get(interaction.commandName);
    if (!command){
        console.log(`Did not find: ${interaction.commandName} !`)
    }
    await command.execute(interaction)
});

// on creation of a discord message
client.on("messageCreate", (msg) => {
    const channel_fetch = client.channels.fetch(ChannelID)
    const channel = client.channels.cache.get(ChannelID)
    if (msg.channelId == ChannelID && msg.author.id != client.user.id){
        if (regex2.exec(msg.content) != null){
            console.log("Filtered!");
        } else {
            bot.chat(`[${msg.author.globalName}]: ${msg.content}`);
            fs.appendFile(discordLogs, `[${msg.author.globalName}]: ${msg.content}\n`, (error) =>{
                if (error) {
                    console.log(error);
            }})
        }
    }
})


client.login(`${config.token}`)