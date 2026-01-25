require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const commandHandler = require('./handlers/commandHandler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    switch (interaction.commandName) {
      case 'analyze':
        await commandHandler.handleAnalyze(interaction);
        break;
      case 'brackets':
        await commandHandler.handleBrackets(interaction);
        break;
      case 'bracket':
        await commandHandler.handleBracket(interaction);
        break;
      case 'bracket-add':
        await commandHandler.handleBracketAdd(interaction);
        break;
      case 'bracket-update':
        await commandHandler.handleBracketUpdate(interaction);
        break;
      case 'bracket-remove':
        await commandHandler.handleBracketRemove(interaction);
        break;
      case 'ban':
        await commandHandler.handleBan(interaction);
        break;
      case 'unban':
        await commandHandler.handleUnban(interaction);
        break;
      case 'banlist':
        await commandHandler.handleBanlist(interaction);
        break;
      case 'category-add':
        await commandHandler.handleCategoryAdd(interaction);
        break;
      case 'category-remove':
        await commandHandler.handleCategoryRemove(interaction);
        break;
      case 'category':
        await commandHandler.handleCategory(interaction);
        break;
      case 'reset':
        await commandHandler.handleReset(interaction);
        break;
      default:
        await interaction.reply('Unknown command');
    }
  } catch (error) {
    console.error('Error handling command:', error);
    const replyMethod = interaction.deferred || interaction.replied ? 'followUp' : 'reply';
    await interaction[replyMethod]({ content: '❌ An error occurred while processing your command.', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
