import http from 'node:http'
import { URL } from 'node:url';

const porta = 3000

const tarefas = [
    { id: 1, titulo: 'Lavar Louças' },
    { id: 2, titulo: 'Comprar uma RTX 5090' }
]

const server = http.createServer((requisicao, resposta) => {
    resposta.setHeader('Content-Type', 'application/json; charset=utf-8')

    const urlObj = new URL(
        requisicao.url,
        `http://${requisicao.headers.host}`
    )

    if (requisicao.method === 'GET' && urlObj.pathname === '/tarefas') {

        resposta.statusCode = 200
        resposta.end(JSON.stringify(tarefas))

    }

    else if (
        requisicao.method === 'GET' &&
        urlObj.pathname === '/tarefas/busca'
    ) {

        const titulo = urlObj.searchParams.get('titulo')

        const tarefasEncontradas = tarefas.filter((tarefa) =>
            tarefa.titulo.toLowerCase().includes(titulo.toLowerCase())
        )

        resposta.statusCode = 200
        resposta.end(JSON.stringify(tarefasEncontradas))
    }

    else if (
        requisicao.method === 'POST' &&
        urlObj.pathname === '/tarefa'
    ) {

        let body = ''

        requisicao.on('data', (chunk) => {
            body += chunk.toString()
        })

        requisicao.on('end', () => {
            try {
                const novaTarefa = JSON.parse(body)

                if (!novaTarefa.titulo) {
                    resposta.statusCode = 400
                    resposta.end(JSON.stringify({
                        error: 'O campo "título" é obrigatório.'
                    }))
                    return
                }

                const tarefaCriada = {
                    id: tarefas.length + 1,
                    titulo: novaTarefa.titulo
                }

                tarefas.push(tarefaCriada)

                resposta.statusCode = 201
                resposta.end(JSON.stringify(tarefaCriada))

            } catch (error) {

                resposta.statusCode = 400
                resposta.end(JSON.stringify({
                    error: 'Formato JSON inválido!'
                }))
            }
        })

    }

    else {
        resposta.statusCode = 404
        resposta.end(JSON.stringify({
            error: 'Página não encontrada.'
        }))
    }
})

server.listen(porta, () => {
    console.log(`Servidor funcionando na porta ${porta}`)
})

