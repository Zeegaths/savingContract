import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract, ContractFactory, Signer, getAddress } from "ethers";
import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { DoubleSaving__factory, MyToken } from "../typechain-types";
import { DoubleSaving } from "../typechain-types"


describe("Double spending", function () {
  let doubleSaving: DoubleSaving;
  let mytoken: MyToken;
 

async function deployEthers() {  

    // Deploy ERC20 token for testing
  const MyToken = await ethers.getContractFactory("MyToken")
  mytoken = await MyToken.deploy()

  const DoubleSaving = await ethers.getContractFactory("DoubleSaving");
  doubleSaving = await DoubleSaving.deploy(mytoken.target);

  const [owner, addr1, addr2] = await ethers.getSigners();

  const depositAmount = ethers.parseEther("3.0");

  const deposi2 = ethers.parseEther("2.0");  

  const withdrawalAmount = ethers.parseEther("1.0");
  const balance = await doubleSaving.connect(owner).checkTokenbalance(owner.address)
  

  const deposit = 1200;
   
  return {owner,addr1, doubleSaving, depositAmount, deposi2 ,mytoken, deposit, balance, withdrawalAmount};
}


describe ("save Ether", function () {
  it("should accept and save amount", async function() {
    const { owner, doubleSaving, depositAmount, deposi2 } = await loadFixture(deployEthers);
   
    const txDeposit = await doubleSaving.depositEther({value:depositAmount}); 
    const receipt = await txDeposit.wait();   
    
    const ownerSavings = await doubleSaving.checkEtherbalance (await owner.getAddress());
   
    expect(ownerSavings ).to.equal(depositAmount);  
   
    expect(owner.address).not.equal(ethers.ZeroAddress);

    })
})

describe('deposit Token', ()=>{
  it('should deposit properly', async ()=>{  
  const { owner, mytoken} = await loadFixture(deployEthers);
  const deposit = 1200;
  
  await mytoken.connect(owner).approve(doubleSaving.target, deposit)

  await doubleSaving.connect(owner).depositToken(deposit)
  const balance = await doubleSaving.connect(owner).checkTokenbalance(owner.address)

  // console.log(balance, "user balance")
  // console.log(contractBal, 'contract balance')
  expect(balance).to.equal(deposit);
  expect(owner.address).not.equal(ethers.ZeroAddress);
  })
})

describe ("withdraw Ether", function () {
  it("should withdraw ether", async function() {
    const { owner, doubleSaving, depositAmount, withdrawalAmount, deposi2 } = await loadFixture(deployEthers);
   
    const txDeposit = await doubleSaving.depositEther({value:depositAmount}); 
    const receipt = await txDeposit.wait();  
    
    const txwithdraw = await doubleSaving.withdrawEther();
    txwithdraw.wait();
    
    const ownerSavings = await doubleSaving.checkEtherbalance (await owner.getAddress());
   
    // expect(ownerSavings ).to.equal(depositAmount);  
    expect(ownerSavings ).to.equal(0); 
   
    // expect(owner.address).not.equal(ethers.ZeroAddress);

    })
})

describe('withdraw Token', ()=>{
  it('should properly withdraw tokens', async ()=>{  
  const { owner, mytoken} = await loadFixture(deployEthers);
  const deposit = 1200;
  
  await mytoken.connect(owner).approve(doubleSaving.target, deposit)

  await doubleSaving.connect(owner).depositToken(deposit)
  
  const withdrawAmount = 200;
  await doubleSaving.connect(owner).withdrawToken(withdrawAmount);

  const balance = await doubleSaving.connect(owner).checkTokenbalance(owner.address)

  // console.log(balance, "user balance")
  // console.log(contractBal, 'contract balance')
  expect(balance).to.equal(1000);
  expect(owner.address).not.equal(ethers.ZeroAddress);
  })
})

describe('Token contract balance', ()=>{
  it('should return the balance of the token address', async ()=>{  
  const { owner, addr1, mytoken} = await loadFixture(deployEthers);
  const deposit = 1200;
  const depo2 = 1400;

  await mytoken.transfer(addr1, 1200);

  await mytoken.connect(owner).approve(doubleSaving.target, deposit)
  await mytoken.connect(addr1).approve(doubleSaving.target, depo2)

  await doubleSaving.connect(owner).depositToken(deposit)
  await doubleSaving.connect(addr1).depositToken(deposit)
  
  const withdrawAmount = 200;
  await doubleSaving.connect(owner).withdrawToken(withdrawAmount);

  const balance = await doubleSaving.connect(owner).checkTokenbalance(owner.address)
  const contractBal = await doubleSaving.connect(owner).tokenContractBalance();


  // console.log(balance, "user balance")
  // console.log(contractBal, 'contract balance')
  expect(contractBal).to.equal(2200);
  expect(owner.address).not.equal(ethers.ZeroAddress);
  })
})
  
})




//   it("withdraw ether amount from savings.", async function() {
//     const [owner, addr1, addr2] = await ethers.getSigners();
//     const depositAmount = ethers.parseEther("1.0");   

//     const txDeposit = await doubleSaving.withdrawEther({value: depositAmount}); 

//     const receipt = await txDeposit.wait();
//     const { status } = receipt;
    
//     const ownerSavingsBefore = await saveEther.checkSavings(await owner.getAddress());
//     const contractBalanceBefore = await saveEther.checkContractBal();

