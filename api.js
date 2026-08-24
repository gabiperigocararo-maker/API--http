import http from 'node:http'

const porta = 3000

const tarefas = [
    {id: 1, titulo: 'Lavar Louças'},
    {id: 2, titulo: 'Comprar uma RTX 5090'}
]

const server = http.createServer((requisicao, resposta) => {
    resposta.setHeader('Content-Type', 'application/json; charset=utf-8')

    if (requisicao.method == 'GET' && requisicao.url == '/tarefas') {
        resposta.statusCode = 200
        resposta.end(JSON.stringify(tarefas))
    } else if (requisicao.method == 'POST' && requisicao.url == '/tarefa') {
        let body = ''

        requisicao.on('data', (chunk) => {
            body += chunk.toString()
        })

        requisicao.on('end', () => {
            try{
                const novaTarefa = JSON.parse(body)

                if (!novaTarefa.titulo) {
                    resposta.statusCode = 400
                    resposta.end(JSON.stringify({error: 'O campo "título" é obrigatório.'}));
                }

                const tarefaCriada = {
                    id: tarefas.length + 1,
                    titulo: novaTarefa.titulo
                }

                tarefas.push(tarefaCriada)

                resposta.statusCode = 201
                resposta.end(JSON.stringify(tarefaCriada))

            } catch(error) {
                resposta.statusCode = 400
                resposta.end(JSON.stringify({error: 'Formato JSON inválido!'}));
            }
        })
    } else {
        resposta.statusCode = 404
        resposta.end(JSON.stringify({error: 'Página não encontrada.'}));
    }
});

server.listen(porta, () => {
    console.log(`Servidor funcionando na porta ${porta}`);
});