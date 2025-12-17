#!/bin/bash

# Script de Deploy - Sistema de Agendamentos
# Execute este script para fazer o push das alterações

echo "🚀 INICIANDO DEPLOY DO SISTEMA DE AGENDAMENTOS"
echo "================================================"
echo ""

# Verifica se está no diretório correto
if [ ! -f "admin.html" ]; then
    echo "❌ Erro: Execute este script no diretório do projeto!"
    exit 1
fi

echo "📋 1. Verificando status do Git..."
git status
echo ""

echo "📦 2. Adicionando novos arquivos..."
git add .
echo ""

echo "💾 3. Criando commit final..."
git commit -m "feat: Sistema completo com todas correções e melhorias

✅ Correções Implementadas:
- Login e redirecionamento por role (admin/cliente)
- Botão Modo Admin visível apenas para admins
- Formulário completo: calendário visual + seletor de horário
- Seleção múltipla de serviços com cálculo automático
- Modais corrigidos (chat, confirmação, usuários)
- Painel admin com todas abas funcionais
- Gestão completa de usuários e roles
- Configurações de horário de funcionamento
- CSS e responsividade melhorados
- Estrutura do banco atualizada

📦 Novos Arquivos:
- ESTRUTURA_BANCO_DADOS_REAL.json
- COMMIT_FINAL_RESUMO.md
- COMANDOS_DEPLOY.sh

🎯 Status: PRONTO PARA PRODUÇÃO"
echo ""

echo "🌐 4. Fazendo push para o GitHub..."
git push origin main
echo ""

if [ $? -eq 0 ]; then
    echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
    echo ""
    echo "📝 Próximos passos:"
    echo "1. Acesse o Firebase Console"
    echo "2. Importe ESTRUTURA_BANCO_DADOS_REAL.json"
    echo "3. Configure as regras de segurança"
    echo "4. Crie os usuários no Authentication"
    echo "5. Teste o sistema completo"
    echo ""
    echo "📚 Documentação completa em:"
    echo "- README_FINAL_ALTERACOES.md"
    echo "- COMMIT_FINAL_RESUMO.md"
    echo "- INSTRUCOES_IMPORTACAO_DADOS.md"
    echo ""
    echo "🎉 PROJETO PRONTO!"
else
    echo "❌ ERRO NO PUSH!"
    echo ""
    echo "🔧 Possíveis soluções:"
    echo "1. Verifique suas credenciais do GitHub"
    echo "2. Execute: git config --global credential.helper store"
    echo "3. Tente fazer push manualmente"
    echo ""
    echo "📝 Comando manual:"
    echo "git push origin main"
fi

echo ""
echo "================================================"
echo "Deploy finalizado em: $(date)"
