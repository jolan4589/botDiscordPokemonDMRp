/*Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth = 1) {
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
      }, []);
    }
});*/

/* Projet root, usable everywhere */
global.ROOT = require('path').resolve(__dirname)

/* Requires */
const fs = require('fs')
const Discord = require('discord.js')
const Bot_inf = require('./srcs/json/botInf.json')
const Poke_class = require('./srcs/js/class.js')
const Utils = require('./srcs/js/utils.js')
const PersonnalityTest = require('./srcs/js/personnalityTest.js')

const Ess = require('esserializer')
const Personnality = require('./srcs/js/personnalityClass')

const Bot = new Discord.Client()

// Connection listener
Bot.on('ready', function () {
	console.log(`Successfully connected as ${Bot.user.username}\n-v ${Bot_inf.version} ${Bot_inf.stable?"stable":"unstable"}\nCreated by ${Bot_inf.creator.full_name}`)
})

// Message lsitener
Bot.on('message', msg => {
	let DifferentPrefix = Object.keys(Bot_inf.prefix).includes(msg.guild.id)
	if (!msg.author.bot) {
		if (RegExp(`^${Bot_inf.prefix[DifferentPrefix ? msg.guild.id : "default"].main}`).test(msg.content)) {
			if (RegExp('start-test'))
				if (!PersonnalityTest.startTest(msg))
					console.log("Error starting test!")
		}
	}


	if (msg.content == "Bonjour !" && !msg.author.bot)
		msg.channel.send("Bonjour !")
	if (RegExp("^test").test(msg.content)) {
		let temp = require('./srcs/json/testResult.json')
		let tmp = require('./srcs/json/personnalityTestSave.json')
		console.log(PersonnalityTest.testResult(require('./srcs/json/personnalityTestSave.json')["697708360283455499"]["227765280858701824"]))
	}
})

Bot.on("messageReactionAdd", async (reaction, user) => {
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;	 
		}
	}

	if (!user.bot) {
		if (reaction._emoji.name == '👎' && RegExp(`${user.id}`).test(reaction.message.content))
			reaction.message.delete(), PersonnalityTest.deleteTest(user.id, reaction.message.guild.id)
		else if (reaction._emoji.name == '👍' && RegExp(`${user.id}`).test(reaction.message.content))
			PersonnalityTest.editQuestion(reaction.message)
		else if (RegExp(reaction._emoji.name).test('1⃣ 2⃣ 3⃣ 4⃣ 5⃣')) /*{}⃣ */
			PersonnalityTest.editQuestion(reaction.message, reaction._emoji.name.match(/[1-5]/).toString())
		/*	message.reactions.removeAll(),
			for (const react in ["one","two","three","four","five"].slice(0, reaction.message.embed.fields.length)) {

			}
		)*/
	}
})

Bot.login(Bot_inf.token)

/*let rawdata = fs.readFileSync('student.json');
		let student = JSON.parse(rawdata);

		fs.readFile('student.json', (err, data) => {
			if (err) throw err;
			let student = JSON.parse(data);
			con"Sol"e.log(student);
		});

	exports.save = function(content, file) {
	const files = {
		bot: `${ROOT}/srcs/Bot.json`,
		embed: `${ROOT}/srcs/embed.json`,
		test: `${ROOT}/testfile.txt`,
		rpg: `${ROOT}/srcs/rpg.json`
	}
	if (Object.keys(files).includes(file)) {
		fs.writeFile(files[file], JSON.stringify(content), err => {
			if (err) {
				Utils.errorMessage('Error writting in' + files[file])
				return(false)
			}
			else {
				con"Sol"e.log('Success wrote in' + files[file])
			}
		})
		return(true)
	}
	else {
		con"Sol"e.log(`Error find file. Try with one of thoses : ${Object.keys(files)}`)
		return(false)
	}
}

		*/


