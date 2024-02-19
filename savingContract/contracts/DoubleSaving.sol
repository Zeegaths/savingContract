// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import './Isave.sol';

contract DoubleSaving {
    address myToken;
    address owner;

    constructor(address _savingToken) {
        myToken = _savingToken;
        owner = msg.sender;
    }

    mapping (address => uint) etherBalance;
    mapping (address => uint) tokenBalance;

//mappings
    event SavingSuccessful(address indexed sender, uint indexed amount);
    event WithdrawalSuccessful(address indexed sender, uint indexed amount);

//functions
    function depositEther() external payable {
        require(msg.sender != address(0), "wrong EOA");
        require(msg.value > 0, "can't save zero value");
        etherBalance[msg.sender] = etherBalance[msg.sender] + msg.value;
        emit SavingSuccessful(msg.sender, msg.value);
    }

    function depositToken(uint256 _amount) external {
        require(msg.sender != address(0), "address zero detected");
        require(_amount > 0, "can't save zero value");
        require(Isave(myToken).balanceOf(msg.sender) >= _amount, "not enough token");

        require(Isave(myToken).transferFrom(msg.sender, address(this), _amount), "failed to transfer");

        tokenBalance[msg.sender] += _amount;

        emit SavingSuccessful(msg.sender, _amount);
    }

    function withdrawEther() external {
        require(msg.sender != address(0), "wrong EOA");
        uint256 _userSavings = etherBalance[msg.sender];
        require(_userSavings > 0, "you don't have any savings");

        etherBalance[msg.sender] -= _userSavings;

        payable(msg.sender).transfer(_userSavings);
    }

    function withdrawToken (uint256 _amount) external {
        require(msg.sender != address(0), "address zero detected");
        require(_amount > 0, "can't withdraw zero value");

        uint256 _userSaving = tokenBalance[msg.sender];

        require(_userSaving >= _amount, "insufficient funds");

        tokenBalance[msg.sender] -= _amount;

        require(Isave(myToken).transfer(msg.sender, _amount), "failed to withdraw");

        emit WithdrawalSuccessful(msg.sender, _amount);
    }

    function checkEtherbalance (address _user) external view returns (uint256){
        return etherBalance[_user];
    }

    function checkTokenbalance (address _user) external view returns (uint256) {
        return tokenBalance[_user];
    }  

    function tokenContractBalance() external view returns (uint) {
        return Isave(myToken).balanceOf(address(this));
    }    

    function checkEtherBalance() external view returns (uint256) {
        return address(this).balance;
    } 


}