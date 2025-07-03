<template>
    <div class="reports">
        <h1>Relatórios do CRM</h1>
        <div class="filters">
            <label>
                Período:
                <input type="date" v-model="filters.startDate" /> -
                <input type="date" v-model="filters.endDate" />
            </label>
            <label>
                Vendedor:
                <select v-model="filters.salesperson">
                    <option value="">Todos</option>
                    <option v-for="user in salespeople" :key="user.id" :value="user.name">
                        {{ user.name }}
                    </option>
                </select>
            </label>
            <button @click="fetchReports">Gerar Relatório</button>
        </div>
        <table v-if="reports.length">
            <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Vendedor</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="report in reports" :key="report.id">
                    <td>{{ report.client }}</td>
                    <td>{{ report.salesperson }}</td>
                    <td>{{ report.status }}</td>
                    <td>{{ report.date }}</td>
                    <td>{{ report.value | currency }}</td>
                </tr>
            </tbody>
        </table>
        <div v-else>
            Nenhum relatório encontrado.
        </div>
    </div>
</template>

<script>
export default {
    name: "Reports",
    data() {
        return {
            filters: {
                startDate: "",
                endDate: "",
                salesperson: ""
            },
            salespeople: [
                { id: 1, name: "João" },
                { id: 2, name: "Maria" },
                { id: 3, name: "Pedro" }
            ],
            reports: []
        };
    },
    methods: {
        fetchReports() {
            // Simulação de busca de dados do CRM
            const allReports = [
                {
                    id: 1,
                    client: "Empresa A",
                    salesperson: "João",
                    status: "Fechado",
                    date: "2024-06-01",
                    value: 5000
                },
                {
                    id: 2,
                    client: "Empresa B",
                    salesperson: "Maria",
                    status: "Em negociação",
                    date: "2024-06-03",
                    value: 3000
                },
                {
                    id: 3,
                    client: "Empresa C",
                    salesperson: "Pedro",
                    status: "Perdido",
                    date: "2024-06-05",
                    value: 0
                }
            ];

            this.reports = allReports.filter(r => {
                const inDateRange =
                    (!this.filters.startDate || r.date >= this.filters.startDate) &&
                    (!this.filters.endDate || r.date <= this.filters.endDate);
                const bySalesperson =
                    !this.filters.salesperson || r.salesperson === this.filters.salesperson;
                return inDateRange && bySalesperson;
            });
        }
    },
    filters: {
        currency(value) {
            return value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
        }
    }
};
</script>

<style scoped>
.reports {
    max-width: 900px;
    margin: 48px auto;
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
.filters {
    margin-bottom: 22px;
    display: flex;
    gap: 24px;
    align-items: center;
    background: #f4f8fb;
    padding: 16px 20px;
    border-radius: 8px;
    border: 1px solid #d1e0ee;
    flex-wrap: wrap;
}
label {
    font-weight: 600;
    color: #22304a;
    font-size: 1.08rem;
    margin-bottom: 0;
}
input, select {
    padding: 8px 12px;
    border: 1px solid #d1e0ee;
    border-radius: 5px;
    margin-left: 8px;
    font-size: 1.08rem;
    background: #fff;
    color: #22304a;
    transition: border 0.2s;
}
input:focus, select:focus {
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
table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(34,48,74,0.04);
    margin-top: 24px;
}
th, td {
    border: 1px solid #d1e0ee;
    padding: 12px;
    text-align: left;
    font-size: 1.08rem;
}
th {
    background: #f4f8fb;
    color: #22304a;
    font-weight: 700;
    letter-spacing: 0.5px;
}
td {
    color: #22304a;
    font-weight: 500;
}
@media (max-width: 900px) {
    .reports {
        padding: 16px 4vw;
    }
    .filters {
        flex-direction: column;
        gap: 12px;
        padding: 12px 8px;
    }
    table, th, td {
        font-size: 0.98rem;
    }
}
</style>