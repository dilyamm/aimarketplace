const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');

// Подключение к Ganache
const web3 = new Web3('http://127.0.0.1:7545');

// Путь к контракту
const contractPath = "C:/Users/Асус/Downloads/blockchain/contracts/SimpleWallet.sol";

// Чтение контракта
const contractSource = fs.readFileSync(contractPath, 'utf8');

// Компиляция контракта
const input = {
  language: 'Solidity',
  sources: {
    'SimpleWallet.sol': {
      content: contractSource,
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Выводим результат компиляции для диагностики
console.log("Compilation Output:", output);

if (!output.contracts || !output.contracts['SimpleWallet.sol']) {
  console.error("Error: Contract compilation failed or structure is incorrect.");
  process.exit(1); // Останавливаем выполнение скрипта
}

const abi = output.contracts['SimpleWallet.sol'].SimpleWallet.abi;
const bytecode = output.contracts['SimpleWallet.sol'].SimpleWallet.evm.bytecode.object;

console.log("Contract ABI:", abi); // Выводим ABI для проверки

(async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];

    const contract = new web3.eth.Contract(abi);

    // Разворачиваем контракт с уменьшенным газом
    const deployedContract = await contract
      .deploy({ data: `0x${bytecode}` })
      .send({ from: owner, gas: 5000000 });

    console.log(`Contract deployed at address: ${deployedContract.options.address}`);
  } catch (error) {
    console.error('Error deploying contract:', error);
  }
})();
