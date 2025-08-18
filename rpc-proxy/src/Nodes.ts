
type BNode = {
    url: string;
    auth: string;
}

type BNodeNetworks = {
    mainnet: BNode;
    testnet: BNode;
}

const Nodes: BNodeNetworks = {
    mainnet: {
        url: process.env.MAINNET_NODE_URL as string,
        auth: process.env.MAINNET_AUTH?.replace("|", ":") as string
    },
    testnet: {
        url: process.env.TESTNET_NODE_URL as string,
        auth: process.env.TESTNET_AUTH?.replace("|", ":") as string
    }
} 

export default Nodes
