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
 * @file AbstractMethodFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {NewHeadsSubscription} from 'web3-core-subscriptions';
import GetBlockByNumberMethod from '../../src/methods/block/GetBlockByNumberMethod';
import GetTransactionReceiptMethod from '../../src/methods/transaction/GetTransactionReceiptMethod';
import GetTransactionCountMethod from '../../src/methods/account/GetTransactionCountMethod';
import ChainIdMethod from '../../src/methods/network/ChainIdMethod';
import SocketTransactionObserver from '../../src/observers/SocketTransactionObserver';
import HttpTransactionObserver from '../../src/observers/HttpTransactionObserver';

export default class AbstractMethodFactory {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(utils, formatters) {
        this.utils = utils;
        this.formatters = formatters;
        this._methods = null;
    }

    /**
     * Gets the methods object
     *
     * @property methods
     *
     * @returns {null|Object}
     */
    get methods() {
        if (this._methods) {
            return this._methods;
        }

        throw new Error('No methods defined for MethodFactory!');
    }

    /**
     * Sets the methods object
     *
     * @property methods
     *
     * @param {Object} value
     */
    set methods(value) {
        this._methods = value;
    }

    /**
     * Checks if the method exists
     *
     * @method hasMethodModel
     *
     * @param {String} name
     *
     * @returns {Boolean}
     */
    hasMethod(name) {
        return typeof this.methods[name] !== 'undefined';
    }

    /**
     * Returns an MethodModel
     *
     * @param {String} name
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {AbstractMethod}
     */
    createMethod(name, moduleInstance) {
        const method = this.methods[name];

        if (method.Type === 'observed-transaction-method') {
            // eslint-disable-next-line new-cap
            return new method(
                this.utils,
                this.formatters,
                moduleInstance,
                this.createTransactionObserver(moduleInstance)
            );
        }

        // TODO: Move this to the eth module later.
        if (method.Type === 'eth-send-transaction-method') {
            // eslint-disable-next-line new-cap
            return new method(
                this.utils,
                this.formatters,
                moduleInstance,
                this.createTransactionObserver(moduleInstance),
                new ChainIdMethod(this.utils, this.formatters, moduleInstance),
                new GetTransactionCountMethod(this.utils, this.formatters, moduleInstance)
            );
        }

        // eslint-disable-next-line new-cap
        return new method(this.utils, this.formatters, moduleInstance);
    }

    /**
     * Returns the correct timeout value
     *
     * @method getTimeout
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Number}
     */
    getTimeout(moduleInstance) {
        let timeout = moduleInstance.transactionBlockTimeout;

        if (!moduleInstance.currentProvider.supportsSubscriptions()) {
            timeout = moduleInstance.transactionPollingTimeout;
        }

        return timeout;
    }

    /**
     * Returns a object of type AbstractTransactionObserver
     *
     * @method createTransactionObserver
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {AbstractTransactionObserver}
     */
    createTransactionObserver(moduleInstance) {
        if (moduleInstance.currentProvider.supportsSubscriptions()) {
            return new SocketTransactionObserver(
                moduleInstance.currentProvider,
                this.getTimeout(moduleInstance),
                moduleInstance.transactionConfirmationBlocks,
                new GetTransactionReceiptMethod(this.utils, this.formatters, moduleInstance),
                new NewHeadsSubscription(this.utils, this.formatters, moduleInstance)
            );
        }

        return new HttpTransactionObserver(
            moduleInstance.currentProvider,
            this.getTimeout(moduleInstance),
            moduleInstance.transactionConfirmationBlocks,
            new GetTransactionReceiptMethod(this.utils, this.formatters, moduleInstance),
            new GetBlockByNumberMethod(this.utils, this.formatters, moduleInstance)
        );
    }
}
