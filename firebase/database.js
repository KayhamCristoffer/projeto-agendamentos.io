// firebase/database.js

// 🔥 Função para enviar um novo agendamento
function salvarAgendamento(nome, servico, dataHora, uid) {
    return db.ref("agendamentos").push({
        nome: nome,
        servico: servico,
        dataHora: dataHora,
        user: uid || "visitante",
        criadoEm: Date.now()
    });
}

// 🔥 Função para listar todos os agendamentos (somente leitura)
function listarAgendamentos(callback) {
    db.ref("agendamentos").on("value", snapshot => {
        const dados = snapshot.val();
        callback(dados);
    });
}

// 🔥 Função para deletar agendamento por ID
function deletarAgendamento(id) {
    return db.ref("agendamentos/" + id).remove();
}
