const deckService = require('../services/deckService');
const configManager = require('../config/configManager');

async function handleAnalyze(interaction) {
  await interaction.deferReply();
  
  try {
    const url = interaction.options.getString('url');
    const result = await deckService.fetchAndAnalyzeDeck(url);
    const message = deckService.formatAnalysisResult(result);
    
    await interaction.editReply(message);
  } catch (error) {
    await interaction.editReply(`❌ Error: ${error.message}`);
  }
}

async function handleBrackets(interaction) {
  const brackets = configManager.getBrackets();
  let message = '**Commander Brackets**\n\n';
  
  const sortedIds = Object.keys(brackets).map(Number).sort((a, b) => a - b);
  
  for (const id of sortedIds) {
    const bracket = brackets[id];
    message += `**Bracket ${id}: ${bracket.name}**\n`;
    message += `${bracket.description}\n`;
    message += `• Tutors: ${bracket.limits.tutors === Infinity ? '∞' : bracket.limits.tutors}\n`;
    message += `• Two-Card Combos: ${bracket.limits.twoCardCombos === Infinity ? '∞' : bracket.limits.twoCardCombos}\n`;
    message += `• Game Changers: ${bracket.limits.gameChangers === Infinity ? '∞' : bracket.limits.gameChangers}\n`;
    message += `• Land Denial: ${bracket.limits.landDenial === Infinity ? '∞' : bracket.limits.landDenial}\n\n`;
  }
  
  await interaction.reply(message);
}

async function handleBracket(interaction) {
  const id = interaction.options.getInteger('id');
  const bracket = configManager.getBracket(id);
  
  if (!bracket) {
    await interaction.reply(`❌ Bracket ${id} does not exist.`);
    return;
  }
  
  let message = `**Bracket ${id}: ${bracket.name}**\n`;
  message += `${bracket.description}\n\n`;
  message += `**Limits:**\n`;
  message += `• Tutors: ${bracket.limits.tutors === Infinity ? '∞' : bracket.limits.tutors}\n`;
  message += `• Two-Card Combos: ${bracket.limits.twoCardCombos === Infinity ? '∞' : bracket.limits.twoCardCombos}\n`;
  message += `• Game Changers: ${bracket.limits.gameChangers === Infinity ? '∞' : bracket.limits.gameChangers}\n`;
  message += `• Land Denial: ${bracket.limits.landDenial === Infinity ? '∞' : bracket.limits.landDenial}\n`;
  
  if (bracket.bannedCards && bracket.bannedCards.length > 0) {
    message += `\n**Bracket-Specific Bans:**\n`;
    message += bracket.bannedCards.map(card => `• ${card}`).join('\n');
  }
  
  await interaction.reply(message);
}

async function handleBracketAdd(interaction) {
  try {
    const id = interaction.options.getInteger('id');
    const name = interaction.options.getString('name');
    const description = interaction.options.getString('description');
    const tutors = interaction.options.getInteger('tutors');
    const combos = interaction.options.getInteger('combos');
    const gamechangers = interaction.options.getInteger('gamechangers');
    const landdenial = interaction.options.getInteger('landdenial');
    
    const bracketData = {
      name,
      description,
      limits: {
        tutors: tutors === -1 ? Infinity : tutors,
        twoCardCombos: combos === -1 ? Infinity : combos,
        gameChangers: gamechangers === -1 ? Infinity : gamechangers,
        landDenial: landdenial === -1 ? Infinity : landdenial
      },
      bannedCards: []
    };
    
    configManager.addBracket(id, bracketData);
    await interaction.reply(`✅ Successfully added Bracket ${id}: ${name}`);
  } catch (error) {
    await interaction.reply(`❌ Error: ${error.message}`);
  }
}

