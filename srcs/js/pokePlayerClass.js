const Utils = require('./utils.js')
const Pokemon = require('./pokemonClass.js')

/** Class repreesenting a player. */
class PokePlayer extends Pokemon {
	/**
	 * Constructor
	 *	Create a PokePlayer.
	 * @param {String} name 	: Unique name.
	 * @param {String} pokemon 	: Pokemon family name.
	 * @param {String} owner 	: Owner personnal id.
	 */
	constructor(name, pokemon, owner) {
		/** Super constructor. */
		super(name, pokemon)
		this.owner = owner
		this.inventory = []
		this.money = 1000
		this.xp = Utils.sum1N(this.level)
		this.max_xp = this.xp + this.level
	}

	// Super methods
	/**
	 * Process
	 * 	Used to reset pokemon level, move list, money, inventory list, xp and xp max.
	 */
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
	/**
	 * Process
	 *	Used to set pokemon level to lv and set his xp too.
	 * @param {int} lv 
	 */
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
	/**
	 * Process
	 *	Used to add xp to a player.
	 * @param {int} xpadd 	: Xp gain value.
	 */
	gain_xp(xpadd) {
		this.xp += xpadd
		while (this.xp >= this.max_xp) {	// Level up while xp exed max_xp.
			this.level++
			this.max_xp += this.level
		}
	}
	/**
	 * Process
	 *	Used to add item to a player inventory.
	 * @param {String} item 	: Item name to add.
	 * @param {int} quantity 	: Number of item to add.
	 */
	add_item(item, quantity) {
		let index = this.inventory.findIndex(elem => elem[0] == item)

		if (index > -1)
			this.inventory[index][1] = parseInt(this.inventory[index][1]) + parseInt(quantity)
		else
			this.inventory.push([item, quantity])
		return (true)
	}
	/**
	 * Process
	 *	Used to drop <quantity> item named <item> from player inventory.
	 * @param {String} item 	: Item name to drop.
	 * @param {int} quantity 	: Number of item to drop.
	 *
	 * @return {boolean}		: Have this process well worked ?
	 */
	drop_item(item, quantity) {
		let index = this.inventory.findIndex(elem => elem[0] == item)
		if (index >= 0)
			if (quantity >= this.inventory[index][1])
				this.inventory.splice(index, 1)
		else
			this.inventory[index][1] -= quantity
		else
			return (false)
		return (true)
	}
	/**
	 * Process
	 *	Used to delet an item with drop_item processs.
	 * @param {String} item 	: Item name to delete.
	 *	 
	 * @return {boolean}		: Have this process well worked ?
	 */
	delete_item(item, ...NOONECARE) {
		return (this.drop_item(item, Infinity))
	}
}

module.exports = PokePlayer