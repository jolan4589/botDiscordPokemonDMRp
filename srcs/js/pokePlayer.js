const Discord = require('discord.js')
const Utils = require('./utils.js')
const Ess = require('esserializer')
const PokeClass = require('./class.js')
const { ENGINE_METHOD_EC } = require('constants')

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

function fillPlayers(member, string, players) {
	let tmp = string.match(/([a-zA-Z][a-zA-Z _-]*[a-zA-Z] *:)*/gi)
	let temp = []
	let i
	let savePoke = require('../json/savePoke.json')
	
	temp = (temp = tmp.lastIndexOf(':')) != -1 ? tmp.substring(1, temp).match(/[a-zA-Z][a-zA-Z _-]*[a-zA-Z]/gi) : []
	i = -1
	savePoke = Object.keys( savePoke[member.guild.id])
	temp = temp.map(x => savePoke.find(elem => savePoke[elem].name == x))
	while ((i = temp.findIndex(elem => !elem)) != -1)
		temp.splice(i,1)
//	while (++i < temp.length) {
	//	temp[i] = Object.keys(savePoke).find(elem => savePoke[elem].name == temp[i])
//		temp = tmp.map(x => savePoke)
//	}
	if (!players.length)
		players = [member.id]
	return (players)
}

/**
 * Process
 * 	This process's used to interact with pokePlayer inventory.
 * It support multiple pokePlayer target, multiple object and parameters.
 * It support no mention and no item quantity.
 * Need following syntax for multiple argument without quantrity => Item, Item, Item, etc.
 * An item without specified quantity will set it a 1. Delete do not change with quantity.
 * No mention will set players at [member.id].
 * It support a mix of everything sais before => <@!userid1> <@!userid2>...<@!useridN> Item1 Quantity1 Item2,...ItemN quantityN.
 * 
 * @param {Array.<string>} method 		: Function to use.
 * @param {Discord.GuildMember} member 	: Member using function specified in Array.
 * @param {string} content 				: Message with eveery params.
 * @param {array.<string>} players 		: Mentionned players id list.
 * 
 * @returns {String}					: Message to send.
 */
exports.itemInteraction = function (method ,member, content, players) {
	let savePoke = require('../json/savePoke.json')
	let tmp = []
	let item = content.match(RegExp(`${method.reg}( *(<@![0-9]+>)?)* *`, 'gi')) // Set <item> from command to the end of mention list.

	item = item && item.length == 1 ? content.slice(item[0].length) : 0 // Set <item> to a substring from mentions end to end line.
	// Check every possible inpute errors.
	if (!Utils.isGm(member) && players.length)	// Rights one.
		return ("Erreur permissions : Vous ne pouvez pas faire ça.")
	if (!(savePoke = savePoke[member.guild.id]))	// No poke saved.
		return ("Erreur données : Aucun pokémon sauvegardé sur ce serveur.")
	if (!item)	// No item specified.
		return ("Erreur argument : Aucun objet renseigné.")
	// TODO : parser de players
	if (!(item = item.match(RegExp('([a-zA-Z][a-zA-Z _-]*[a-zA-Z]),?|([0-9]+)', 'gi'))) || !item.toString().match(/[a-zA-Z][a-zA-Z _-]*[a-zA-Z]/i)) // Item syntaxe.
		return ("Erreur syntaxe : L'objet doit être écrit sous la forme \"<nom objet> <quantité>.\"")
	if (!players.length) // Set player to [member.id] i ncase of no mention.
		players = [member.id]
	if (players.length > 1 && method.func.match('_set_move'))
		return ("Vous ne pouvez intéragir qu'avec les capacités d'un joueur à la fois.");
	players.forEach(player => {
		if (savePoke[player]) {
			let poke = Ess.deserialize(savePoke[player], [PokeClass.Pokemon, PokeClass.PokePlayer])	// Get pokemon save.
			let i = 0;
			let anItemAdded = false; // Used as controler.

			// Fill every items.
			while (i < item.length) {
				if (item[i].match(/[a-zA-Z][a-zA-Z _-]*[a-zA-Z]/i))
					anItemAdded = poke[method.func](item[i].replace(',', ''), i+1 < item.length && item[i+1].match(/[0-9]+/) ? item[1 + i++] : 1) ? true : anItemAdded	// parse item and quantity and used it in speficied method.
				i++;
			}
			if (anItemAdded)
				tmp.push(`<@!${player}>`)
			else
				return
			if (!Utils.save(Ess.serialize(poke), `${ROOT}/srcs/json/savePoke.json`, member.guild.id, player))	//save error
				return (`Une erreur est survenue. Veuillez réessayer. Si l'erreur persiste contactez un administrateur.`)
		}
	})
	let strMod = [] // Used as string modifier.
	strMod.push(item.toString().match(/[a-zA-Z][a-zA-Z _-]*[a-zA-Z]/gi).length > 1 || item[1] > 1 ? "s" : "")
	strMod.push(tmp.length > 1 ? (item[1] > 1 ? "leurs" : "leur") : (item[1] > 1 ? "ses" : "son"))
	strMod.push(tmp.length > 1 ? "ont" : "a")
	if (!tmp.length)
		return ("Erreur données : Aucun objet n'a été trouvé.")
	if (method.func.match("add"))
		return (`${tmp.toString()} ${strMod[2]} bien reçu ${strMod[1]} objet${strMod[0]}.`)
	if (method.func.match("drop"))
		return (`${strMod[0].length ? "Les " : "L'"}objet${strMod[0]} de ${tmp.toString()} ${strMod[0].length ? "ont" : strMod[2]} bien été utilisé${strMod[0]}`)
	if (method.func.match("delete"))
		return (`${strMod[0].length ? "Les " : "L'"}objet${strMod[0]} de ${tmp.toString()} ${strMod[2]} bien été supprimé${strMod[0]}.`)
	return ("SOMETHING WRONG APPREND!!")
}


exports.capacityInteraction = function(method ,member, content, players) {

}