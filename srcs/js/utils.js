const fs = require('fs')

/**
 * function
 *	This function's used to get a random int Between 0 and max - 1 |-> [0; max-1]
 * 
 * @param {int} max	: Maximal range. ([0;max[)
 *
 * @return {int}	: Random between 0 and max - 1.
 */
exports.randomInt = function (max) {
	return Math.floor(Math.random() * Math.floor(max));
}

/**
 * function
 *	Used to get sum from 1 to n, n excluded.
 * @param {int} n	: Range
 *
 * @return {int}	: Sum from 1 to N excluded.
 */
exports.sum1N = function (n) {
	let sum = 0
	
	for (let i = 1; i < n; i++)
		sum += i
	return (sum)
}

/**
 * Process
 *	This process browse the object for every keyword in path and add the data at the end of path.
 * @param {object} obj 		: Object to modify.
 * @param {*} data 			: Undefined type data to add.
 * @param {...string} path 	: Path to browse.
 *
 * @return {object}			: Modified object.
 */
function insertInObj(obj, data, ...path) {
	if (path.length < 1)
		return (obj = data)
	if (!obj[path[0]])
		obj[path[0]] = {}
	return (Object.defineProperty(obj, path[0], {value :insertInObj(obj[path[0]], data, ...(path.slice(1))), writable: true}))
}

/**
 * Process
 *	This process's used to save a data on json file.	
 * @param {*} data						: Undefined type data to save.
 * @param {string} file					: Path of file to save.
 * @param {Array.<String>} path_in_file	: Path to browse.
 *
 * @return {boolean} 					: True if save worked correctly
 */
exports.save = function (data, file, ...path_in_file)
{
	let tmp = require(file)

	tmp = insertInObj(tmp, data, ...path_in_file)
	fs.writeFile(file, JSON.stringify(tmp), err => {
		console.log(`${err ? "Error writting" : "Succes wrote"} in ${file}`)
		return (!err)
	})
	return (true)
}

/**
 * Process
 *	Used to know if specified guild member have GM rights on this server.
 * @param {Discord.GuildUser} member 
 */
exports.isGm = function (member) {
	let Gm = require('../json/gmList.json')

	if (member.hasPermission("ADMINISTRATOR"))
		return true
	if (Gm = Gm[member.guild.id] && Gm[member.guild.id].find(elem => elem == member.id))
		return (true)
	return false
}