const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [
  // Analyze deck command
  new SlashCommandBuilder()
    .setName('analyze')
    .setDescription('Analyze a deck from Moxfield or Archidekt')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Deck URL from Moxfield or Archidekt')
        .setRequired(true)
    ),

  // List brackets command
  new SlashCommandBuilder()
    .setName('brackets')
    .setDescription('List all configured brackets'),

  // View specific bracket
  new SlashCommandBuilder()
    .setName('bracket')
    .setDescription('View details of a specific bracket')
    .addIntegerOption(option =>
      option.setName('id')
        .setDescription('Bracket ID')
        .setRequired(true)
    ),

  // Add bracket (admin only)
  new SlashCommandBuilder()
    .setName('bracket-add')
    .setDescription('Add a new bracket (Admin only)')
    .addIntegerOption(option =>
      option.setName('id')
        .setDescription('Bracket ID')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Bracket name')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Bracket description')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('tutors')
        .setDescription('Max tutors allowed (-1 for unlimited)')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('combos')
        .setDescription('Max two-card combos allowed (-1 for unlimited)')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('gamechangers')
        .setDescription('Max game changers allowed (-1 for unlimited)')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('landdenial')
        .setDescription('Max land denial cards allowed (-1 for unlimited)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  // Update bracket limits (admin only)
  new SlashCommandBuilder()
    .setName('bracket-update')
    .setDescription('Update bracket limits (Admin only)')
    .addIntegerOption(option =>
      option.setName('id')
        .setDescription('Bracket ID')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('tutors')
        .setDescription('Max tutors allowed (-1 for unlimited)')
    )
    .addIntegerOption(option =>
      option.setName('combos')
        .setDescription('Max two-card combos allowed (-1 for unlimited)')
    )
    .addIntegerOption(option =>
      option.setName('gamechangers')
        .setDescription('Max game changers allowed (-1 for unlimited)')
    )
    .addIntegerOption(option =>
      option.setName('landdenial')
        .setDescription('Max land denial cards allowed (-1 for unlimited)')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  // Remove bracket (admin only)
  new SlashCommandBuilder()
    .setName('bracket-remove')
    .setDescription('Remove a bracket (Admin only)')
    .addIntegerOption(option =>
      option.setName('id')
        .setDescription('Bracket ID')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  // Global ban card (admin only)
  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Add a card to the global ban list (Admin only)')
    .addStringOption(option =>
      option.setName('card')
        .setDescription('Card name')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  // Global unban card (admin only)
  new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Remove a card from the global ban list (Admin only)')
    .addStringOption(option =>
      option.setName('card')
        .setDescription('Card name')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  // List banned cards
  new SlashCommandBuilder()
    .setName('banlist')
    .setDescription('View the global ban list'),

  // Add card to category (admin only)
  new SlashCommandBuilder()
    .setName('category-add')
    .setDescription('Add a card to a category (Admin only)')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('Category name')
        .setRequired(true)
        .addChoices(
          { name: 'Tutors', value: 'tutors' },
          { name: 'Two-Card Combos', value: 'twoCardCombos' },
          { name: 'Game Changers', value: 'gameChangers' },
          { name: 'Land Denial', value: 'landDenial' }
        )
    )
    .addStringOption(option =>
      option.setName('card')
        .setDescription('Card name')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  // Remove card from category (admin only)
  new SlashCommandBuilder()
    .setName('category-remove')
    .setDescription('Remove a card from a category (Admin only)')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('Category name')
        .setRequired(true)
        .addChoices(
          { name: 'Tutors', value: 'tutors' },
          { name: 'Two-Card Combos', value: 'twoCardCombos' },
          { name: 'Game Changers', value: 'gameChangers' },
          { name: 'Land Denial', value: 'landDenial' }
        )
    )
    .addStringOption(option =>
      option.setName('card')
        .setDescription('Card name')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  // View category
  new SlashCommandBuilder()
    .setName('category')
    .setDescription('View cards in a category')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('Category name')
        .setRequired(true)
        .addChoices(
          { name: 'Tutors', value: 'tutors' },
          { name: 'Two-Card Combos', value: 'twoCardCombos' },
          { name: 'Game Changers', value: 'gameChangers' },
          { name: 'Land Denial', value: 'landDenial' }
        )
    ),

  // Reset to defaults (admin only)
  new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Reset all brackets and bans to defaults (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
];
