const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { players } = require('../../playerblocks.json');
const { blocks } = require('../../blocks.json');
const playerBlockPath = path.join(__dirname, '../../playerblocks.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('redstonelink')
        .setDescription('Gives you a unique item/block for your redstone links!'),
    async execute(interaction) {
        await interaction.deferReply();
        let randomBlock
        const existingPlayer = players.find(p => p.discordId === interaction.user.id);
        if (existingPlayer) {
            randomBlock = existingPlayer.block;
        }
        else {
            randomBlock = blocks[Math.floor(Math.random() * blocks.length)];

            players.push({
                discordId: interaction.user.id,
                block: randomBlock
            });

            fs.writeFileSync(
                playerBlockPath,
                JSON.stringify({ players: players }, null, 2)
            );
        }

        await interaction.editReply({
            content: `Your item/block is ${randomBlock},  ${interaction.user.globalName}. Make sure to use this as frequency 1 in your redstone links to avoid interference with others!`
        });
    },
};