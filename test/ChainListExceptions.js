// contract to be tested
var ChainList = artifacts.require("./ChainList.sol");


// this is Mocha test framework:
//test suite
contract("ChainList", function(accounts){
  var chainListInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var articleName = "article 1";
  var articleDescription = "Description for article 1";
  var articlePrice = 10;

  it("should throw an exception for debug purposes", function(){
    console.log(ChainList.deployed());
    console.log("Debugging");
  });

  // no article for sale yet
  // declaration and name of the test case that catches the following exception
  it("should throw an exception if you try to buy an article when there is no article for sale yet", function(){
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      return chainListInstance.buyArticle({
        from: buyer,
        value: web3.toWei(articlePrice, "ether")
      });
    }).then(assert.fail)
    // we chain a promise here because
    // the previous statement should fail
    .catch(function(error){
      assert(true);
    }).then(function () {
      return chainListInstance.getArticle();
    }).then(function(data) {
      // assure initial state of the contract
      // assert module: assert.equal(condition, "message if fail")
      assert.equal(data[0], 0x0, "seller must be empty");
      assert.equal(data[1], 0x0, "buyer must be empty");
      assert.equal(data[2], "", "article name must be empty");
      assert.equal(data[3], "", "article description must be empty");
      assert.equal(data[4].toNumber(), 0, "article price must be zero");
    });
  });

  // test case are determined by it()
  // buying an article you are selling
  it("should throw an exception if you try to buy your own article", function(){
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;

      // sellArticle receives 3 params, but the 4th is for metadata about the transaction
      return chainListInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice, "ether"), { from: seller})
    }).then(function(receipt){
      return chainListInstance.buyArticle({ from : seller, value : web3.toWei(articlePrice, "ether")});
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function () {
      return chainListInstance.getArticle();
    }).then(function(data) {
      // assure initial state of the contract
      assert.equal(data[0], seller, "seller must be " + seller);
      assert.equal(data[1], 0x0, "buyer must be empty");
      assert.equal(data[2], articleName, "article name must be " + articleName);
      assert.equal(data[3], articleDescription, "article description must be " + articleDescription);
      assert.equal(data[4].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be zero");
    });
  });

  // incorrect value test case
  it("should throw an exception if you try to buy an article for a value different from its price", function(){
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      return chainListInstance.buyArticle({ from : seller, value : web3.toWei(articlePrice, "ether")});
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function () {
      return chainListInstance.getArticle();
    }).then(function(data) {
      // assure initial state of the contract
      assert.equal(data[0], seller, "seller must be " + seller);
      assert.equal(data[1], 0x0, "buyer must be empty");
      assert.equal(data[2], articleName, "article name must be " + articleName);
      assert.equal(data[3], articleDescription, "article description must be " + articleDescription);
      assert.equal(data[4].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be zero");
    });
  });

  //article has already been sold
  it("should throw an exception if you try to buy an article that has already been sold", function(){
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      return chainListInstance.buyArticle({ from : buyer, value : web3.toWei(articlePrice, "ether")});
    }).then(function(){
      return chainListInstance.buyArticle({ from : buyer, value : web3.toWei(articlePrice, "ether")});
    }).then(assert.fail)
      .catch(function(error){
      assert(true);
    }).then(function () {
      return chainListInstance.getArticle();
    }).then(function(data) {
      // console.log("passed here"); // bug 001 from: "buyer" crashing in buyer assertion
      // assure initial state of the contract:
      assert.equal(data[0], seller, "seller must be " + seller);
      assert.equal(data[1], buyer, "buyer must be " + buyer);
      assert.equal(data[2], articleName, "article name must be " + articleName);
      assert.equal(data[3], articleDescription, "article description must be " + articleDescription);
      assert.equal(data[4].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be zero");
    });
  });

  

});
