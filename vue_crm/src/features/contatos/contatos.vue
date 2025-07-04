<template>
    <div>
        <h1>Contatos</h1>
        <form @submit.prevent="adicionarContato" class="contato-form">
            <div class="form-col">
                <input v-model="novoContato.nome" placeholder="Nome*" required />
                <input v-model="novoContato.email" placeholder="Email*" required @input="validarEmail" :class="{ invalido: !emailValido && novoContato.email }" />
                <input v-model="novoContato.telefone" placeholder="Telefone*" required @input="mascararTelefone" maxlength="15" :class="{ invalido: !telefoneValido && novoContato.telefone }" />
                <input v-model="novoContato.empresa" placeholder="Empresa*" required />
                <input v-model="novoContato.cargo" placeholder="Cargo*" required />
            </div>
            <div class="form-col">
                <input v-model="novoContato.endereco" placeholder="Endereço" />
                <input v-model="novoContato.website" placeholder="Website" />
                <input v-model="novoContato.linkedin" placeholder="LinkedIn" />
                <textarea v-model="novoContato.observacoes" placeholder="Observações/Notas"></textarea>
            </div>
            <button type="submit" :disabled="!formValido">Adicionar</button>
        </form>
        <div class="header-profissional">
            <nav class="breadcrumb">Dashboard &gt; Contatos</nav>
            <div class="header-row">
                <h1>Contatos <span class="contador">({{ contatos.length }})</span></h1>
                <div class="header-actions">
                    <button @click="abrirModalNovo">Adicionar</button>
                    <button>Importar</button>
                    <button @click="exportarTodos">Exportar</button>
                </div>
            </div>
            <div class="filtros-rapidos">
                <button :class="{ ativo: filtroStatus === '' }" @click="filtroStatus = ''">Todos</button>
                <button :class="{ ativo: filtroStatus === 'Ativo' }" @click="filtroStatus = 'Ativo'">Ativos</button>
                <button :class="{ ativo: filtroStatus === 'Inativo' }" @click="filtroStatus = 'Inativo'">Inativos</button>
                <button :class="{ ativo: filtroStatus === 'VIP' }" @click="filtroStatus = 'VIP'">VIP</button>
            </div>
            <div class="busca-filtros">
                <input v-model="busca" placeholder="Buscar por nome, email, empresa..." />
            </div>
            <div class="filtros-avancados">
                <input v-model="filtroCargo" placeholder="Filtrar por Cargo" />
                <input v-model="filtroEmpresa" placeholder="Filtrar por Empresa" />
                <input v-model="filtroData" type="date" placeholder="Filtrar por Data de Criação" />
                <button @click="salvarFiltroPersonalizado">Salvar Filtro</button>
                <button @click="limparFiltros">Limpar Filtros</button>
                <div class="filtros-salvos">
                    <span v-for="f in filtrosSalvos" :key="f.nome">
                        <button @click="aplicarFiltroSalvo(f)">{{ f.nome }}</button>
                    </span>
                </div>
            </div>
            <div class="cards-estatisticas">
                <div class="card-estatistica">
                    <div class="valor">{{ contatos.length }}</div>
                    <div class="label">Total de Contatos</div>
                </div>
                <div class="card-estatistica">
                    <div class="valor">{{ contatosAdicionadosHoje }}</div>
                    <div class="label">Adicionados Hoje</div>
                </div>
                <div class="card-estatistica">
                    <div class="valor">{{ contatosAtivos }}</div>
                    <div class="label">Ativos</div>
                </div>
                <div class="card-estatistica">
                    <div class="valor">{{ contatosVIP }}</div>
                    <div class="label">VIP</div>
                </div>
            </div>
        </div>
        <Table
            :headers="headers"
            :rows="contatosPaginados"
            :selected-ids="selecionados"
            :all-selected="todosSelecionados"
            :sort-key="sortKey"
            :sort-order="sortOrder"
            :page="pagina"
            :page-size="tamanhoPagina"
            @toggle="toggleSelecionado"
            @toggle-all="toggleTodos"
            @sort="ordenarPor"
            @update:page="setPagina"
            @update:pageSize="setTamanhoPagina"
        >
            <template #batch-actions>
                <button v-if="selecionados.length" @click="removerSelecionados" class="danger">Deletar Selecionados</button>
                <button v-if="selecionados.length" @click="exportarSelecionados">Exportar Selecionados</button>
                <button v-if="selecionados.length" @click="marcarVipSelecionados">Marcar como VIP</button>
            </template>
            <template #actions="{ row }">
                <button @click="abrirModalEditar(row)">Editar</button>
                <button @click="removerContato(row.id)">Remover</button>
                <button v-if="!row.vip" @click="row.vip = true">Marcar VIP</button>
                <button v-if="row.email" @click="window.open('mailto:' + row.email)">Email</button>
            </template>
        </Table>
        <ContatoModal
            v-if="showModal"
            :value="modalContato"
            :is-edit="modalEdit"
            @close="showModal = false"
            @save="salvarModal"
            @saveAndNew="salvarModalENovo"
        />
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import ContatoModal from '@/components/ContatoModal.vue';

