import express from "express";
import bodyParser from "body-parser";
import AllowedMethods from "./src/AllowedMethods";

const app = express();
app.use(bodyParser.json());

const TOKEN = process.env.ACCESS_TOKEN;

const NODES: any = {
    mainnet: {
        url: process.env.MAINNET_NODE_URL,
        auth: process.env.MAINNET_AUTH 
    },
    testnet: {
        url: process.env.TESTNET_NODE_URL,
        auth: process.env.TESTNET_AUTH
    }
};

app.post("/:network", async (req, res) => {
    const token = req.headers["authorization"];
    if (token !== `Bearer ${TOKEN}`) 
        return res.status(401).json({ error: "Unauthorized" });

    const { network } = req.params;
    if (!NODES[network]) 
        return res.status(400).json({ error: "Invalid network" });

    const { method, params } = req.body;

    if (!AllowedMethods.includes(method)) 
        return res.status(403).json({ error: "Method not allowed" });

    try {
        const response = await fetch(NODES[network].url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Buffer.from(NODES[network].auth).toString("base64")}`
            },
            body: JSON.stringify({
                jsonrpc: "1.0",
                id: "proxy",
                method,
                params
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal error" });
    }
});

app.listen(3000, () => {
    console.log("Proxy server running on port 3000");
});
