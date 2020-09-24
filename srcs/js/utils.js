const fs = require('fs')

/**
 * function :
 *	this function retun a str of n random, in range max, numbers.
 * 
 * @param {int} max	: max range ([1;max])
 */
exports.randomInt = function (max) {
	return Math.floor(Math.random() * Math.floor(max));
}

/**
 * function :
 *	return sum from 1 to n excluded.
 * @param {int} n	: range
 *
 * @return {sum}	: int result
 */
exports.sum1N = function (n) {
	let sum = 0
	for (let i = 1; i < n; i++)
		sum += i
	return (sum)
}

/**
 * Process :
 *	This process browse the object for every keyword in path and save add the data at the end.
 * @param {object} obj 
 * @param {*} data 
 * @param {...string} path
 *
 * @return {}
 */
function insertInObj(obj, data, ...path) {
	if (path.length < 1)
		return (obj = data)
	if (!obj[path[0]])
		obj[path[0]] = {}
	return (Object.defineProperty(obj, path[0], {value :insertInObj(obj[path[0]], data, ...(path.slice(1))), writable: true}))
}

/**
 * function :
 *	this function retun a str of n random, in range max, numbers.	
 * @param {undefined} data			: Undefinded type of data
 * @param {string} file				: Path of file to save
 * @param {string[]} path_in_file	: List of property before data placement
 *
 * @return {boolean} 				: True if save work correctly
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

exports.isGm = function (member) {
	let Gm = require('../json/gmList.json')
	if (member.hasPermission("ADMINISTRATOR"))
		return true
	if (Gm = Gm[member.guild.id] && Gm[member.guild.id].find(elem => elem == member.id))
		return (true)
	return false
}