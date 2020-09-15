/**
 * Class :
 *	Personnality
 *	This class's used on personnality tests and corresponding saves.
 */
class Personnality {
	constructor(id_player, id_server) {
		this.sex = 0
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
		this.questions = []
		this.id_player = id_player
		this.id_server = id_server
		this.end = false
	}
}

module.exports = Personnality