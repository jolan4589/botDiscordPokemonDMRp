/** Class representing a personnality test instance. */
class Personnality {
	/**
	 * 
	 * @param {String} id_player 	: Player passing test id.
	 * @param {String} id_server 	: Server where this test's passed.
	 */
	constructor(id_player, id_server) {
		this.end = false
		this.sex = 0
		// Each test valuable nature.
		this.hardi = 0
		this.docile = 0
		this.jovial = 0
		this.malin = 0
		this.relax = 0
		this.brave = 0
		this.solo = 0
		this.presse = 0
		this.bizarre = 0
		this.timide = 0
		this.naif = 0
		this.malpoli = 0
		this.calme = 0
		// Question asked pool.
		this.questions = []
		this.id_player = id_player
		this.id_server = id_server
	}
}

module.exports = Personnality