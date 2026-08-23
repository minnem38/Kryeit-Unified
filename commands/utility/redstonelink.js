const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('redstonelink')
        .setDescription('Gives you a unique item/block for your redstone links!'),
    async execute(interaction) {
        await interaction.deferReply();

        const blockResult = await request('https://n8n.deslimbos.nl/webhook/redstonelink', {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                user: interaction.user.id,
            }),
        });

        const { text } = await blockResult.body.json();

        await interaction.editReply({
            content: `Your item/block is ${text},  ${interaction.user.globalName}. Make sure to use this as frequency 1 in your redstone links to avoid interference with others!`
        });
    },
};