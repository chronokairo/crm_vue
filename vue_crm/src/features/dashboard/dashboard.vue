<template>
    <div class="dashboard">
        <h1>Painel do CRM</h1>
        <div class="stats">
            <div class="stat-card">
                <h2>{{ leadsCount }}</h2>
                <p>Leads</p>
            </div>
            <div class="stat-card">
                <h2>{{ opportunitiesCount }}</h2>
                <p>Oportunidades</p>
            </div>
            <div class="stat-card">
                <h2>{{ clientsCount }}</h2>
                <p>Clientes</p>
            </div>
        </div>
        <div class="recent-activities">
            <h3>Atividades Recentes</h3>
            <ul>
                <li v-for="activity in recentActivities" :key="activity.id">
                    {{ activity.date }} - {{ activity.description }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Simulação de dados
const leadsCount = ref(120)
const opportunitiesCount = ref(45)
const clientsCount = ref(30)
const recentActivities = ref([
    { id: 1, date: '2024-06-10', description: 'Novo lead adicionado: João Silva' },
    { id: 2, date: '2024-06-09', description: 'Oportunidade convertida em cliente: Maria Souza' },
    { id: 3, date: '2024-06-08', description: 'Contato realizado com lead: Pedro Lima' }
])

onMounted(() => {
    // Aqui você pode buscar dados reais da API do CRM
})
</script>

<style scoped>
.dashboard {
    padding: 2rem;
    background: #f0f4f8;
    min-height: 100vh;
    color: #1a2233;
}
.stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
}
.stat-card {
    background: #fff;
    padding: 2rem 1.5rem;
    border-radius: 12px;
    text-align: center;
    flex: 1;
    box-shadow: 0 4px 16px rgba(34,48,74,0.08);
    border: 1px solid #d1e0ee;
    transition: transform 0.15s;
}
.stat-card:hover {
    transform: translateY(-4px) scale(1.03);
    box-shadow: 0 8px 24px rgba(34,48,74,0.12);
}
.stat-card h2 {
    margin: 0;
    font-size: 3rem;
    color: #2563eb;
    font-weight: 700;
    letter-spacing: 1px;
    text-shadow: 0 2px 8px rgba(37,99,235,0.08);
}
.stat-card p {
    margin: 0.75rem 0 0;
    color: #22304a;
    font-weight: 600;
    font-size: 1.15rem;
    letter-spacing: 0.5px;
}
h1 {
    color: #22304a;
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 2rem;
    letter-spacing: 1px;
    text-shadow: 0 2px 8px rgba(34,48,74,0.06);
}
.recent-activities {
    background: #fff;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid #d1e0ee;
    box-shadow: 0 2px 8px rgba(34,48,74,0.04);
    margin-top: 2rem;
}
.recent-activities h3 {
    color: #2563eb;
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 1rem;
}
.recent-activities ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
.recent-activities li {
    padding: 0.75rem 0;
    border-bottom: 1px solid #e3eaf2;
    color: #22304a;
    font-size: 1.08rem;
    font-weight: 500;
    letter-spacing: 0.2px;
}
.recent-activities li:last-child {
    border-bottom: none;
}
@media (max-width: 900px) {
    .stats {
        flex-direction: column;
        gap: 1rem;
    }
}
</style>