//     const withdrawTx = await doubleSaving.withdraw();
//     const withdrawReceipt = await withdrawTx.wait();
//     const withdrawStatus = withdrawReceipt.status;

//     const ownerSavingsAfter = await doubleSaving.checkSavings(await owner.getAddress());
//     const contractBalanceAfter = await doubleSaving.checkContractBal();

//     expect(status).to.equal(1);
//     expect(ownerSavingsBefore).to.equal(depositAmount);
//     expect(contractBalanceBefore).to.equal(depositAmount);

//     expect(withdrawStatus).to.equal(1); // Check withdrawal transaction status
//     expect(ownerSavingsAfter).to.equal(0); // Owner savings should be zero after withdrawal
//     expect(contractBalanceAfter).to.equal(0); // Contract balance should be zero after withdrawal
// });

//   // describe('withdraw Token', ()=>{
//   //   it('should withdraw properly', async ()=>{
//   //    const [owner, user1, user2] = await ethers.getSigners();
  //   const depositAmount = 1050

  //   const withdrawalAmount = 100

  //   await mytoken.connect(owner).approve(saveERC20.target, depositAmount)
  //   await saveERC20.connect(owner).deposit(depositAmount)

  //   await saveERC20.connect(owner).withdraw(withdrawalAmount)

  //   const balance = await saveERC20.connect(owner).checkUserBalance(owner.address)
  //   const contractBal = await saveERC20.connect(owner).checkContractBalance()

  //   // console.log(balance, "user balance")
  //   // console.log(contractBal, 'contract balance')

  //   expect(balance).to.equal(depositAmount - withdrawalAmount);

  //   })
  // })

  // describe('user balance', ()=>{
  //   it('should return user balance', async ()=>{
  //    const [owner, user1, user2] = await ethers.getSigners();
  //   const depositAmount = 1050
  //   const depo = 200
  //   const depo2 = 200
   
  //   const withdrawalAmount = 100

  //   await mytoken.connect(owner).approve(saveERC20.target, depositAmount)
  //   await saveERC20.connect(owner).deposit(depo)
  //   await saveERC20.connect(owner).deposit(depo2)

  //   await saveERC20.connect(owner).withdraw(withdrawalAmount)

  //   const balance = await saveERC20.connect(owner).checkUserBalance(owner.address)
  //   const contractBal = await saveERC20.connect(owner).checkContractBalance()

  //   // console.log(balance, "user balance")
  //   // console.log(contractBal, 'contract balance')

  //   expect(balance).to.equal(depo + depo2 -withdrawalAmount );

  //   })
  // })

  // describe('user balance', ()=>{
  //   it('should return user balance', async ()=>{
  //    const [owner, user1, user2] = await ethers.getSigners();
  //   const depositAmount = 1050
  //   const depo = 200
  //   const depo2 = 200
   
  //   const withdrawalAmount = 100

  //   await mytoken.connect(owner).approve(saveERC20.target, depositAmount)
  //   await saveERC20.connect(owner).deposit(depo)
  //   await saveERC20.connect(owner).deposit(depo2)

  //   await saveERC20.connect(owner).withdraw(withdrawalAmount)

  //   const balance = await saveERC20.connect(owner).checkUserBalance(owner.address)
  //   const contractBal = await saveERC20.connect(owner).checkContractBalance()

  //   // console.log(balance, "user balance")
  //   // console.log(contractBal, 'contract balance')

  //   expect(balance).to.equal(depo + depo2 -withdrawalAmount );

  //   })
  // })

  // describe('contract balance', ()=>{
  //   it('should return contract balance', async ()=>{
  //   const [owner, user1, user2] = await ethers.getSigners();
  //   const depositAmount = 1050
  //   const depo = 200
  //   const depo2 = 200
   
  //   const withdrawalAmount = 100

  //   await mytoken.connect(owner).approve(saveERC20.target, depositAmount)
    
  //   await saveERC20.connect(owner).deposit(depo)
  //   await saveERC20.connect(owner).deposit(depo2)

  //   await saveERC20.connect(owner).withdraw(withdrawalAmount)

  //   const balance = await saveERC20.connect(owner).checkUserBalance(owner.address)
  //   const contractBal = await saveERC20.connect(owner).checkContractBalance()

    // console.log(balance, "user balance")
    // console.log(contractBal, 'contract balance')

  //   expect(contractBal).to.equal(depo + depo2 -withdrawalAmount );

  //   })
  // })

//   describe('ownerwithdraw', ()=>{
//     it('should allow user to withdraw', async ()=>{
//     const [owner, user1, user2] = await ethers.getSigners();
//     const depositAmount = 1050
//     const depo = 200
//     const depo2 = 200
   
//     const withdrawalAmount = 100

//     await mytoken.connect(owner).approve(saveERC20.target, depositAmount)
  
    
//     await saveERC20.connect(owner).deposit(depo)
//     await saveERC20.connect(owner).deposit(depo2)

//     await saveERC20.connect(owner).withdraw(withdrawalAmount)
//     await saveERC20.connect(owner).ownerWithdraw(300)

//     const balance = await saveERC20.connect(owner).checkUserBalance(owner.address)
//     const withdrawal = await saveERC20.connect(owner).checkUserBalance(owner.address)
//     const contractBal = await saveERC20.connect(owner).checkContractBalance()

//     // console.log(balance, "user balance")
//     // console.log(contractBal, 'contract balance')

//     expect(contractBal).to.equal(0);

//     })
//   })
  
// });
