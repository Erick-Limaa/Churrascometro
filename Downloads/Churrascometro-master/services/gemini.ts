import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export async function enviarMensagem(mensagem: string): Promise<string> {
  if (!API_KEY) {
    console.error('ERRO: A variável de ambiente EXPO_PUBLIC_GEMINI_API_KEY não foi definida.');
    return 'Erro de configuração no servidor.';
  }

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        contents: [
          {
            parts: [
              {
                text: mensagem,
              },
            ],
          },
        ],
      },
      {
        params: { key: API_KEY },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const texto = response.data?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p.text || '')
      .join('')
      .trim();

    if (!texto) {
      console.log('Resposta sem texto:', JSON.stringify(response.data, null, 2));
      return 'Não consegui gerar uma resposta agora.';
    }

    return texto;
  } catch (error: any) {
    const detalhe =
      error?.response?.data?.error?.message ||
      error?.message ||
      'Erro desconhecido';

    console.log('ERRO GEMINI COMPLETO:', JSON.stringify(error?.response?.data, null, 2));

    return `Erro da IA: ${detalhe}`;
  }
}