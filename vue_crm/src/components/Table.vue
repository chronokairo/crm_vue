<template>
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th><input type="checkbox" :checked="allSelected" @change="$emit('toggle-all', $event.target.checked)" /></th>
          <th v-for="header in headers" :key="header.key" @click="$emit('sort', header.key)">
            {{ header.label }}
            <span v-if="sortKey === header.key">
              <span v-if="sortOrder === 'asc'">▲</span>
              <span v-else>▼</span>
            </span>
          </th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td><input type="checkbox" :checked="selectedIds.includes(row.id)" @change="$emit('toggle', row.id, $event.target.checked)" /></td>
          <td v-for="header in headers" :key="header.key">
            <template v-if="header.key === 'avatar'">
              <div class="avatar-table" :title="row.nome">
                <span v-if="row.nome">{{ row.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) }}</span>
              </div>
            </template>
            <template v-else-if="header.key === 'vip'">
              <span v-if="row.vip" class="badge-vip">VIP</span>
            </template>
            <template v-else-if="header.key === 'status'">
              <span :class="'badge-status ' + (row.status ? row.status.toLowerCase() : '')">{{ row.status }}</span>
            </template>
            <template v-else-if="header.key === 'ultimaInteracao'">
              <span v-if="row.ultimaInteracao">{{ new Date(row.ultimaInteracao).toLocaleString() }}</span>
            </template>
            <template v-else>
              {{ row[header.key] }}
            </template>
          </td>
          <td>
            <slot name="actions" :row="row"></slot>
          </td>
        </tr>
.avatar-table {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2563eb;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 auto;
}
.badge-vip {
  background: #eab308;
  color: #fff;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 0.95rem;
  margin-left: 2px;
}
.badge-status {
  background: #2563eb;
  color: #fff;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 0.95rem;
  margin-left: 2px;
}
      </tbody>
    </table>
    <div class="table-actions">
      <slot name="batch-actions"></slot>
    </div>
    <div class="pagination">
      <label>
        Exibir
        <select :value="localPageSize" @change="onPageSizeChange">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
        por página
      </label>
      <button :disabled="page === 1" @click="$emit('update:page', page - 1)">Anterior</button>
      <span>Página {{ page }}</span>
      <button :disabled="rows.length < pageSize" @click="$emit('update:page', page + 1)">Próxima</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    headers: Array,
    rows: Array,
    selectedIds: Array,
    allSelected: Boolean,
    sortKey: String,
    sortOrder: String,
    page: Number,
    pageSize: Number
  },
  emits: ['toggle', 'toggle-all', 'sort', 'update:page', 'update:pageSize'],
  data() {
    return {
      localPageSize: this.pageSize
    };
  },
  watch: {
    pageSize(newVal) {
      this.localPageSize = newVal;
    }
  },
  methods: {
    onPageSizeChange(e) {
      const val = Number(e.target.value);
      this.localPageSize = val;
      this.$emit('update:pageSize', val);
    }
  }
};
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  margin-bottom: 16px;
}
th, td {
  padding: 12px 10px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  font-size: 1rem;
}
th {
  background: #f0f4f8;
  font-weight: 700;
  cursor: pointer;
  user-select: none;
}
tr:hover {
  background: #f7fafc;
}
.table-actions {
  margin-bottom: 10px;
  display: flex;
  gap: 12px;
}
.pagination {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