async function handleBracketUpdate(interaction) {
  try {
    const id = interaction.options.getInteger('id');
    const tutors = interaction.options.getInteger('tutors');
    const combos = interaction.options.getInteger('combos');
    const gamechangers = interaction.options.getInteger('gamechangers');
    const landdenial = interaction.options.getInteger('landdenial');
    
    const updates = { limits: {} };
    const bracket = configManager.getBracket(id);
    
    if (!bracket) {
      await interaction.reply(`❌ Bracket ${id} does not exist.`);
      return;
    }
    
    updates.limits = { ...bracket.limits };
    
    if (tutors !== null) updates.limits.tutors = tutors === -1 ? Infinity : tutors;
    if (combos !== null) updates.limits.twoCardCombos = combos === -1 ? Infinity : combos;
    if (gamechangers !== null) updates.limits.gameChangers = gamechangers === -1 ? Infinity : gamechangers;
    if (landdenial !== null) updates.limits.landDenial = landdenial === -1 ? Infinity : landdenial;
    
    configManager.updateBracket(id, updates);
    await interaction.reply(`✅ Successfully updated Bracket ${id}`);
  } catch (error) {
    await interaction.reply(`❌ Error: ${error.message}`);
  }
}

async function handleBracketRemove(interaction) {
  try {
    const id = interaction.options.getInteger('id');
    configManager.removeBracket(id);
    await interaction.reply(`✅ Successfully removed Bracket ${id}`);
  } catch (error) {
    await interaction.reply(`❌ Error: ${error.message}`);
  }
}

async function handleBan(interaction) {
  try {
    const card = interaction.options.getString('card');
    configManager.addGlobalBan(card);
    await interaction.reply(`✅ Successfully banned "${card}"`);
  } catch (error) {
    await interaction.reply(`❌ Error: ${error.message}`);
  }
}

async function handleUnban(interaction) {
  try {
    const card = interaction.options.getString('card');
    configManager.removeGlobalBan(card);
    await interaction.reply(`✅ Successfully unbanned "${card}"`);
  } catch (error) {
    await interaction.reply(`❌ Error: ${error.message}`);
  }
}

async function handleBanlist(interaction) {
  const banlist = configManager.getGlobalBans();
  
  if (banlist.length === 0) {
    await interaction.reply('No cards are globally banned.');
    return;
  }
  
  const chunks = [];
  let currentChunk = '**Global Ban List**\n\n';
  
  for (const card of banlist) {
    const line = `• ${card}\n`;
    if ((currentChunk + line).length > 1900) {
      chunks.push(currentChunk);
      currentChunk = line;
    } else {
      currentChunk += line;
    }
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  
  await interaction.reply(chunks[0]);
  
  for (let i = 1; i < chunks.length; i++) {
    await interaction.followUp(chunks[i]);
  }
}

async function handleCategoryAdd(interaction) {
  try {
    const category = interaction.options.getString('category');
    const card = interaction.options.getString('card');
    configManager.addCardToCategory(category, card);
    await interaction.reply(`✅ Successfully added "${card}" to ${category}`);
  } catch (error) {
    await interaction.reply(`❌ Error: ${error.message}`);
  }
}

async function handleCategoryRemove(interaction) {
  try {
    const category = interaction.options.getString('category');
    const card = interaction.options.getString('card');
    configManager.removeCardFromCategory(category, card);
    await interaction.reply(`✅ Successfully removed "${card}" from ${category}`);
  } catch (error) {
    await interaction.reply(`❌ Error: ${error.message}`);
  }
}

async function handleCategory(interaction) {
  const category = interaction.options.getString('category');
  const categories = configManager.getCardCategories();
  const cards = categories[category] || [];
  
  if (cards.length === 0) {
    await interaction.reply(`No cards in ${category} category.`);
    return;
  }
  
  const categoryName = category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  const chunks = [];
  let currentChunk = `**${categoryName}**\n\n`;
  
  for (const card of cards) {
    const line = `• ${card}\n`;
    if ((currentChunk + line).length > 1900) {
      chunks.push(currentChunk);
      currentChunk = line;
    } else {
      currentChunk += line;
    }
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  
  await interaction.reply(chunks[0]);
  
  for (let i = 1; i < chunks.length; i++) {
    await interaction.followUp(chunks[i]);
  }
}

async function handleReset(interaction) {
  try {
    configManager.resetToDefaults();
    await interaction.reply('✅ Successfully reset all brackets and bans to defaults');
  } catch (error) {
    await interaction.reply(`❌ Error: ${error.message}`);
  }
}

module.exports = {
  handleAnalyze,
  handleBrackets,
  handleBracket,
  handleBracketAdd,
  handleBracketUpdate,
  handleBracketRemove,
  handleBan,
  handleUnban,
  handleBanlist,
  handleCategoryAdd,
  handleCategoryRemove,
  handleCategory,
  handleReset
};
