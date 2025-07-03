<template>
    <div class="activities">
        <h1>Atividades</h1>
        <button @click="showAddModal = true">Adicionar Atividade</button>
        <ul>
            <li v-for="activity in activities" :key="activity.id">
                <strong>{{ activity.title }}</strong> - {{ activity.date }}
                <button @click="removeActivity(activity.id)">Remover</button>
            </li>
        </ul>

        <div v-if="showAddModal" class="modal">
            <h2>Nova Atividade</h2>
            <form @submit.prevent="addActivity">
                <input v-model="newActivity.title" placeholder="Título" required />
                <input v-model="newActivity.date" type="date" required />
                <button type="submit">Salvar</button>
                <button type="button" @click="showAddModal = false">Cancelar</button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Activities',
    data() {
        return {
            activities: [
                { id: 1, title: 'Reunião com cliente', date: '2024-06-10' },
                { id: 2, title: 'Follow-up de proposta', date: '2024-06-12' }
            ],
            showAddModal: false,
            newActivity: {
                title: '',
                date: ''
            }
        };
    },
    methods: {
        addActivity() {
            if (this.newActivity.title && this.newActivity.date) {
                this.activities.push({
                    id: Date.now(),
                    title: this.newActivity.title,
                    date: this.newActivity.date
                });
                this.newActivity.title = '';
                this.newActivity.date = '';
                this.showAddModal = false;
            }
        },
        removeActivity(id) {
            this.activities = this.activities.filter(a => a.id !== id);
        }
    }
};
</script>

<style scoped>
.activities {
    max-width: 650px;
    margin: 48px auto;
    background: #f0f4f8;
    padding: 32px 28px;
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
button {
    background: #2563eb;
    color: #fff;
    border: none;
    padding: 10px 22px;
    border-radius: 5px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    margin-right: 8px;
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
    margin-bottom: 12px;
    background: #fff;
    border: 1px solid #d1e0ee;
    border-radius: 5px;
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
.modal {
    background: #fff;
    border: 1.5px solid #2563eb;
    box-shadow: 0 4px 16px rgba(37,99,235,0.10);
    padding: 28px 20px 20px 20px;
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 10;
    border-radius: 12px;
    color: #22304a;
    min-width: 320px;
}
.modal h2 {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 18px;
    color: #2563eb;
}
input {
    padding: 10px 12px;
    border: 1px solid #d1e0ee;
    border-radius: 5px;
    margin-bottom: 12px;
    font-size: 1.08rem;
    background: #f9fbfd;
    color: #22304a;
    width: 100%;
    transition: border 0.2s;
    display: block;
}
input:focus {
    border: 1.5px solid #2563eb;
    outline: none;
    background: #f7fbff;
}
@media (max-width: 700px) {
    .activities {
        padding: 16px 4vw;
    }
    .modal {
        min-width: 0;
        width: 90vw;
        left: 5vw;
        transform: none;
    }
}
</style>