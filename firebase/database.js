// Este arquivo assume que 'firebase-config.js' e 'services-config.js' 
// foram carregados antes dele e tornaram 'firebase' e 'servicesConfig' globais.

// const db = firebase.database();

// =============================================
// I. GESTÃO DE PERFIL E CONFIGURAÇÕES
// =============================================

/**
 * 💾 Salva o perfil inicial do usuário no Realtime Database (usado no Cadastro).
 * @param {string} uid - ID do usuário Firebase.
 * @param {object} data - Dados do perfil (nomeCompleto, email, telefone, role).
 */
async function salvarPerfilUsuario(uid, data) {
    try {
        await db.ref('usuarios/' + uid).set(data);
        console.log("Perfil de usuário salvo com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar perfil:", error);
        throw error;
    }
}

/**
 * 👤 Obtém o perfil completo do usuário (usado para verificar a role e redirecionar).
 * @param {string} uid - ID do usuário Firebase.
 * @returns {Promise<object | null>} Perfil do usuário ou null se não encontrado.
 */
async function obterPerfilUsuario(uid) {
    try {
        const snapshot = await db.ref('usuarios/' + uid).once('value');
        return snapshot.val();
    } catch (error) {
        console.error("Erro ao obter perfil:", error);
        return null;
    }
}

/**
 * ⚙️ Salva as configurações globais do negócio (horários de funcionamento, etc.).
 * @param {object} configs - Objeto de configurações (geralmente usado pelo Admin).
 */
async function salvarConfiguracoes(configs) {
    try {
        await db.ref('configuracoes/geral').set(configs);
        console.log("Configurações salvas com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar configurações:", error);
        throw error;
    }
}

/**
 * 🔍 Obtém as configurações globais do negócio.
 * @returns {Promise<object | null>} Configurações ou null.
 */
async function obterConfiguracoes() {
    try {
        const snapshot = await db.ref('configuracoes/geral').once('value');
        return snapshot.val();
    } catch (error) {
        console.error("Erro ao obter configurações:", error);
        return null;
    }
}


// =============================================
// II. LÓGICA CENTRAL DE AGENDAMENTOS
// =============================================

/**
 * 📅 Implementação da função crítica de verificação de disponibilidade.
 * Verifica os slots livres para um dado dia, considerando a duração do serviço.
 * @param {string} dataSelecionada - Data no formato 'YYYY-MM-DD'.
 * @param {number} duracaoTotalMinutos - Duração total do agendamento (em minutos).
 * @returns {Promise<string[]>} Array de horários disponíveis no formato 'HH:MM'.
 */
