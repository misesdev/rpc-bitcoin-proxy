import express from "express";
import bodyParser from "body-parser";
import AllowedMethods from "./src/AllowedMethods";
import Nodes from "./src/Nodes";
import axios from "axios"

const app = express();
app.use(bodyParser.json());

app.post("/:network", async (req, res) => {
    
    const token = req.headers["authorization"];
    if (token !== `Bearer ${process.env.ACCESS_TOKEN}`) 
        return res.status(401).json({ error: "Unauthorized" });

    const { network } = req.params;
    const bitcoinNode = Nodes[network as "mainnet"|"testnet"]
    if (!bitcoinNode) 
        return res.status(400).json({ error: "Invalid network" });

    const { method, params } = req.body;

    if (!AllowedMethods.includes(method)) 
        return res.status(403).json({ error: "Method not allowed" });

    try 
    {
        const authorization = Buffer.from(bitcoinNode.auth).toString("base64")
        const response = await axios.post(bitcoinNode.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${authorization}`
            },
            body: JSON.stringify({
                jsonrpc: "1.0",
                id: "proxy",
                method,
                params
            })
        });
        res.json(response.data);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal error" });
    }
});

app.listen(8081, () => {
    console.log("Proxy server running on port 3000");
})
