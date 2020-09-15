const Pokemon = require('./pokemonClass.js')

class PokePlayer extends Pokemon {
	constructor(name, pokemon, owner) {
		super(name, pokemon)
		this.owner = owner
		this.inventory = []
		this.money = 1000
	}
	// super function

	// new function
	add_item(item, quantity) {
		let tmp = this.inventory.findIndex(elem => Array.isArray(elem) ? elem[0] == item : false)
		console.log(tmp)
		if ((!tmp && tmp != 0) || tmp < -1)
			return false
		
		if (tmp > -1)
			this.inventory[tmp][1] += quantity
		
		else 
			this.inventory.push([item, quantity])
		
		return true
	}

	drop_item(item, quantity) {
		let tmp = this.inventory.findIndex(elem => Array.isArray(elem) ? elem[0] == item : false)
		console.log(tmp)
		if ((!tmp && tmp != 0) || tmp < 0)
			return false
		else
			this.inventory[tmp][1] -= quantity
		return (true)
	}
}

module.exports = PokePlayer