async function verificarDisponibilidadeComDuracao(dataSelecionada, duracaoTotalMinutos) {
    // 1. EXTRAIR O DIA DA SEMANA
    const date = new Date(dataSelecionada + 'T00:00:00'); // Garante que a data seja interpretada corretamente
    const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const diaSemanaNome = diasDaSemana[date.getDay()];

    // 2. OBTER HORÁRIOS DE FUNCIONAMENTO
    const config = servicesConfig.BUSINESS_HOURS.find(d => d.dia === diaSemanaNome);
    
    if (!config || !config.funcionamento) {
        return []; // Estabelecimento fechado neste dia
    }

    const [horaAbertura, minutoAbertura] = config.abertura.split(':').map(Number);
    const [horaFechamento, minutoFechamento] = config.fechamento.split(':').map(Number);
    
    // Converte para minutos totais no dia
    const totalMinutosAbertura = horaAbertura * 60 + minutoAbertura;
    const totalMinutosFechamento = horaFechamento * 60 + minutoFechamento;
    
    // 3. GERAR TODOS OS SLOTS POSSÍVEIS (INTERVALOS DE 30 MINUTOS)
    let todosSlots = [];
    // O slot deve começar 30 minutos antes do tempo máximo, para que possa terminar no horário de fechamento
    const tempoMaximoSlot = totalMinutosFechamento - (duracaoTotalMinutos - 1); 

    for (let min = totalMinutosAbertura; min < tempoMaximoSlot; min += 30) {
        const hora = Math.floor(min / 60);
        const minuto = min % 60;
        const slotHora = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
        todosSlots.push(slotHora);
    }
    
    // 4. BUSCAR AGENDAMENTOS CONFIRMADOS/PENDENTES NO BANCO
    const agendamentosRef = db.ref('agendamentos').orderByChild('dataHoraInicio');
    const snapshot = await agendamentosRef.once('value');
    const agendamentosDoDia = [];
    
    snapshot.forEach(childSnapshot => {
        const agendamento = childSnapshot.val();
        const dataInicio = agendamento.dataHoraInicio.substring(0, 10);
        
        // Filtra apenas agendamentos para a data e com status ativo
        if (dataInicio === dataSelecionada && 
            (agendamento.status === 'pendente' || agendamento.status === 'confirmado')) {
            
            // Calcula o fim do agendamento existente
            const [horaInicio, minutoInicio] = agendamento.horaInicio.split(':').map(Number);
            const minutosInicioExistente = horaInicio * 60 + minutoInicio;
            const minutosFimExistente = minutosInicioExistente + agendamento.duracaoTotalMinutos;

            agendamentosDoDia.push({
                inicio: minutosInicioExistente,
                fim: minutosFimExistente
            });
        }
    });

    // 5. FILTRAR SLOTS QUE CONFLITAM COM AGENDAMENTOS EXISTENTES
    const slotsDisponiveis = todosSlots.filter(slotHora => {
        const [slotH, slotM] = slotHora.split(':').map(Number);
        const slotInicioMinutos = slotH * 60 + slotM;
        const slotFimMinutos = slotInicioMinutos + duracaoTotalMinutos;

        // Verifica se o NOVO slot (com sua duração) se sobrepõe a QUALQUER agendamento existente
        for (const agendamento of agendamentosDoDia) {
            // Conflito: O novo slot começa antes do fim do existente E termina depois do início do existente
            if (slotInicioMinutos < agendamento.fim && slotFimMinutos > agendamento.inicio) {
                return false; // Slot conflita, não é disponível
            }
        }
        return true; // Slot não conflita
    });

    return slotsDisponiveis;
}


// =============================================
// III. CRUD DE AGENDAMENTOS
// =============================================

/**
 * ➕ Cria um novo agendamento.
 * @param {object} agendamentoData - Dados do agendamento a ser salvo.
 */
async function criarAgendamento(agendamentoData) {
    try {
        const novoAgendamentoRef = db.ref('agendamentos').push();
        await novoAgendamentoRef.set({
            ...agendamentoData,
            agendamentoId: novoAgendamentoRef.key, // Salva a chave como ID
            status: 'pendente', // Status inicial
            createdAt: firebase.database.ServerValue.TIMESTAMP
        });
        return novoAgendamentoRef.key;
    } catch (error) {
        console.error("Erro ao criar agendamento:", error);
        throw error;
    }
}

/**
 * 📝 Atualiza o status de um agendamento (usado pelo Admin).
 * @param {string} agendamentoId - ID do agendamento.
 * @param {string} novoStatus - Novo status ('confirmado', 'cancelado', 'concluido').
 */
async function atualizarStatusAgendamento(agendamentoId, novoStatus) {
    try {
        await db.ref('agendamentos/' + agendamentoId).update({
            status: novoStatus,
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        });
        console.log(`Status do agendamento ${agendamentoId} atualizado para ${novoStatus}`);
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        throw error;
    }
}

/**
 * 👁️ Obtém agendamentos de um cliente específico.
 * @param {string} uid - ID do cliente.
 * @returns {firebase.database.Query} Query do Firebase para observação.
 */
