let web3;
let contract;

const contractABI = [
    { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
    {
      inputs: [],
      name: 'getBalance',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [{ name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'withdraw',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    { stateMutability: 'payable', type: 'receive' }
];

const contractAddress = "0x9ef6E9faD6C54225549b81F1adA45D49DAD67e87"; 

window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            contract = new web3.eth.Contract(contractABI, contractAddress);
            fetchModels(); 
        } catch (error) {
            console.error("User denied access to MetaMask");
        }
    } else {
        alert("Please install MetaMask to use this app!");
    }
});

document.getElementById("modelForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("modelName").value;
    const description = document.getElementById("modelDescription").value;
    const price = document.getElementById("modelPrice").value;

    const accounts = await web3.eth.getAccounts();

    try {
        await contract.methods
            .listModel(name, description, web3.utils.toWei(price, "ether"))
            .send({ from: accounts[0] });

        alert("Model added successfully!");
        fetchModels(); 
    } catch (error) {
        console.error("Error adding model:", error);
    }
});

async function fetchModels() {
    try {
        const modelCount = await contract.methods.modelCount().call();
        const modelsList = document.getElementById("modelsList");
        modelsList.innerHTML = "";

        for (let i = 0; i < modelCount; i++) {
            const model = await contract.methods.getModelDetails(i).call();

            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <h3>${model.name}</h3>
                <p>${model.description}</p>
                <p>Price: ${web3.utils.fromWei(model.price, "ether")} ETH</p>
            `;
            modelsList.appendChild(listItem);
        }
    } catch (error) {
        console.error("Error fetching models:", error);
    }
};

const staticModels = [
    {
        name: "The Metamorphosis",
        description: "A novella by Franz Kafka, a classic of absurdist fiction.",
        price: web3.utils.toWei("0.5", "ether"), // Цена в ETH
    },
    {
        name: "The Trial",
        description: "Franz Kafka's dystopian novel about a man arrested and prosecuted by an inaccessible authority.",
        price: web3.utils.toWei("0.7", "ether"),
    },
    {
        name: "The Stranger",
        description: "A novel by Albert Camus, exploring existential themes of meaning and morality.",
        price: web3.utils.toWei("0.6", "ether"),
    },
    {
        name: "The Plague",
        description: "Albert Camus' novel about a town besieged by a deadly epidemic.",
        price: web3.utils.toWei("0.8", "ether"),
    },
    {
        name: "Crime and Punishment",
        description: "Fyodor Dostoevsky's psychological drama exploring morality, guilt, and redemption.",
        price: web3.utils.toWei("0.9", "ether"),
    },
    {
        name: "The Brothers Karamazov",
        description: "Dostoevsky's philosophical novel about faith, doubt, and reason.",
        price: web3.utils.toWei("1.0", "ether"),
    },
    {
        name: "No Exit",
        description: "A play by Jean-Paul Sartre exploring existentialism and human relationships.",
        price: web3.utils.toWei("0.4", "ether"),
    },
    {
        name: "Nausea",
        description: "Jean-Paul Sartre's novel about existential dread and finding meaning in life.",
        price: web3.utils.toWei("0.5", "ether"),
    },
];

document.addEventListener("DOMContentLoaded", () => {
    const modelsList = document.getElementById("modelsList");

    staticModels.forEach((model, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <h3>${model.name}</h3>
            <p>${model.description}</p>
            <p>Price: ${web3.utils.fromWei(model.price, "ether")} ETH</p>
        `;
        modelsList.appendChild(listItem);
    });
});
