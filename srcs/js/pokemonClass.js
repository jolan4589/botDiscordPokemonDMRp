/** Class representing a pokemon. */
class Pokemon {
	/**
	 * Constructor
	 *	Create a Pokemon.
	 * @param {String} name 	: Unique name.
	 * @param {String} pokemon 	: Pokemon family name.
	 */
	constructor(name, pokemon) {
		this.name = name
		this.pokemon = pokemon
		this.moves = []	// move array |-> [string name, int powe_up, int pp_up].
		this.level = 5	// pokemon level based at 5.
	}

	/**
	 * Process
	 * 	Used to reset pokemon level and move list.
	 */
	_reset_poke() {
		this.level = 1
		this.moves = []
	}
	/**
	 * Process
	 *	Used to change pokemon name.
	 * @param {String} new_name	: New name.
	 */
	_rename(new_name) {
		this.name = new_name
	}
	/**
	 * Process
	 *	Used to set pokemon level to lv.
	 * @param {int} lv 
	 */
	_set_level(lv) {
		this.level = lv
	}
	/**
	 * Process
	 *	set a new move in this.moves at index position or at the end of the list if index wasn't specified.
	 * @param {array.<string, int, int>} move 	: Array respresenting a move. |-> ["nomve name", power_up, pp_up]
	 * @param {int} [index = -1]				: Place in mvoe array.
	 *
	 * @return {boolean}						: New value affected ?
	 */
	_set_move(move, index = -1)
	{
		
		if (index > 4)
			return(false)
		if (this.moves.length < 4 && this.moves.length < index)
			index = this.moves.length
		if (index > -1)
			this.moves[index] = move
		else if (this.moves.length < 4)
			this.moves.push(move)
		else
			return (false)
		return (true)
	}
}

module.exports = Pokemon