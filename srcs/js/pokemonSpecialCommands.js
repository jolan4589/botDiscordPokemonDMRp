exports.pokeEmbFiller = function(pokemon) {
	const emb = new Discord.MessageEmbed()
	emb.setAuthor("FICHE POKEMON")
		.setTitle(`${pokemon.pokemon}`)
		.setDescription(`${pokemon.name}`)
		.setColor(Utils.randomInt(16777215))
	question.replys.forEach(element => {
		emb.addField(
			`Réponse :${["one","two","three","four","five"].slice(i - 1, i)}: :`,
			element.entitled,
			false
		)
		i++
	})
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