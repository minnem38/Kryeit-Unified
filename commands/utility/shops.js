const { SlashCommandBuilder } = require('discord.js');
const { items } = require('../../shops.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Searches for an item in the shops!')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('What item do you need?')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused().toLowerCase();
        const uniqueItems = [...new Set(items.map(s => s.item))];
        const filtered = uniqueItems.filter(item =>
        item.toLowerCase().includes(focusedValue)
        );
        await interaction.respond(
            filtered.slice(0, 25).map(item => ({name: item, value: item}))
        )
    },

    async execute(interaction) {
        await interaction.deferReply();
        const selectedItem = interaction.options.getString('item');
        const matchingShops = items.filter(entry => entry.item === selectedItem);
        matchingShops.sort((a, b) => b.itemsperironcoin - a.itemsperironcoin)
        const responseText = matchingShops.map((shop, index) => {
            return `#${index + 1}: **${shop.shop}** (at post **${shop.post}**) offers **${shop.itemsperironcoin}** of **${selectedItem}** for 1 iron coin, that does not always mean you can buy it in that amount.`;
        }).join('\n');

        await interaction.editReply({
            content: `**Cheapest shops for ${selectedItem}:** \n${responseText}`
        });

    }

}

