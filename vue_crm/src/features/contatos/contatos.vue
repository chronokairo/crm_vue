<template>
    <div>
        <h1>Contatos</h1>
        <form @submit.prevent="adicionarContato">
            <input v-model="novoContato.nome" placeholder="Nome" required />
            <input v-model="novoContato.email" placeholder="Email" required />
            <button type="submit">Adicionar</button>
        </form>
        <ul>
            <li v-for="contato in contatos" :key="contato.id">
                {{ contato.nome }} - {{ contato.email }}
                <button @click="removerContato(contato.id)">Remover</button>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            contatos: [],
            novoContato: {
                nome: '',
                email: ''
            },
            proximoId: 1
        };
    },
    methods: {
        adicionarContato() {
            this.contatos.push({
                id: this.proximoId++,
                nome: this.novoContato.nome,
                email: this.novoContato.email
            });
            this.novoContato.nome = '';
            this.novoContato.email = '';
        },
        removerContato(id) {
            this.contatos = this.contatos.filter(c => c.id !== id);
        }
    }
};
</script>

<style scoped>
div {
    max-width: 600px;
    margin: 40px auto;
    padding: 32px 28px;
    background: #f0f4f8;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(34,48,74,0.08);
    border: 1px solid #d1e0ee;
    color: #1a2233;
}
h1 {
    color: #22304a;
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    letter-spacing: 1px;
    text-shadow: 0 2px 8px rgba(34,48,74,0.06);
}
form {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}
input {
    padding: 10px 12px;
    border: 1px solid #d1e0ee;
    border-radius: 5px;
    background: #fff;
    font-size: 1.08rem;
    color: #22304a;
    flex: 1 1 180px;
    transition: border 0.2s;
}
input:focus {
    border: 1.5px solid #2563eb;
    outline: none;
    background: #f7fbff;
}
button {
    background: #2563eb;
    color: #fff;
    border: none;
    padding: 10px 22px;
    border-radius: 5px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(37,99,235,0.08);
}
button:hover {
    background: #22304a;
}
ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
li {
    background: #fff;
    border: 1px solid #d1e0ee;
    border-radius: 5px;
    margin-bottom: 12px;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #22304a;
    font-size: 1.08rem;
    font-weight: 500;
    letter-spacing: 0.2px;
    box-shadow: 0 2px 8px rgba(34,48,74,0.04);
}
li button {
    background: #e53e3e;
    color: #fff;
    padding: 7px 16px;
    border-radius: 4px;
    font-size: 0.98rem;
    font-weight: 600;
    border: none;
    margin-left: 16px;
    transition: background 0.2s;
    box-shadow: none;
}
li button:hover {
    background: #b91c1c;
}
@media (max-width: 700px) {
    div {
        padding: 16px 4vw;
    }
    form {
        flex-direction: column;
        gap: 10px;
    }
}
</style>