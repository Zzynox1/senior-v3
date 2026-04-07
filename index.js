const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client({ checkUpdate: false });
const config = require('./config.json');

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await joinVC(client, config);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  const oldVoice = oldState.channelId;
  const newVoice = newState.channelId;

  if (oldVoice !== newVoice) {
    if (!newVoice) {
      // Re-join if kicked or disconnected
      if (oldState.member.id !== client.user.id) return;
      await joinVC(client, config);
    } else {
      // Ensure we stay in the target channel
      if (oldState.member.id !== client.user.id) return;
      if (newVoice !== config.Channel) {
         await joinVC(client, config);
      }
    }
  }
});

// This line checks Railway's "Variables" first, then the config file
client.login(process.env.TOKEN || config.Token);

async function joinVC(client, config) {
  const guildId = config.Guild;
  const guild = client.guilds.cache.get(guildId);
  const voiceChannel = guild.channels.cache.get(config.Channel || process.env.CHANNEL);
  
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: true
  });
}
