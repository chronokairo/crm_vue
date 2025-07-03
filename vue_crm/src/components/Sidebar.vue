<template>
  <nav class="sidebar">
    <ul>
      <li><router-link to="/dashboard">Dashboard</router-link></li>
      <li><router-link to="/contatos">Contatos</router-link></li>
      <li><router-link to="/deals">Negócios</router-link></li>
      <li><router-link to="/activities">Atividades</router-link></li>
      <li><router-link to="/reports">Relatórios</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Sidebar',
};
</script>

<style scoped>
.sidebar {
  width: 220px;
  height: 100vh;
  background: #1e293b;
  color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  padding-top: 2rem;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  margin: 1rem 0;
}
.sidebar a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  display: block;
  border-radius: 4px;
  transition: background 0.2s;
}
.sidebar a.router-link-exact-active,
.sidebar a:hover {
  background: #334155;
}
</style>
