const Discord = require("discord.js");
const client = new Discord.Client();
const Markov = require('js-markov');
const salad = require('caesar-salad');
client.login(process.env.discord);

client.on("ready", () => {
	client.user.setActivity("Fake News", { type: "WATCHING"});
	anonymous = client.channels.get('656126149381849089');
})

const EmojiWhitelist = /[^\s|\n|\u200b|\u180B-\u180D\uFE00-\uFE0F|\uDB40[\uDD00-\uDDEF|\u00a9|\u00ae|\u2000-\u3300|\ud83c\ud000-\udfff|\ud83d\ud000-\udfff|\ud83e\ud000-\udfff]/g;
replaces = new Map();

client.on("message", (message) => {
    if(message.author.id === client.user.id) return;
	if(message.channel.type === "dm") {
		return anonymous.send(message.content);
	}
    switch(message.channel.id) {
		case "652623066677116948": // Apply Typoz to message
		    message.delete();
			message.channel.send(Typoifier(message.content));
			break;
		case "652854590911414283": // Reverse message
		    message.delete();
			message.channel.send(reverseString(message.content));
			break;
		case "652857164850790400": // Apply markov chain using message
		    message.delete();
			message.channel.send(MarkovRandom(message.content));
			break;
		case "652885633047461920": // Apply replaces
		    message.delete();
			Replaces(message);
			break;
		case "653315179756519434": // ROT47
		    message.delete();
			message.channel.send(salad.ROT47.Cipher().crypt(message.content));
			break;
		case "653320664274436140": // Text to Binary
		    message.delete();
			message.channel.send(Text2Bin(message.content));
			break;
		case "653329639477084160": // Seeds
		    message.delete();
			message.channel.send(Text2Seed(message.content));
			break;
		case "652643622356910090": // Remove message that are not in EmojiWhitelist
		    if(NotEmoji(message.content)) message.delete();
			message.channel.fetchMessages({limit: 35}).then(messages => {
			messages.forEach(msg => {
				if(NotEmoji(msg.content)) msg.delete();
			});
		});
	}
});

function Text2Bin(input) {
	return Array.from(input).map((each)=>each.codePointAt(0).toString(2)).join(" ");
}

function Text2Seed(input) {
	return input.replace(/\w/g, ":chestnut:").replace(" ", "  ");
}


function NotEmoji(string) {
  return EmojiWhitelist.test(string);
}

function Replaces(message) {
	if(!message.content.startsWith("/")) return ReplaceMessage(message);
	let command = message.content.split(" ")[0];
	switch(command) {
		case "/reset":
			return replaces.clear();
		case "/replace":
		    var data = message.content.substr(9).split(/@@@(.+)/);
			if(data.length === 3) {
				return replaces.set(data[0], data[1]);
			}
	}
	return ReplaceMessage(message);
}

function ReplaceMessage(message) {
	var content = message.content;
	replaces.forEach((value, key) => {
		content = content.replace(key, value);
	});
	message.channel.send(content);
}

function MarkovRandom(input) {
	var m = new Markov();
    m.addStates(input);
    m.train();
    return m.generateRandom();
}

function reverseString(str) {
    var splitString = str.split("");
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join("");
    return joinArray;
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
