/** Class represinting a pokemon move. */
class Move {
	/**
	 * Constructor
	 *	Create a Move
	 * @param {String} name 		: move name
	 * @param {String} type 		: move type
	 * @param {String} category 	: caregory
	 * @param {int} pp 				: power point
	 * @param {int} power 			: move power
	 * @param {int} accuracy 		: move accurence (%)
	 */
	constructor(name, type, category, pp, power, accuracy) {
		this.name = name
		this.type = type
		this.category = category
		this.pp = pp
		this.power = power
		this.accuracy = accuracy
	}
}

module.exports = Move