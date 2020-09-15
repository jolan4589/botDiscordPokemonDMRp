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