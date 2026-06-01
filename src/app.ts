import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({ status: 'online', servico: 'API de Endereços Corporativa' });
});

app.get('/endereco/:cep', async (req: Request, res: Response): Promise<any> => {
    const cepLimpo = req.params.cep.replace('-', '').trim();

    if (cepLimpo.length !== 8 || isNaN(Number(cepLimpo))) {
        return res.status(400).json({ detail: 'Formato de CEP inválido.' });
    }

    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = response.data;

        if (dados.erro) {
            return res.status(404).json({ detail: 'CEP não encontrado' });
        }

        return res.json({
            cep_formatado: dados.cep,
            logradouro: dados.logradouro,
            bairro: dados.bairro,
            cidade: dados.localidade,
            estado: dados.uf,
            ibge: dados.ibge
        });
        
    } catch (error) {
        return res.status(502).json({ detail: 'Serviço indisponível' });
    }
});

export default app;