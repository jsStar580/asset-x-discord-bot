const fs = require("node:fs");
const path = require("node:path");
const { Client, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

const { Captcha } = require("discord.js-captcha");

const captcha = new Captcha(client, {
  // roleID: "1236960404576403466", //optional
  channelID: "1237033785288167515", //optional
  sendToTextChannel: true, //optional, defaults to false
  // addRoleOnSuccess: true, //optional, defaults to true. whether you want the bot to add the role to the user if the captcha is solved
  kickOnFailure: true, //optional, defaults to true. whether you want the bot to kick the user if the captcha is failed
  caseSensitive: true, //optional, defaults to true. whether you want the captcha responses to be case-sensitive
  attempts: 3, //optional, defaults to 1. number of attempts before captcha is considered to be failed
  timeout: 60000, //optional, defaults to 60000. time the user has to solve the captcha on each attempt in milliseconds
  showAttemptCount: true, //optional, defaults to true. whether to show the number of attempts left in embed footer
  // customPromptEmbed: new EmbedBuilder(), //customise the embed that will be sent to the user when the captcha is requested
  // customSuccessEmbed: new EmbedBuilder(), //customise the embed that will be sent to the user when the captcha is solved
  // customFailureEmbed: new EmbedBuilder(), //customise the embed that will be sent to the user when they fail to solve the captcha
});

client.on("guildMemberAdd", async (member) => {
  //in your bot application in the dev portal, make sure you have intents turned on!
  captcha.present(member); //captcha is created by the package, and sent to the member
});

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(token);
