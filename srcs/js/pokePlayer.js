const Discord = require('discord.js')
const Utils = require('./utils.js')
const Ess = require('esserializer')
const PokeClass = require('./class.js')

/**
 * Error type :
 * 	arguments		-> passed agrument not welled formated
 * 	permissions		-> user haven't correesping rights
 * 	données			-> no data found in json files
 */

/**
 * Process
 * 	This process return an embed filled with pokemon information corresponding to specified player.
 * 	This embed represent the inventory from corresponding pokemon.
 * 
 * @param {Discord.GuildMember}member		: User trying to show an inventory.
 * @param {Array.<String>}player_id 		: User whose pokemon inventory <member> want to see
 * 
 * @return  {Discord.MessageEmbed|String}	: If an error occured, string describing it. Otherwise filled embed.
 */
exports.showInv = function (member, player_id) {
	let poke = require('../json/savePoke.json')
	let emb = new Discord.MessageEmbed()

	if (player_id.length != 1)	// Only one inventory at once.
		return ("Erreur arguments : Vous ne pouvez afficher l'inventaire que d'un seul joueur à la fois.")
	player_id = player_id.toString()	// Change tab to usable string.
	if (member.id != player_id && !Utils.isGm(member))	// A non GameMaster user can only see his own inventory.
		return ("Erreur permissions : Vous ne pouvez pas faire ça.")
	if (!(poke = poke[member.guild.id]) || !(poke = poke[player_id]))	// Specified user  have a pokemon saved on this server.
		return ("Erreur données : Aucun pokemon trouvé")
	poke = Ess.deserialize(poke, [PokeClass.Pokemon, PokeClass.PokePlayer]) // Reload savePoke as PokePlayer object.
	/** Embed FIlling */
	emb.setTitle('**INVENTAIRE**')
		.setDescription(`${member.id == player_id ? "Voici ton inventaire" : "Voici l'inventaire de"} ${poke.name}.`)
		.setColor(Utils.randomInt(16777215))
		.setFooter(`${poke.money} poké`)
	poke.inventory.forEach(elem => {
		let type = elem[0].match(/baie|graine/i)
		let field

		if (!type)
			type = ["autre"]
		if (-1 != (field = emb.fields.findIndex(element => element.name.match(RegExp(type, 'i'))))) // Modifi existant field if current elem has same type as already loaded item.
			emb.fields[field].value = emb.fields[field].value.concat(`\n- ${elem[0]}\t[${elem[1]}]`)		
		else { // Otherwise, it add new coresponding type file
			emb.addField(
				type.toString().toUpperCase() + " :",
				`- ${elem[0]}\t[${elem[1]}]`
			)
		}
	})
	if (!emb.fields.length) // In case of none file added, it crate one to say it.
		emb.addField('Information :', 'Cet Inventaire est vide.')
	return (emb)
}

/**
 * Process
 * 	Following process used to add item in pokemon inventory corresponding to specified player.
 * TODO : Faire les commentaires ligne par ligne.
 * @param {Discord.GuildMember} member		: User trying to give an item.
 * @param {String} content 					: Used command without prefix.
 * @param {Array.<Discord.User>} players		: Players which <member> want add items to their pokemon.
 * 
 * @return {string}							: If an error occured, it describe it. Otherwise it's a succes ad.
 */
exports.giveItem = function (member, content, players) {
	let savePoke = require('../json/savePoke.json')
	let tmp = []
	let temp = content.match(RegExp("give[ \-\_]?item( *(<@![0-9]+>)?)* *", 'gi'))
	let item = temp && temp.length == 1 ? content.slice(temp[0].length) : 0

	if (!Utils.isGm(member))
		return ("Erreur permissions : Vous ne pouvez pas faire ça.")
	if (!(savePoke = savePoke[member.guild.id]))
		return ("Erreur données : Aucun pokémon sauvegardé sur ce serveur.")
	if (!item)
		return ("Erreur argument : Aucun objet renseigné.")
	if (!(item = item.match(RegExp('([a-zA-Z][a-zA-Z _-]*[a-zA-Z])|([0-9]+)', 'gi'))) || item.length != 2) {
		return ("Erreur syntaxe : L'objet doit être écrit sous la forme \"<nom objet> <quantité>.\"")
	}
	if (!players.length)
		players = [member.id]
	players.forEach(player => {
		if (savePoke[player]) {
			let poke = Ess.deserialize(savePoke[player], [PokeClass.Pokemon, PokeClass.PokePlayer])
			poke.add_item(...item)
			if (!Utils.save(Ess.serialize(poke), `${ROOT}/srcs/json/savePoke.json`, member.guild.id, player))
				return (`Une erreur est survenue. Veuillez réessayer. Si l'erreur persiste contactez un administrateur.`)
			tmp.push(`<@!${player}>`)
		}
	})
	return (tmp.length ? `${tmp.toString()} ${tmp.length > 1 ? "ont" : "a"} bien reçu ${tmp.length > 1 ? (item[1] > 1 ? "leurs" : "leur") : (item[1] > 1 ? "ses" : "son")} objet${(item[1] > 1 ? "s" : "")}.` : "Aucun pokémon trouvé.")
}

/**
 * Process
 * 	This process is used to delete the specified player pokemon.
 * TODO : Faire les commentaires lignes par ligne.
 * 
 * @param {GuildMember} member		: User trying to delet a pokemon.
 * @param {array.<string>} mention 	: Tab containing the identifier of each poke-owner user whose <member> tries to delete the pokemon.
 */
exports.deletePoke = function (member, player) {
	let savePoke = require('../json/savePoke.json')
	let tmp = []

	if (!Utils.isGm(member))
		if (player.length == 1 && member.id != player[0])
			return ("Erreur permissions : Vous n'avez pas les droits pour faire cela.")
	if (!(savePoke = savePoke[member.guild.id]))
		return ("Erreur données : Aucun pokémon sauvegardé sur ce serveur.")
	if (!player.length)
		player = [member.id]
	player.forEach(player => {
		if (savePoke[player]) {
			delete savePoke[player]
			tmp.push(`<@!${player}>`)
		}
	})
	if (!tmp.length)
		return ("Erreur données : Aucun pokémon n'a été trouvé.")
	if (Utils.save(savePoke, `${ROOT}/srcs/json/savePoke.json`, member.guild.id))
		return (`Le${tmp.length > 1 ? "s": ""} pokemon${tmp.length > 1 ? "s": ""} de ${tmp.toString()} ${tmp.length > 1 ? "ont": "a"} bien été supprimé${tmp.length > 1 ? "s": ""}.`)
	return (`Une erreur est survenue. Veuillez réessayer. Si l'erreur persiste contactez un administrateur.`)
}

/**
les arts : https://pokemondb.net/pokedex/national
le test de personnalité : https://www.pokebip.com/page/jeuxvideo/pokemon_donjon_mystere_3_explorateurs_du_ciel/questions_starter

{
  "embed": {
    "title": "Aldan",
    "description": "Balbuto",
    "color": 15794533,
    "image": {
      "url": "https://img.pokemondb.net/artwork/ivysaur.jpg"
    },
    "author": {
      "name": "FICHE POKEMON"
    },
    "fields": [
      {
        "name": "Capacities",
        "value": "- Capa 1\n- Capa 2\n- Capa 3\n- Capa 4",
        "inline" : true
      },
      {
        "name": "Inventory",
        "value": "- Baie Oran\n- Explograine\n- Petrygraine",
        "inline": true
      }
    ]
  }
}
*/