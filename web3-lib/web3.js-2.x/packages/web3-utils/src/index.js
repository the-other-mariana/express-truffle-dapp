/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file Utils.js
 * @author Marek Kotewicz <marek@parity.io>
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import * as utils from './Utils';
import * as ethjsUnit from 'ethjs-unit';
import Hash from 'eth-lib/lib/hash';
import randombytes from 'randombytes';

export BN from 'bn.js';
export {soliditySha3} from './SoliditySha3';

/**
 * Returns a random hex string by the given bytes size
 *
 * @param {Number} size
 *
 * @returns {string}
 */
export const randomHex = (size) => {
    return '0x' + randombytes(size).toString('hex');
};

/**
 * Should be used to create full function/event name from json abi
 *
 * @method jsonInterfaceMethodToString
 *
 * @param {Object} json
 *
 * @returns {String} full function/event name
 */
export const jsonInterfaceMethodToString = (json) => {
    if (isObject(json) && json.name && json.name.includes('(')) {
        return json.name;
    }

    return `${json.name}(${_flattenTypes(false, json.inputs).join(',')})`;
};

/**
 * Should be used to flatten json abi inputs/outputs into an array of type-representing-strings
 *
 * @method _flattenTypes
 *
 * @param {Boolean} includeTuple
 * @param {Object} puts
 *
 * @returns {Array} parameters as strings
 */
const _flattenTypes = (includeTuple, puts) => {
    // console.log("entered _flattenTypes. inputs/outputs: " + puts)
    const types = [];

    puts.forEach((param) => {
        if (typeof param.components === 'object') {
            if (param.type.substring(0, 5) !== 'tuple') {
                throw new Error('components found but type is not tuple; report on GitHub');
            }
            let suffix = '';
            const arrayBracket = param.type.indexOf('[');
            if (arrayBracket >= 0) {
                suffix = param.type.substring(arrayBracket);
            }
            const result = _flattenTypes(includeTuple, param.components);
            // console.log("result should have things: " + result)
            if (isArray(result) && includeTuple) {
                // console.log("include tuple word, and its an array. joining...: " + result.types)
                types.push(`tuple(${result.join(',')})${suffix}`);
            } else if (!includeTuple) {
                // console.log("don't include tuple, but its an array. joining...: " + result)
                types.push(`(${result.join(',')})${suffix}`);
            } else {
                // console.log("its a single type within a tuple: " + result.types)
                types.push(`(${result})`);
            }
        } else {
            // console.log("its a type and not directly in a tuple: " + param.type)
            types.push(param.type);
        }
    });

    return types;
};

/**
 * Should be called to get ascii from it's hex representation
 *
 * @method hexToAscii
 *
 * @param {String} hex
 *
 * @returns {String} ascii string representation of hex value
 */
export const hexToAscii = (hex) => {
    if (!utils.isHexStrict(hex)) throw new Error('The parameter must be a valid HEX string.');

    let value = '';

    let i = 0;
    const l = hex.length;

    if (hex.substring(0, 2) === '0x') {
        i = 2;
    }
    for (; i < l; i += 2) {
        const code = parseInt(hex.substr(i, 2), 16);
        value += String.fromCharCode(code);
    }

    return value;
};

/**
 * Should be called to get hex representation (prefixed by 0x) of ascii string
 *
 * @method asciiToHex
 *
 * @param {String} value
 * @param {Number} length
 *
 * @returns {String} hex representation of input string
 */
export const asciiToHex = (value, length = 32) => {
    let hex = '';

    for (let i = 0; i < value.length; i++) {
        const code = value.charCodeAt(i);
        const n = code.toString(16);
        hex += n.length < 2 ? `0${n}` : n;
    }

    return '0x' + utils.rightPad(hex, length * 2);
};

/**
 * Returns value of unit in Wei
 *
 * @method getUnitValue
 *
 * @param {String} unit the unit to convert to, default ether
 *
 * @returns {BN} value of the unit (in Wei)
 * @throws error if the unit is not correct
 */
export const getUnitValue = (unit) => {
    unit = unit ? unit.toLowerCase() : 'ether';
    if (!ethjsUnit.unitMap[unit]) {
        throw new Error(
            `This unit "${unit}" doesn't exist, please use the one of the following units${JSON.stringify(
                ethjsUnit.unitMap,
                null,
                2
            )}`
        );
    }

    return unit;
};

