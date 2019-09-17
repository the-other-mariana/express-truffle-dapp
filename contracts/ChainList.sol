pragma solidity ^0.4.18;

contract ChainList {
  // custome types
  struct Article {
    uint id;
    address seller;
    address buyer;
    string name;
    string description;
    uint256 price;
  }

// mappings: associative arrays (keys) whose values are set to zero by default
// cannot be iterated, cant tell size
// state variables
// if any state variable is public, solidity auto-generates a getter
// integer key mapping:
mapping(uint => Article) public articles;
uint articleCounter;

  // events
  event LogSellArticle(
    uint indexed _id,
    address indexed _seller,
    string _name,
    uint256 _price
  );

  event LogBuyArticle(
    uint indexed _id,
    address indexed _seller,
    address indexed _buyer,
    string _name,
    uint256 _price
  );

  // sell an article
  function sellArticle(string _name, string _description, uint256 _price) public {
    // a new article
    articleCounter++;
    articles[articleCounter] = Article(
        articleCounter,
        msg.sender,
        0x0,
        _name,
        _description,
        _price
      );

    LogSellArticle(articleCounter, msg.sender, _name, _price);
  }

/*
  // get an article
  function getArticle() public view returns (
    address _seller,
    address _buyers,
    string _name,
    string _description,
    uint256 _price
  ) {
      return(seller, buyer, name, description, price);
  }
*/

// get the number of articles in the contract
// view means the function can access the state vars
// public means the function can be called from outside the contract (backend)
function getNumberOfArticles() public view returns (uint){
  return articleCounter;
}

// fetch and return all article ids for articles still for sale
function getArticlesForSale() public view returns(uint[]){
  // local arrays: stored in storage or memory
  uint[] memory articleIds = new uint[](articleCounter);

  uint numberOfArticlesForSale = 0;
  // iterate over articles
  for(uint i = 0; i <= articleCounter; i++){
    // keep the ID if the article is still for sale
    if(articles[i].buyer == 0x0){
      articleIds[numberOfArticlesForSale] = articles[i].id;
      numberOfArticlesForSale++;
    }
  }

  // copy the articleIds array into a smaller forSale array
  // sometimes solidity requires it
  uint[] memory forSale = new uint[](numberOfArticlesForSale);
  for (uint j = 0; j < numberOfArticlesForSale; j++){
    forSale[j] = articleIds[j];
  }
  return forSale;
}

  //Buy an articles
  //Payable means that this function can receive ether from its caller
  function buyArticle(uint _id) payable public{
    //We check whether there is an article for sale
    require(articleCounter > 0);

    // we check that the article exists
    require(_id > 0 && _id <= articleCounter);

    //retrieve the article from the mapping
    Article storage article = articles[_id];

    //We check that the article has not been sold yet
    require(article.buyer == 0x0);

    //We don't allow the seller to buy his own article
    require(msg.sender != article.seller);

    //We check that the value send correspond to the price of the article
    require(msg.value == article.price);

    // once we check all previous validations,
    //Keep track of the buyer information
    article.buyer = msg.sender;

    // the buyer can pay the seller
    article.seller.transfer(msg.value);

    // trigger the event
    LogBuyArticle(_id, article.seller, article.buyer, article.name, article.price);
  }
}
