const Discord = require("discord.js");
const client = new Discord.Client();
const Markov = require('js-markov');
const salad = require('caesar-salad');
client.login(process.env.discord);

client.on("ready", () => {
	client.user.setActivity("Fake News", { type: "WATCHING"});
	anonymous = client.channels.get('656126149381849089');
})

const EmojiWhitelist = /[^\s|\n|\u{200b}|\u{180B}-\u{180D}\u{FE00}-\u{FE0F}|\u{DB40}|\u{DD00}-\u{DDEF}|\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/u
const FormatingOnly = /[^\s|\n|\u00A0|\u1CBB|\u1CBA|\u2000-\u2009|\u2028|\u202A-\u202f|\u205F|\uFEFF|\uFEEC-\uFEEF|\uFEF0-\uFEF5|\u200-\u200f|\u180B-\u180D\uFE00-\uFE0F|\uDB40|\uDD00-\uDDEF]/;

const seed = ":chestnut:";

replaces = new Map();

client.on('messageUpdate', (old, message) => {
	switch(message.channel.id) {
		case "652643622356910090": // Remove edited message that are not in EmojiWhitelist
			EmojiOnly(message);
	};
});

function EmojiOnly(message) {
	if(NotEmoji(message.content)) message.delete();
	message.channel.fetchMessages({limit: 35}).then(messages => {
		messages.forEach(msg => {
			if(NotEmoji(msg.content)) msg.delete();
		});
	});
}

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
			let result = Text2Seed(message.content);
			if(result.includes(seed)) message.channel.send(result);
			break;
		case "652643622356910090": // Remove message that are not in EmojiWhitelist
			EmojiOnly(message);
	};
});

function Text2Bin(input) {
	return Array.from(input).map((each)=>each.codePointAt(0).toString(2)).join(" ");
}

function Text2Seed(input) {
	return input.replace(/\w/g, seed).replace(" ", "  ");
}


function NotEmoji(string) {
  if(EmojiWhitelist.test(string)) return true;
  return (!FormatingOnly.test(string))
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
