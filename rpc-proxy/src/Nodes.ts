
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
        url: process.env.RPC_MAINNET_URL as string,
        auth: process.env.RPC_MAINNET_AUTH?.replace("|", ":") as string
    },
    testnet: {
        url: process.env.RPC_TESTNET_URL as string,
        auth: process.env.RPC_TESTNET_AUTH?.replace("|", ":") as string
    }
} 

export default Nodes
