/** Class respresenting a pokemon type. */
class Type {
	/**
	 * Constructor :
	 *	Create a Type.
	 * @param {String} name 				: Type name.
	 * @param {Array.<String>} weakness 	: Wich type it not resist.
	 * @param {Array.<String>} neutrality 	: Which type it have neutral resistance.
	 * @param {Array.<String>} resistance 	: Wich type it resist.
	 * @param {Array.<String>} immunity 	: Wich type it have immunity.
	 */
	constructor(name, weakness, neutrality,	resistance, immunity) {
		this.name = name
		this.weakness = weakness
		this.neutrality = neutrality
		this.resistance = resistance
		this.immunity = immunity
	}
	/**
	 * Process
	 *	Used to knosw attack multiplier coefficient from specified atack type.
	 * @param {String} type 	: Attacker type.
	 */
	efficiency(type) {
		return (this.weakness.includes(type) ? 2 
			: (this.neutrality.includes(type) ? 1 
			: (this.resistance.includes(type) ? 0.5 
			: (this.immunity.includes(type) ? 0 
			: 0))))
	}
}

module.exports = Type