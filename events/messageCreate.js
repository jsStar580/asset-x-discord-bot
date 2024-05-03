const { Collection } = require("discord.js");

const warnings = new Collection();

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (!message.guild) return;
    if (message.author.bot) return;
    console.log("============>: ", message.guild.roles);
    const linkRegex = new RegExp(
      "[a-zA-Zd]+://(w+:w+@)?([a-zA-Zd.-]+.[A-Za-z]{2,4})(:d+)?(/.*)?"
    );

    if (linkRegex.test(message.content)) {
      const channelId = message.channel;
      const user = message.author;

      message.delete();
      const existingWarning = warnings.get(message.author.id) || 0;
      await channelId.send(`Hey ${user}, links are not allowed to share.`);

      if (existingWarning && existingWarning >= 2) {
        // kick user
        const member = message.guild.members.cache.get(message.author.id);
        member.kick({ reason: "Link warnings exceeded limit" });

        warnings.delete(message.author.id);
      }
      warnings.set(message.author.id, existingWarning + 1);
    }
  },
};
