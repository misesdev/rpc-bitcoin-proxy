import express from "express";
import bodyParser from "body-parser";
import AllowedMethods from "./src/AllowedMethods";
import Nodes from "./src/Nodes";
import axios from "axios"

const app = express();
app.use(bodyParser.json());
const appPort = process.env.RPC_PROXY_PORT
const authToken = process.env.RPC_ACCESS_TOKEN

app.post("/:network", async (req, res) => {
    
    const token = req.headers["authorization"];
    if (token !== `Bearer ${authToken}`) { 
        console.log(`Unauthorized access token ${token} with ${authToken}`)
        return res.status(401).json({ error: "Unauthorized" })
    }

    const { network } = req.params;
    const bitcoinNode = Nodes[network as "mainnet"|"testnet"]
    if (!bitcoinNode) { 
        console.log(`Unspected network ${network}`)
        return res.status(400).json({ error: "Invalid network" })
    }

    const { method, params } = req.body;

    // if (!AllowedMethods.includes(method)) 
    //     return res.status(403).json({ error: "Method not allowed" });

    try 
    {
        const httpClient = axios.create({
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Buffer.from(bitcoinNode.auth).toString("base64")}`
            }
        })
        const response = await httpClient.post(bitcoinNode.url, {
            jsonrpc: "1.0",
            id: "proxy",
            method,
            params
        })
        res.json(response.data)
    } 
    catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal error" })
    }
});

app.listen(appPort, () => {
    console.log(`RPC Proxy server running on port ${appPort}`)
})