/**
 * Takes a number of wei and converts it to any other ether unit.
 *
 * Possible units are:
 *   SI Short   SI Full        Effigy       Other
 * - kwei       femtoether     babbage
 * - mwei       picoether      lovelace
 * - gwei       nanoether      shannon      nano
 * - --         microether     szabo        micro
 * - --         milliether     finney       milli
 * - ether      --             --
 * - kether                    --           grand
 * - mether
 * - gether
 * - tether
 *
 * @method fromWei
 *
 * @param {String|BN} number can be a BigNumber, number string or a HEX of a decimal
 * @param {String} unit the unit to convert to, default ether
 *
 * @returns {String} Returns a string
 */
export const fromWei = (number, unit) => {
    unit = getUnitValue(unit);

    if (!utils.isBN(number) && !isString(number)) {
        throw new Error('Please pass numbers as strings or BN objects to avoid precision errors.');
    }

    return utils.isBN(number) ? ethjsUnit.fromWei(number, unit) : ethjsUnit.fromWei(number, unit).toString(10);
};

/**
 * Takes a number of a unit and converts it to wei.
 *
 * Possible units are:
 *   SI Short   SI Full        Effigy       Other
 * - kwei       femtoether     babbage
 * - mwei       picoether      lovelace
 * - gwei       nanoether      shannon      nano
 * - --         microether     szabo        micro
 * - --         microether     szabo        micro
 * - --         milliether     finney       milli
 * - ether      --             --
 * - kether                    --           grand
 * - mether
 * - gether
 * - tether
 *
 * @method toWei
 *
 * @param {String|BN} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert from, default ether
 *
 * @returns {String|BN} When given a BN object it returns one as well, otherwise a string
 */
export const toWei = (number, unit) => {
    unit = getUnitValue(unit);

    if (!utils.isBN(number) && !isString(number)) {
        throw new Error('Please pass numbers as strings or BN objects to avoid precision errors.');
    }

    return utils.isBN(number) ? ethjsUnit.toWei(number, unit) : ethjsUnit.toWei(number, unit).toString(10);
};

/**
 * Converts to a checksum address
 *
 * @method toChecksumAddress
 *
 * @param {string} address the given HEX address
 *
 * @param {number} chain where checksummed address should be valid.
 *
 * @returns {string} address with checksum applied.
 */
export const toChecksumAddress = (address, chainId = null) => {
    if (typeof address !== 'string') {
        return '';
    }

    if (!/^(0x)?[0-9a-f]{40}$/i.test(address))
        throw new Error(`Given address "${address}" is not a valid Ethereum address.`);

    const stripAddress = stripHexPrefix(address).toLowerCase();
    const prefix = chainId != null ? chainId.toString() + '0x' : '';
    const keccakHash = Hash.keccak256(prefix + stripAddress)
        .toString('hex')
        .replace(/^0x/i, '');
    let checksumAddress = '0x';

    for (let i = 0; i < stripAddress.length; i++)
        checksumAddress += parseInt(keccakHash[i], 16) >= 8 ? stripAddress[i].toUpperCase() : stripAddress[i];

    return checksumAddress;
};

// aliases
export const keccak256 = utils.keccak256;
export const sha3 = utils.keccak256;
export const toDecimal = utils.hexToNumber;
export const hexToNumber = utils.hexToNumber;
export const fromDecimal = utils.numberToHex;
export const numberToHex = utils.numberToHex;
export const hexToUtf8 = utils.hexToUtf8;
export const hexToString = utils.hexToUtf8;
export const toUtf8 = utils.hexToUtf8;
export const stringToHex = utils.utf8ToHex;
export const fromUtf8 = utils.utf8ToHex;
export const utf8ToHex = utils.utf8ToHex;
export const toAscii = hexToAscii;
export const fromAscii = asciiToHex;
export const padLeft = utils.leftPad;
export const padRight = utils.rightPad;
export const getSignatureParameters = utils.getSignatureParameters;
export const isAddress = utils.isAddress;
export const isBN = utils.isBN;
export const checkAddressChecksum = utils.checkAddressChecksum;
export const toBN = utils.toBN;
export const toHex = utils.toHex;
export const hexToNumberString = utils.hexToNumberString;
export const toTwosComplement = utils.toTwosComplement;
export const isHex = utils.isHex;
export const isHexStrict = utils.isHexStrict;
export const isBloom = utils.isBloom;
export const isTopic = utils.isTopic;
export const bytesToHex = utils.bytesToHex;
export const hexToBytes = utils.hexToBytes;
export const stripHexPrefix = utils.stripHexPrefix;
export const isBigNumber = utils.isBigNumber;
