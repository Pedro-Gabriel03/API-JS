const express = require('express');
const axios = require('axios');

const app = express();

// Permite que a API receba e devolva JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'online', servico: 'API de Endereços Corporativa' });
});

app.get('/endereco/:cep', async (req, res) => {
    // Limpando o CEP (removendo traços e espaços)
    const cepLimpo = req.params.cep.replace('-', '').trim();

    // Validação da regra de negócio: 8 dígitos numéricos
    if (cepLimpo.length !== 8 || isNaN(cepLimpo)) {
        return res.status(400).json({ detail: 'Formato de CEP inválido. Use 8 dígitos numéricos.' });
    }

    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = response.data;

        // O ViaCEP retorna status 200 com {"erro": "true"} se o CEP for inválido/inexistente
        if (dados.erro) {
            return res.status(404).json({ detail: 'CEP não encontrado na base de dados' });
        }

        // Retornando apenas os dados formatados
        return res.json({
            cep_formatado: dados.cep,
            logradouro: dados.logradouro,
            bairro: dados.bairro,
            cidade: dados.localidade,
            estado: dados.uf,
            ibge: dados.ibge
        });
        
    } catch (error) {
        // Trata quedas da API do ViaCEP
        return res.status(502).json({ detail: 'Serviço de consulta temporariamente indisponível' });
    }
});

// Exportamos o app para que os testes possam utilizá-lo sem abrir portas de rede
module.exports = app;