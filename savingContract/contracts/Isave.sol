// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
//Iterface

interface Isave {

    function totalSupply() external view returns (uint256);

    function balanceOf(address _owner) external view returns (uint256 balance);

    function transfer(address _to, uint256 _value) external returns (bool success);
    
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);

}