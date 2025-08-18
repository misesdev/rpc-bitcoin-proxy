import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
const appPort = process.env.ESPLORA_PROXY_PORT

// Mapeamento de network para URL do Esplora
const esploraUrls: Record<string, string> = {
    mainnet: process.env.ESPLORA_MAINNET_URL!,   // ex: http://esplora-mainnet:8082
    testnet: process.env.ESPLORA_TESTNET_URL!    // ex: http://esplora-testnet4:8083
};

// Prefixo da API que será servido: /proxy/:network/api/*
app.all("/:network*", async (req, res) => {
    console.log(req)
    const token = req.headers["authorization"];
    if (token !== `Bearer ${process.env.ACCESS_TOKEN}`) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { network } = req.params as any;
    const esploraUrl = esploraUrls[network];
    if (!esploraUrl) {
        return res.status(400).json({ error: "Invalid network" });
    }

    try {
        // Reconstruir o path da API
        const apiPath = (req.params as any)[0] as string;
        // pega tudo após /proxy/:network/api/

        // Redireciona a requisição mantendo método, headers e body
        const response = await axios({
            method: req.method as any,
            url: `${esploraUrl}/api/${apiPath}`,
            data: req.body,
            headers: {
                ...req.headers,
                host: undefined, // evita conflito de host
                authorization: undefined // não envia token para esplora
            }
        });

        res.status(response.status)
            .json(response.data);
    } catch (err: any) {
        console.error(err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ error: "Internal error" });
    }
});

app.listen(appPort, () => {
    console.log(`Proxy Esplora API server running on port ${appPort}`);
});
