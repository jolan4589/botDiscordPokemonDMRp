class Pokemon {
	constructor(name, pokemon) {
		this.name = name
		this.pokemon = pokemon
		/** move : [string name, int powe_up, int pp_up] */
		this.moves = []
		this.level = 5
	}

	_reset_poke() {
		this.level = 1
		this.moves = []
	}
	_rename(new_name) {
		this.name = new_name
	}
	_set_level(lv) {
		this.level = lv
	}
	_set_move(move, index = -1)
	{
		
		if (index > 4)
			return(false)
		if (this.moves.length < 4 && this.moves.length < index)
			index = this.moves.length
		if (index > -1) {
			this.moves[index] = move
		}
		else {
			this.moves.push(move)
		}
		return (true)
	}
}

module.exports = Pokemon