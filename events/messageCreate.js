const { Collection } = require("discord.js");

const warnings = new Collection();
const adminsUserNames = ["suus_1991", "steakking"];

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (adminsUserNames.includes(message.author.username)) return;

    const linkRegex = new RegExp(
      "[a-zA-Zd]+://(w+:w+@)?([a-zA-Zd.-]+.[A-Za-z]{2,4})(:d+)?(/.*)?"
    );

    if (linkRegex.test(message.content)) {
      const channelId = message.channel;
      const user = message.author;
      try {
        await message.delete();
        const existingWarning = warnings.get(message.author.id) || 0;
        await channelId.send(`Hey ${user}, links are not allowed to share.`);

        if (existingWarning && existingWarning >= 2) {
          // kick user
          const member = message.guild.members.cache.get(message.author.id);
          await channelId.send(`${user} has been kicked off our server because he posted the link more than 3 times.`);
          await member.kick({ reason: "Link warnings exceeded limit" });

          warnings.delete(message.author.id);
        }
        warnings.set(message.author.id, existingWarning + 1);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  },
};
