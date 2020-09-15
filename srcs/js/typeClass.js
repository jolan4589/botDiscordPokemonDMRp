class Type {
	constructor(name, weakness, neutrality,	resistance, immunity) {
		this.name = name
		this.weakness = weakness
		this.neutrality = neutrality
		this.resistance = resistance
		this.immunity = immunity
	}
	efficiency(type) {
		return (this.weakness.includes(type) ? 2 
			: (this.neutrality.includes(type) ? 1 
			: (this.resistance.includes(type) ? 0.5 
			: (this.immunity.includes(type) ? 0 
			: 0))))
	}
}

module.exports = Type