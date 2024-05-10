// Requier las clases necesarias para el bot
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// Instancia de cliente con intents
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });


// Cargar los comandos
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Mostrar cuando se conecte al servidor de Discord

client.once('ready', readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Conectarse al servidor de Discord
client.login(process.env.token);

// Manejar las interacciones de comandos
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


// Manejar los mensajes del chat
client.on('messageCreate', message => {
  if (message.author.bot) return;
  const msg = message.content.toLowerCase()
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u');
  console.log(msg);
  if(msg === 'nicobot di hola'){
    message.reply('Hola, chicxs 👃');
  }else if(msg === 'nicobot di chau'){
    message.reply('Adios, chicxs 👃');
  }else if(msg === 'nicobot que hora es'){
    d = new Date();
    message.reply(`La hora es: ${new Date(d.getTime() + (d.getTimezoneOffset() * 60000) + (3600000*-5)).toLocaleTimeString()} 👃`);
  }else if(msg.startsWith('nicobot dile que se joda ')){
    const user = message.mentions.users.first();
    if (user) {
      message.channel.send(`¡Jodete <@${user.id}>! 👃`);
    }
  }
});