/* Code for obtain all types in json after serialize

	let Vol = new Poke_class.Type("Vol",
		["Electrik", "Glace", "Roche"],
		["Acier", "Dragon", "Eau", "Fee", "Feu", "Normal", "Poison", "Psy", "Spectre", "Tenebres", "Vol"],
		["Plante", "Insecte", "Combat"],
		["Sol"])
	let Tenebres = new Poke_class.Type("Tenebres",
		["Combat", "Fee", "Insecte"],
		["Acier", "Dragon", "Eau", "Electrik", "Feu", "Glace", "Normal", "Plante", "Poison", "Roche", "Sol", "Vol"],
		["Tenebres", "Spectre"],
		["Psy"])
	let Spectre = new Poke_class.Type("Spectre",
		["Spectre", "Tenebres"],
		["Acier", "Dragon", "Eau", "Electrik", "Fee", "Feu", "Glace", "Plante", "Psy", "Roche", "Sol", "Vol"],
		["Poison", "Insecte"],
		["Combat", "Normal"])
	let Sol = new Poke_class.Type("Sol",
		["Eau", "Glace", "Plante"],
		["Acier", "Combat", "Dragon", "Fee", "Feu", "Insecte", "Normal", "Psy", "Sol", "Spectre", "Tenebres", "Vol"],
		["Poison", "Roche"],
		["Electrik"])
	let Roche = new Poke_class.Type("Roche",
		["Acier", "Combat", "Eau", "Plante", "Sol"],
		["Dragon", "Electrik", "Glace", "Insecte", "Psy", "Roche", "Spectre", "Tenebres"],
		["Feu", "Normal", "Poison", "Vol"],
		[])
	let Psy = new Poke_class.Type("Psy",
		["Insecte", "Spectre", "Tenebres"],
		["Acier", "Dragon", "Eau", "Electrik", "Fee", "Feu", "Glace", "Normal", "Plante", "Poison", "Roche", "Sol", "Vol"],
		["Combat", "Psy"],
		[])
	let Poison = new Poke_class.Type("Poison",
		["Psy", "Sol"],
		["Acier", "Dragon", "Eau", "Electrik", "Feu", "Glace", "Normal", "Roche", "Spectre", "Tenebres", "Vol"],
		["Combat", "Fee", "Insecte", "Plante", "Poison"],
		[])
	let Plante = new Poke_class.Type("Plante",
		["Feu", "Glace", "Insecte", "Poison", "Vol"],
		["Acier", "Combat", "Dragon", "Fee", "Normal", "Psy", "Roche", "Spectre", "Tenebres"],
		["Eau", "Electrik", "Plante", "Sol"],
		[])
	let Normal = new Poke_class.Type("Normal",
		["Combat"],
		["Acier", "Dragon", "Eau", "Electrik", "Fee", "Feu", "Glace", "Insecte", "Normal", "Plante", "Poison", "Psy", "Roche", "Sol", "Tenebres", "Vol"],
		[],
		["Spectre"])
	let Insecte = new Poke_class.Type("Insecte",
		["Feu", "Roche", "Vol"],
		["Acier", "Dragon", "Eau", "Electrik", "Fee", "Glace", "Insecte", "Normal", "Poison", "Psy", "Spectre", "Tenebres"],
		["Combat", "Plante", "Sol"],
		[])
	let Glace = new Poke_class.Type("Glace",
		["Acier", "Combat", "Feu", "Roche"],
		["Dragon", "Eau", "Electrik", "Fee", "Insecte", "Normal", "Plante", "Poison", "Psy", "Spectre", "Tenebres", "Vol"],
		["Glace"],
		[])
	let Feu = new Poke_class.Type("Feu",
		["Eau", "Roche", "Sol"],
		["Combat", "Dragon", "Electrik", "Normal", "Poison", "Psy", "Spectre", "Tenebres", "Vol"],
		["Acier", "Fee", "Feu", "Glace", "Insecte", "Plante"],
		[])
	let Fee = new Poke_class.Type("Fee",
		["Acier", "Poison"],
		["Eau", "Electrik", "Fee", "Feu", "Glace", "Normal", "Plante", "Psy", "Roche", "Sol", "Spectre", "Vol"],
		["Combat", "Insecte", "Tenebres"],
		["Dragon"])
	let Electrik = new Poke_class.Type("Electrik",
		["Sol"],
		["Combat", "Dragon", "Eau", "Fee", "Feu", "Glace", "Insecte", "Normal", "Plante", "Poison", "Psy", "Roche", "Spectre", "Tenebres"],
		["Acier", "Electrik", "Vol"],
		[])
	let Acier = new Poke_class.Type("Acier", 
		["Combat",  "Feu", "Sol"],
		["Eau", "Electrik", "Spectre", "Tenebres"],
		["Acier", "Dragon", "Fee", "Glace", "Insecte", "Normal", "Plante", "Psy", "Roche", "Vol"],
		["Poison"])
	let Combat = new Poke_class.Type("Combat",
		["Fee", "Psy", "Vol"],
		["Acier", "Combat", "Dragon", "Eau", "Electrik", "Feu", "Glace", "Normal", "Plante", "Poison", "Sol", "Spectre"],
		["Insecte", "Roche", "Tenebres"],
		[])
	let Dragon = new Poke_class.Type("Dragon",
		["Dragon", "Fee", "Glace"],
		["Acier", "Combat", "Insecte", "Normal", "Poison", "Psy", "Roche", "Sol", "Spectre", "Tenebres", "Vol"],
		["Eau", "Electrik", "Feu", "Plante"],
		[])
	let Eau = new Poke_class.Type("Eau",
		["Electrik", "Plante"],
		["Combat", "Dragon", "Fee", "Insecte", "Normal", "Poison", "Psy", "Roche", "Sol", "Spectre", "Tenebres", "Vol"],
		["Acier", "Eau", "Feu", "Glace"],
		[])

		let allType = {
			Vol: Ess.serialize(Vol),
			Acier: Ess.serialize(Acier),
			Combat: Ess.serialize(Combat),
			Dragon: Ess.serialize(Dragon),
			Eau: Ess.serialize(Eau),
			Electrik: Ess.serialize(Electrik),
			Fee: Ess.serialize(Fee),
			Feu: Ess.serialize(Feu),
			Glace: Ess.serialize(Glace),
			Insecte: Ess.serialize(Insecte),
			Normal: Ess.serialize(Normal),
			Plante: Ess.serialize(Plante),
			Poison: Ess.serialize(Poison),
			Psy: Ess.serialize(Psy),
			Roche: Ess.serialize(Roche),
			Sol: Ess.serialize(Sol),
			Spectre: Ess.serialize(Spectre),
			Tenebres: Ess.serialize(Tenebres)
		}
		fs.writeFile ("./srcs/json/types.json", JSON.stringify(allType), err => {
			if (err) console.log("Error writting")
			else console.log("Successly wrote")
		})

		Utilisation

		let temp = require('./srcs/json/types.json')
		console.log(temp[msg.content.substr(5)])
		console.log(Ess.deserialize(temp[msg.content.substr(5)], [Poke_class.Type]).efficiency("Acier"))
*/

