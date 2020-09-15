class Pokemon {
	constructor(name, pokemon) {
		this.name = name
		this.pokemon = pokemon
		this.capa = [["Charge", 0, 0], false, false, false]
		this.level = 5
		this.xp = 10 
		this.xpmax = this.xp + this.level
	}

	_reset_poke() {
		this.xp = 0
		this.xpmax = 1
		this.level = 1
		this.capa = [["Charge", 0, 0], false, false, false]
	}
	_rename(new_name) {
		this.name = new_name
	}
	gain_xp(xpadd) {
		this.xp += xpadd
		while (this.xp >= this.xpmax) {
			this.level++
			this.xpmax += this.level
		}
	}
	set_level(lv) {
		this._reset_poke()
		let i = 0
		while (++i < lv) {
			this.gain_xp(i)
		}
	}
}

module.exports = Pokemon