function validarEmailFormat(email) {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
}
function mascararTelefoneBR(valor) {
    valor = valor.replace(/\D/g, '');
    if (valor.length <= 10) {
        return valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    } else {
        return valor.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
}

export default {
    components: { Table, ContatoModal },
    data() {
        return {
            contatos: [],
            novoContato: {
                nome: '',
                email: '',
                telefone: '',
                empresa: '',
                cargo: '',
                endereco: '',
                website: '',
                linkedin: '',
                observacoes: ''
            },
            proximoId: 1,
            emailValido: true,
            telefoneValido: true,
            headers: [
                { key: 'nome', label: 'Nome' },
                { key: 'email', label: 'Email' },
                { key: 'telefone', label: 'Telefone' },
                { key: 'empresa', label: 'Empresa' },
                { key: 'cargo', label: 'Cargo' },
                { key: 'status', label: 'Status' },
                { key: 'vip', label: 'VIP' }
            ],
            selecionados: [],
            sortKey: 'nome',
            sortOrder: 'asc',
            pagina: 1,
            tamanhoPagina: 10,
            filtroStatus: '',
            busca: '',
            filtroCargo: '',
            filtroEmpresa: '',
            filtroData: '',
            filtrosSalvos: [],
            showModal: false,
            modalEdit: false,
            modalContato: null
        };
    },
    computed: {
        formValido() {
            return (
                this.novoContato.nome &&
                this.novoContato.email &&
                this.novoContato.telefone &&
                this.novoContato.empresa &&
                this.novoContato.cargo &&
                this.emailValido &&
                this.telefoneValido
            );
        },
        contatosFiltrados() {
            let lista = this.contatos;
            if (this.filtroStatus === 'Ativo') lista = lista.filter(c => c.status === 'Ativo');
            if (this.filtroStatus === 'Inativo') lista = lista.filter(c => c.status === 'Inativo');
            if (this.filtroStatus === 'VIP') lista = lista.filter(c => c.vip);
            if (this.filtroCargo) lista = lista.filter(c => c.cargo && c.cargo.toLowerCase().includes(this.filtroCargo.toLowerCase()));
            if (this.filtroEmpresa) lista = lista.filter(c => c.empresa && c.empresa.toLowerCase().includes(this.filtroEmpresa.toLowerCase()));
            if (this.filtroData) lista = lista.filter(c => c.dataCriacao && c.dataCriacao.startsWith(this.filtroData));
            if (this.busca) {
                const b = this.busca.toLowerCase();
                lista = lista.filter(c =>
                    (c.nome && c.nome.toLowerCase().includes(b)) ||
                    (c.email && c.email.toLowerCase().includes(b)) ||
                    (c.empresa && c.empresa.toLowerCase().includes(b)) ||
                    (c.cargo && c.cargo.toLowerCase().includes(b))
                );
            }
            return lista;
        },
        contatosOrdenados() {
            return [...this.contatosFiltrados].sort((a, b) => {
                let vA = a[this.sortKey] || '';
                let vB = b[this.sortKey] || '';
                if (typeof vA === 'string') vA = vA.toLowerCase();
                if (typeof vB === 'string') vB = vB.toLowerCase();
                if (vA < vB) return this.sortOrder === 'asc' ? -1 : 1;
                if (vA > vB) return this.sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        },
        contatosPaginados() {
            const start = (this.pagina - 1) * this.tamanhoPagina;
            return this.contatosOrdenados.slice(start, start + this.tamanhoPagina);
        },
        todosSelecionados() {
            return this.contatosPaginados.length > 0 && this.contatosPaginados.every(c => this.selecionados.includes(c.id));
        },
        contatosAdicionadosHoje() {
            const hoje = new Date().toISOString().slice(0, 10);
            return this.contatos.filter(c => c.dataCriacao && c.dataCriacao.startsWith(hoje)).length;
        },
        contatosAtivos() {
            return this.contatos.filter(c => c.status === 'Ativo').length;
        },
        contatosVIP() {
            return this.contatos.filter(c => c.vip).length;
        }
    },
    methods: {
        adicionarContato() {
            if (!this.formValido) return;
            this.contatos.push({
                id: this.proximoId++,
                nome: this.novoContato.nome,
                email: this.novoContato.email,
                telefone: this.novoContato.telefone,
                empresa: this.novoContato.empresa,
                cargo: this.novoContato.cargo,
                endereco: this.novoContato.endereco,
                website: this.novoContato.website,
                linkedin: this.novoContato.linkedin,
                observacoes: this.novoContato.observacoes,
                status: 'Ativo',
                vip: false,
                dataCriacao: new Date().toISOString()
            });
            Object.keys(this.novoContato).forEach(k => this.novoContato[k] = '');
            this.emailValido = true;
            this.telefoneValido = true;
        },
        exportarTodos() {
            const csv = [
                Object.keys(this.headers.reduce((acc, h) => { acc[h.key] = ''; return acc; }, {})).join(','),
                ...this.contatos.map(c => this.headers.map(h => '"' + (c[h.key] || '') + '"').join(','))
            ].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'contatos.csv';
            a.click();
            URL.revokeObjectURL(url);
        },
        abrirModalNovo() {
            this.modalEdit = false;
            this.modalContato = null;
            this.showModal = true;
        },
        abrirModalEditar(contato) {
            this.modalEdit = true;
            this.modalContato = { ...contato };
            this.showModal = true;
        },
        salvarModal(contato) {
            if (this.modalEdit) {
                const idx = this.contatos.findIndex(c => c.id === contato.id);
                if (idx !== -1) this.contatos.splice(idx, 1, { ...contato });
            } else {
                contato.id = this.proximoId++;
                contato.dataCriacao = new Date().toISOString();
                contato.ultimaInteracao = new Date().toISOString();
                this.contatos.push(contato);
            }
            this.showModal = false;
        },
        salvarModalENovo(contato) {
            contato.id = this.proximoId++;
            contato.dataCriacao = new Date().toISOString();
            contato.ultimaInteracao = new Date().toISOString();
            this.contatos.push(contato);
            this.showModal = true;
        },
        salvarFiltroPersonalizado() {
            this.filtrosSalvos.push({
                status: this.filtroStatus,
                cargo: this.filtroCargo,
                empresa: this.filtroEmpresa,
                data: this.filtroData,
                nome: `Filtro ${this.filtrosSalvos.length + 1}`
            });
        },
        aplicarFiltroSalvo(filtro) {
            this.filtroStatus = filtro.status;
            this.filtroCargo = filtro.cargo;
            this.filtroEmpresa = filtro.empresa;
            this.filtroData = filtro.data;
        },
        limparFiltros() {
            this.filtroStatus = '';
            this.filtroCargo = '';
            this.filtroEmpresa = '';
            this.filtroData = '';
            this.busca = '';
        },
        removerContato(id) {
            this.contatos = this.contatos.filter(c => c.id !== id);
            this.selecionados = this.selecionados.filter(sid => sid !== id);
        },
        removerSelecionados() {
            this.contatos = this.contatos.filter(c => !this.selecionados.includes(c.id));
            this.selecionados = [];
        },
        exportarSelecionados() {
            const selecionados = this.contatos.filter(c => this.selecionados.includes(c.id));
            const csv = [
                Object.keys(this.headers.reduce((acc, h) => { acc[h.key] = ''; return acc; }, {})).join(','),
                ...selecionados.map(c => this.headers.map(h => '"' + (c[h.key] || '') + '"').join(','))
            ].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'contatos.csv';
            a.click();
            URL.revokeObjectURL(url);
        },
        marcarVipSelecionados() {
            this.contatos.forEach(c => {
                if (this.selecionados.includes(c.id)) c.vip = true;
            });
            this.selecionados = [];
        },
        validarEmail() {
            this.emailValido = validarEmailFormat(this.novoContato.email);
        },
        mascararTelefone() {
            this.novoContato.telefone = mascararTelefoneBR(this.novoContato.telefone);
            this.telefoneValido = this.novoContato.telefone.length >= 14;
        },
        toggleSelecionado(id, checked) {
            if (checked) {
                if (!this.selecionados.includes(id)) this.selecionados.push(id);
            } else {
                this.selecionados = this.selecionados.filter(sid => sid !== id);
            }
            // Atualiza última interação
            const contato = this.contatos.find(c => c.id === id);
            if (contato) contato.ultimaInteracao = new Date().toISOString();
        },
        toggleTodos(checked) {
            if (checked) {
                this.selecionados = this.contatosPaginados.map(c => c.id);
            } else {
                this.selecionados = [];
            }
        },
        ordenarPor(key) {
            if (this.sortKey === key) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortKey = key;
                this.sortOrder = 'asc';
            }
        },
        setPagina(p) {
            this.pagina = p;
        },
        setTamanhoPagina(tp) {
            this.tamanhoPagina = tp;
            this.pagina = 1;
        }
    }
};
</script>

<style scoped>
.header-profissional {
    margin-bottom: 32px;
}
.breadcrumb {
    color: #6b7280;
    font-size: 0.98rem;
    margin-bottom: 8px;
}
.header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}
.contador {
    color: #2563eb;
    font-size: 1.1rem;
    margin-left: 6px;
}
.header-actions button {
    margin-left: 10px;
}
.filtros-rapidos {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}
.filtros-rapidos button {
    background: #e5e7eb;
    color: #22304a;
    border: none;
    padding: 6px 16px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}
.filtros-rapidos button.ativo, .filtros-rapidos button:hover {
    background: #2563eb;
    color: #fff;
}
.busca-filtros {
    margin-bottom: 18px;
}
.busca-filtros input {
    width: 100%;
    max-width: 340px;
    padding: 8px 12px;
    border: 1px solid #d1e0ee;
    border-radius: 5px;
    font-size: 1.05rem;
}
.filtros-avancados {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
    flex-wrap: wrap;
}
.filtros-avancados input {
    padding: 8px 12px;
    border: 1px solid #d1e0ee;
    border-radius: 5px;
    font-size: 1rem;
    color: #22304a;
}
.filtros-avancados button {
    background: #2563eb;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
}
.filtros-avancados button:hover {
    background: #22304a;
}
.filtros-salvos {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 8px;
}
.filtros-salvos button {
    background: #e5e7eb;
    color: #22304a;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}
.filtros-salvos button:hover {
    background: #2563eb;
    color: #fff;
}
.cards-estatisticas {
    display: flex;
    gap: 18px;
    margin-bottom: 18px;
}
.card-estatistica {
    background: #fff;
    border: 1px solid #d1e0ee;
    border-radius: 8px;
    padding: 16px 24px;
    min-width: 120px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(34,48,74,0.04);
}
.card-estatistica .valor {
    font-size: 1.5rem;
    font-weight: 800;
    color: #2563eb;
}
.card-estatistica .label {
    color: #22304a;
    font-size: 1rem;
    margin-top: 2px;
}
.danger {
    background: #e53e3e !important;
    color: #fff !important;
}
div {
    max-width: 1100px;
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
.contato-form {
    display: flex;
    gap: 32px;
    margin-bottom: 32px;
    flex-wrap: wrap;
}
.form-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1 1 320px;
}
input, textarea {
    padding: 10px 12px;
    border: 1px solid #d1e0ee;
    border-radius: 5px;
    background: #fff;
    font-size: 1.08rem;
    color: #22304a;
    transition: border 0.2s;
}
input:focus, textarea:focus {
    border: 1.5px solid #2563eb;
    outline: none;
    background: #f7fbff;
}
input.invalido, textarea.invalido {
    border: 1.5px solid #e53e3e;
    background: #fff5f5;
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
    margin-top: 12px;
    align-self: flex-start;
}
button:disabled {
    background: #b3c6f7;
    cursor: not-allowed;
}
button:hover:not(:disabled) {
    background: #22304a;
}
@media (max-width: 900px) {
    div {
        padding: 16px 2vw;
    }
    .contato-form {
        flex-direction: column;
        gap: 18px;
    }
    .form-col {
        flex: 1 1 100%;
    }
}
</style>
/* fim do style */