/*MessageReaction {
	message: Message {
	  channel: TextChannel {
		type: 'text',
		deleted: false,
		id: '697708360732246057',
		name: 'general',
		rawPosition: 0,
		parentID: '697708360283455501',
		permissionOverwrites: Collection [Map] {},
		topic: null,
		lastMessageID: '753350112364724324',
		rateLimitPerUser: 0,
		lastPinTimestamp: null,
		guild: [Guild],
		messages: [MessageManager],
		nsfw: false,
		_typing: Map {}
	  },
	  deleted: false,
	  id: '753350112364724324',
	  type: 'DEFAULT',
	  system: false,
	  content: 'Un test est déjà en cours pour vous. Retrouvez le ou recommencez en un.',
	  author: ClientUser {
		id: '367257629166272512',
		username: 'Pokebot[^^]',
		bot: true,
		discriminator: '4719',
		avatar: '1fc8497ea8155a88483b37174e94d2aa',
		lastMessageID: '753350112364724324',
		lastMessageChannelID: '697708360732246057',
		verified: true,
		mfaEnabled: false,
		_typing: Map {},
		flags: [UserFlags]
	  },
	  pinned: false,
	  tts: false,
	  nonce: null,
	  embeds: [],
	  attachments: Collection [Map] {},
	  createdTimestamp: 1599683063356,
	  editedTimestamp: 0,
	  reactions: ReactionManager {
		cacheType: [class Collection extends Collection],
		cache: [Collection [Map]],
		message: [Circular]
	  },
	  mentions: MessageMentions {
		everyone: false,
		users: Collection [Map] {},
		roles: Collection [Map] {},
		_members: null,
		_channels: null,
		crosspostedChannels: Collection [Map] {}
	  },
	  webhookID: null,
	  application: null,
	  activity: null,
	  _edits: [],
	  flags: MessageFlags { bitfield: 0 },
	  reference: null
	},
	me: false,
	users: ReactionUserManager {
	  cacheType: [class Collection extends Collection],
	  cache: Collection [Map] { '227765280858701824' => [User] },
	  reaction: [Circular]
	},
	_emoji: ReactionEmoji {
	  animated: undefined,
	  name: '�',
	  id: null,
	  deleted: false,
	  reaction: [Circular]
	},
	count: 1
  }
  */