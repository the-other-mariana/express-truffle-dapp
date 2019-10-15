.. _web3-module-contract:

.. include:: include_announcement.rst

===================
Contract Module API
===================

The ``Contract Module API`` does provide to possibility to create project specific contracts with pre-injecting of the ABI or customizing of the default behaviour of a Web3 contract.


Contract
========

The exported class ``Contract`` is here to simply pre-inject a contract ABI.


----------
Parameters
----------

1. ``provider`` - ``AbstractSocketProvider | HttpProvider | CustomProvider | String``: A Web3.js provider.
2. ``abi`` - ``Array``: Contract ABI
3. ``accounts`` - :ref:`Accounts <eth-accounts>`
4. ``options`` - ``Web3ModuleOptions``


-------
Example
-------

.. code-block:: javascript

    import {MyABI, options} from '../folder/file.js';
    import {Accounts} from 'web3-eth-accounts';
    import {Contract} from 'web3-eth-contract';

    export class MyContract extends Contract {
        constructor(provider) {
            super(provider, MyAbi, new Accounts(...), '0x0', options);
        }
    }