function obterAgendamentosCliente(uid) {
    // Retorna a query para ser observada (on('value')) no cliente.html
    return db.ref('agendamentos').orderByChild('clienteId').equalTo(uid);
}

/**
 * 📊 Obtém todos os agendamentos (usado pelo Admin).
 * @returns {firebase.database.Query} Query do Firebase para observação.
 */
function obterTodosAgendamentos() {
    // Retorna a query para ser observada (on('value')) no admin.html
    return db.ref('agendamentos');
}

// =============================================
// IV. CHAT / MENSAGENS
// =============================================

/**
 * 💬 Envia uma mensagem para o chat do agendamento.
 * @param {string} agendamentoId - ID do agendamento (sala de chat).
 * @param {string} uid - ID do usuário que enviou a mensagem.
 * @param {string} nome - Nome do usuário.
 * @param {string} texto - Conteúdo da mensagem.
 */
async function enviarMensagem(agendamentoId, uid, nome, texto) {
    try {
        const novaMensagemRef = db.ref(`chats/${agendamentoId}/mensagens`).push();
        await novaMensagemRef.set({
            uid: uid,
            nome: nome,
            texto: texto,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
    }
}

/**
 * 👂 Escuta novas mensagens para um agendamento específico.
 * @param {string} agendamentoId - ID do agendamento.
 * @param {function} callback - Função chamada quando há novas mensagens.
 * @returns {firebase.database.Reference} Referência para ser usada com .off().
 */
function escutarMensagens(agendamentoId, callback) {
    const chatRef = db.ref(`chats/${agendamentoId}/mensagens`).orderByChild('timestamp');
    
    // Adiciona o listener
    chatRef.on('value', (snapshot) => {
        const mensagens = [];
        snapshot.forEach(childSnapshot => {
            mensagens.push({ ...childSnapshot.val(), id: childSnapshot.key });
        });
        callback(mensagens);
    });

    return chatRef; // Retorna a referência para que o listener possa ser removido
}

/**
 * 📢 Escuta todos os agendamentos em tempo real (usado pelo Admin).
 * Chama o callback sempre que houver uma alteração nos dados.
 * @param {function} callback - Função chamada com os dados atualizados { [id]: agendamentoData, ... }.
 * @returns {firebase.database.Reference} Referência para o listener.
 */
function listarAgendamentos(callback) {
    const agendamentosRef = db.ref('agendamentos');

    // Usa .on('value') para escutar alterações em tempo real
    agendamentosRef.on('value', (snapshot) => {
        // O método .val() retorna os dados como um objeto JavaScript
        const dadosAgendamentos = snapshot.val();
        
        // Chama a função de callback do admin.html com os dados
        // (Será o { [id]: agendamentoData, ... } esperado pelo cache)
        callback(dadosAgendamentos);
    });

    return agendamentosRef; // Retorna a referência (útil para desligar o listener, se necessário)
}

// ...
// IV. CHAT / MENSAGENS
// =============================================

/**
 * 💾 Salva as configurações de horário de funcionamento do negócio.
 * Nota: As configurações globais são salvas no nó 'configuracoes/horarios'.
 * @param {object} dadosHorarios - Objeto contendo as configurações de horário (slot_duracao, dias_funcionamento, etc.).
 */
async function salvarConfiguracaoHorarios(dadosHorarios) {
    try {
        // Usa 'configuracoes/horarios' como nó específico
        await db.ref('configuracoes/horarios').set(dadosHorarios);
        console.log("Configurações de horários salvas com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar configurações de horários:", error);
        throw error;
    }
}

/**
 * 🔍 Obtém as configurações de horário de funcionamento do negócio.
 * @returns {Promise<object | null>} Configurações de horário ou null.
 */
async function obterConfiguracaoHorarios() {
    try {
        const snapshot = await db.ref('configuracoes/horarios').once('value');
        return snapshot.val();
    } catch (error) {
        console.error("Erro ao obter configurações de horários:", error);
        return null;
    }
}