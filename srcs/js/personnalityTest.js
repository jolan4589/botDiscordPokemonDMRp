const Utils = require('./utils.js')
const Questions = require('../json/questions.json')
const Discord = require('discord.js')
const Classes = require("./class.js")
const Ess = require('esserializer')

/**
 * Load a new question for a specified user.
 * @param {object} [Personnality]personnalityObj	: Instance of current personnality test.
 */
function laodQuestion(personnalityObj) {
	let i = Utils.randomInt(Questions.length - 1)
	if (personnalityObj.questions.length == 15) i = Questions.length - 1
	while (personnalityObj.questions.includes(i))
		i = Utils.randomInt(Questions.length - 1)
	personnalityObj.questions.push(i)
	//Utils.save(personnalityObj, `${ROOT}/srcs/json/personnalityTestSave.json`, personnalityObj.id_server, personnalityObj.id_player)
	return (Questions[i])
}

/**
 * 
 * @param {object} [Personnality]personnalityObj	: Instance of current personnality test.
 */
function testResult(personnalityObj) {
	let tab = require('../json/testResult.json')
	let tmp = ["", 0]
	for (const [key, value] of Object.entries(personnalityObj)) {
		if (tmp[1] < value && !RegExp("(id_.*)|(questions)", "g").test(key)) {
			tmp[0] = key
			tmp[1] = value
		}
	}
	tmp[0] = "presse"
	return (`${tab[personnalityObj.sex][tmp[0]].length > 1 ? tab[personnalityObj.sex][tmp[0]][0] + " ou " + tab[personnalityObj.sex][tmp[0]][1] : tab[personnalityObj.sex][tmp[0]][0]}`)
}
exports.testResult = testResult

/**
 * 
 * Fill an embed with a new question for a specified user.
 * @param {object} [Personnality]personnalityObj	: Instance of personnality test class.
 * @return {object}	[MessageEmbed]					: New question.
 */
function personnalityTestEmbedFiller(personnalityObj, not_new = false) {
	const emb = new Discord.MessageEmbed()
	let question = !not_new ? laodQuestion(personnalityObj) : personnalityObj.questions[personnalityObj.questions.length - 1]
	let i = 1
	emb.setAuthor("TEST DE PERSONNALITE")
		.setTitle(`Question n°${personnalityObj.questions.length}.`)
		.setDescription(personnalityObj.sex ? `Félicitation.\nVous êtes un${personnalityObj.sexe == -1 ? "e" :""} superbe ${testResult(personnalityObj)}.` : question.entitled)
		.setColor(Utils.randomInt(16777215))
		.setFooter(`${personnalityObj.questions.length}/17`, )
	if (!personnalityObj.sex)
		question.replys.forEach(element => {
			emb.addField(
				`Réponse :${["one","two","three","four","five"].slice(i - 1, i)}: :`,
				element.entitled,
				false
			)
			i++
		})
	else {
		let temp = testResult(personnalityObj).match(/([a-zA-Z]+$)|(^[a-zA-Z]+)/g)
		emb.addField(
			"Réponse : 👎",
			"Je préfaire recommencer un test ou demander au staff de créer mon pokemon."
		)
		for (const i in temp) {
			emb.addField(
				`Réponse :${i == 0? "one" : "two"}:`,
				`Je garde ${temp[i]}.`
			)
		}
	}
	return (emb)
}

exports.ptEmbFiller = personnalityTestEmbedFiller

/**
 * Send the first personnality test message.
 * @param {Discord.Message}	msg	: Message with start command.
 */
function startTest(msg) {
	let test_save = require('../json/personnalityTestSave.json')
	let pokeSave = require('../json/savePoke.json')
	let personnalityObj = new Classes.Personnality(msg.author.id, msg.guild.id)

	if ((pokeSave = pokeSave[msg.guild.id]) && (pokeSave = pokeSave[msg.author.id])) {
		msg.channel.send("Vous avez déjà un pokémon sur ce server. Pour passer un nouveau test  vous devrez d'abord le supprimer avec la commande `deletPoke`")
		return (-1)
	}
	if (!Utils.save(personnalityObj, `${ROOT}/srcs/json/personnalityTestSave.json`, msg.guild.id, msg.author.id))
		return (0)
	msg.channel.send({
			content: `<@!${msg.author.id}>`,
			embed: new Discord.MessageEmbed({
				author: {
					name: "TEST DE PERSONNALITE"
				},
				description: "Pour connaître quel pokémon vous représente, vous devez répondre **sérieusement** à un test de 15 questions.\nCe test peut prendre quelques minutes à réaliser.\nLors ce que vous passerez ce test, veillez bien à ce que toutes les réactions soit visible avant de répondre.\n\nEtes vous prêt à commencer le test\n- Oui : 👍\n- Annuler : 👎"
			})
		})
		.then(message => {
			message.react('👍')
			message.react('👎')
		})
	return (1)
}

exports.startTest = startTest

/**
 * 
 * @param {int | string} id 
 * @param {int | string} guild_id 
 */
function deleteTest (id, guild_id) {
	let tmp = require('../json/personnalityTestSave.json')
	if (Object.keys(tmp).includes(guild_id))
		if (Object.keys(tmp[guild_id]).includes(id)) {
			delete tmp[guild_id][id]
			Utils.save(tmp, `${ROOT}/srcs/json/personnalityTestSave.json`)
		}
}
exports.deleteTest = deleteTest

/**
 * 
 * @param {int | string} guild_id 
 * @param {int | string} player_id 
 * @param {int | string} reply 
 */
function editNatureScore(guild_id, player_id, reply) {
	let player_save = require('../json/personnalityTestSave.json')[guild_id][player_id]
	if (player_save.sex)
		player_save.end = true
	Questions[player_save.questions[player_save.questions.length - 1]].replys[reply - 1].value.forEach(
		elem => {
			player_save[elem.nature] += elem.gain
		}
	)
	//Utils.save(player_save, `${ROOT}/srcs/json/personnalityTestSave.json`, guild_id, player_id)
	return (player_save)
}

/**
 * 
 * @param {Message} message 
 * @param {int} reply 
 */
exports.editQuestion = function (message, reply = 0) {
	if (reply)
		editNatureScore(message.guild.id, message.content.substring(3, message.content.length - 1), reply)
	let tmp = require('../json/personnalityTestSave.json')[message.guild.id][message.content.substring(3, message.content.length - 1)]
	message.reactions.removeAll()
	if (tmp.end) {
		let poke = testResult(tmp).match(/([a-zA-Z]+$)|(^[a-zA-Z]+)/g)[reply - 1]
		let new_poke = new Classes.PokePlayer(poke, poke, message.content.substring(3, message.content.length - 1))
		Utils.save(Ess.serialize(new_poke), `${ROOT}/srcs/json/savePoke.json`, message.guild.id, message.content.substring(3, message.content.length - 1))
		message.delete()
		deleteTest(tmp.id_player, tmp.id_server)
	}
	else
		message.edit({
			embed: personnalityTestEmbedFiller(tmp)
		})
		.then(msg => {
			if (tmp.sex)
				msg.react('👎')
			for (let i = 1; i <= (msg.embeds[0].fields.length - (tmp.sex ? 1 : 0)); i++) {
				msg.react(`${i}⃣`)
			}
		})
	Utils.save(tmp, `${ROOT}/srcs/json/personnalityTestSave.json`, tmp.id_server, tmp.id_player)
}