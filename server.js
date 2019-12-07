const Discord = require("discord.js");
const client = new Discord.Client();
client.login(process.env.discord);

const EmojiWhitelist = /[^\s|\n|\u200b|\u180B-\u180D\uFE00-\uFE0F|\uDB40[\uDD00-\uDDEF|\u00a9|\u00ae|\u2000-\u3300|\ud83c\ud000-\udfff|\ud83d\ud000-\udfff|\ud83e\ud000-\udfff]/g;

client.on("message", (message) => {
    if(message.author.id === client.user.id) return;
    switch(message.channel.id) {
		case "652623066677116948":
		    message.delete();
			message.channel.send(Typoifier(message.content));
			break;
		case "652643622356910090":
			if(NotEmoji(message.content)) message.delete();
	}
});

function NotEmoji(string) {
  return EmojiWhitelist.test(string);
}

function getRandom(max) {
    return Math.floor((Math.random() * 10) % max)
}

function AtPos(str, position, newStr) {
    return str.slice(0, position) + newStr + str.slice(position);
}

function Typoifier(str) {
    if (str.length === 0) return
    let words = str.split(" ");
    words.forEach((word, index) => {
        if (word.length === 0) return
        if (getRandom(2)) words[index] = Typo(word);
    })
    return words.join(" ");
}

function Typo(word) {
    let index = getRandom(word.length);
    let letter = word[index];
    let newString = AtPos(word, index, letter);
    if (getRandom(2)) newString = AtPos(newString, index, letter);
    return newString;
}
