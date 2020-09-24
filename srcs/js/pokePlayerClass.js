const Utils = require('./utils.js')
const Pokemon = require('./pokemonClass.js')

class PokePlayer extends Pokemon {
	constructor(name, pokemon, owner) {
		super(name, pokemon)
		this.owner = owner
		this.inventory = []
		this.money = 1000
		this.xp = Utils.sum1N(this.level)
		this.max_xp = this.xp + this.level
	}

	// Super methods
	_reset_poke() {
		super._reset_poke()
		this.money = 0
		this.inventory = []
		this.xp = 1
		this.max_xp = 1
	}
	_rename(name) {
		super._rename(name)
	}
	_set_level(lv) {
		super._set_level(lv)
		this.xp = Utils.sum1N(lv)
	}
	_set_name(name) {
		super.set_name(name)
	}
	_set_move(move, index = -1) {
		super._set_move(move, index)
	}
	
	/** New methods */
	gain_xp(xpadd) {
		this.xp += xpadd
		while (this.xp >= this.max_xp) {
			this.level++
			this.max_xp += this.level
		}
	}
	// new function
	add_item(item, quantity) {
		let tmp = this.inventory.findIndex(elem => elem[0] == item)
		
		if (tmp > -1)
			this.inventory[tmp][1] = parseInt(this.inventory[tmp][1]) + parseInt(quantity)
		else 
			this.inventory.push([item, quantity])
		return true
	}
	drop_item(item, quantity) {
		let index = this.inventory.findIndex(elem => Array.isArray(elem) ? elem[0] == item : false)
		if (index >= 0)
			if (quantity >= this.inventory[index][1])
				this.inventory.splice(index, 1)
			else
				this.inventory[index][1] -= quantity
		else
			return (false)
		return (true)
	}
	delet_item(item) {
		this.drop_item(item, Infinity)
	}
}

module.exports = PokePlayer