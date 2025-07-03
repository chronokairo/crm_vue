# Informações de Login - CRM Vue

## Credenciais de Teste (Mock)

Para fazer login na aplicação durante o desenvolvimento, use as seguintes credenciais:

**Email:** `admin@crm.com`  
**Senha:** `123456`

## Como Acessar

1. Execute o projeto em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Abra o navegador em: `http://localhost:3001` (ou a porta indicada no terminal)

3. Use as credenciais acima para fazer login

## Observações

- Estas são credenciais **mock** apenas para desenvolvimento
- O sistema de autenticação está simulado localmente
- Quando integrar com backend real, substitua o código mock em `src/services/auth.ts`
- O usuário logado terá role de 'admin' e acesso completo ao sistema

## Funcionalidades Disponíveis Após Login

- Dashboard com métricas
- Gestão de Contatos (CRUD)
- Pipeline de Vendas (Deals) com drag & drop
- Gestão de Atividades com calendário
- Configurações do sistema
