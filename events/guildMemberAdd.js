const { Events } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    if (member.user.bot == true) {
      member.kick({ reason: "Not allowed bots" });
      console.log("A bot is kicked.");

    } else {
      console.log("A new user is joined.");
    }
  },
};
