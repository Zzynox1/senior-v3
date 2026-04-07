const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
// FIXED: Added patchVoice: true and suspended user setting sync to prevent the 'all' crash
const client = new Client({ 
    checkUpdate: false,
    patchVoice: true,
    syncStatus: false 
});
const config = require('./config.json');

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await joinVC(client, config);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  if (oldState.member.id !== client.user.id) return;
  
  const targetChannel = process.env.CHANNEL || config.Channel;

  if (newState.channelId !== targetChannel) {
      console.log("Not in target channel, re-joining...");
      await joinVC(client, config);
  }
});

client.login(process.env.TOKEN || config.Token);

async function joinVC(client, config) {
  const guildId = process.env.GUILD || config.Guild;
  const channelId = process.env.CHANNEL || config.Channel;

  const guild = client.guilds.cache.get(guildId);
  if (!guild) return console.log("Guild not found!");

  const voiceChannel = guild.channels.cache.get(channelId);
  if (!voiceChannel) return console.log("Voice Channel not found!");

  try {
    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: true
    });
    console.log(`Successfully joined ${voiceChannel.name}`);
  } catch (err) {
    console.error("Error joining VC:", err);
  }
}
