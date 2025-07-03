<script setup>
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <nav>
        <ul>
          <li>
            <router-link to="/dashboard" class="nav-link" active-class="active-link" exact>
              Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/contatos" class="nav-link" active-class="active-link">
              Contatos
            </router-link>
          </li>
          <li>
            <router-link to="/negocios" class="nav-link" active-class="active-link">
              Negócios
            </router-link>
          </li>
          <li>
            <router-link to="/atividades" class="nav-link" active-class="active-link">
              Atividades
            </router-link>
          </li>
          <li>
            <router-link to="/relatorios" class="nav-link" active-class="active-link">
              Relatórios
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>
    <section class="main-section">
      <header class="main-header">
        <h1>CRM Vue</h1>
      </header>
      <main class="main-content">
        <router-view />
      </main>
    </section>
  </div>
</template>

<style>
:root {
  --sidebar-width: 220px;
  --sidebar-bg: #22304a;
  --sidebar-bg-hover: #2d4060;
  --sidebar-link-active: #4fa3ff;
  --main-bg: #f4f8fb;
  --header-bg: #f9fbfd;
  --header-shadow: 0 2px 8px rgba(34,48,74,0.06);
  --sidebar-shadow: 2px 0 8px rgba(34,48,74,0.04);
  --text-main: #22304a;
  --text-light: #eaf3fb;
  --transition: 0.2s;
}

.layout {
  display: flex;
  min-height: 100vh;
  background: var(--main-bg);
}

.sidebar {
  width: var(--sidebar-width);
  background: var(--sidebar-bg);
  padding-top: 2rem;
  min-height: 100vh;
  box-shadow: var(--sidebar-shadow);
  display: flex;
  flex-direction: column;
  transition: width var(--transition);
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.sidebar li {
  margin: 0.5rem 0;
}

.nav-link {
  color: var(--text-light);
  text-decoration: none;
  font-size: 1.1rem;
  display: block;
  padding: 0.75rem 1.5rem;
  border-left: 4px solid transparent;
  transition: background var(--transition), border-color var(--transition), color var(--transition);
  cursor: pointer;
  border-radius: 0 20px 20px 0;
  background: transparent;
}

.nav-link:hover,
.nav-link:focus {
  background: var(--sidebar-bg-hover);
  outline: none;
  color: #fff;
}

.active-link,
.router-link-exact-active {
  font-weight: bold;
  text-decoration: none;
  border-left: 4px solid var(--sidebar-link-active);
  background: var(--sidebar-bg-hover);
  color: var(--sidebar-link-active);
}

.main-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.main-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: var(--header-bg);
  padding: 1.5rem 2rem 1rem 2rem;
  box-shadow: var(--header-shadow);
  min-height: 80px;
}

.logo {
  display: block;
  width: 48px;
  height: 48px;
}

.main-header h1 {
  font-size: 2rem;
  color: var(--sidebar-bg);
  margin: 0;
  font-weight: 700;
  letter-spacing: 1px;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background: var(--main-bg);
  overflow-y: auto;
  min-width: 0;
  transition: padding var(--transition);
}

/* Responsividade */
@media (max-width: 900px) {
  .layout {
    flex-direction: column;
  }
  .sidebar {
    flex-direction: row;
    width: 100vw;
    min-height: unset;
    height: 60px;
    padding-top: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    align-items: center;
    justify-content: center;
  }
  .sidebar ul {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
  .sidebar li {
    margin: 0 0.5rem;
  }
  .nav-link {
    padding: 0.5rem 1rem;
    border-left: none;
    border-bottom: 3px solid transparent;
    border-radius: 0;
    font-size: 1rem;
  }
  .active-link,
  .router-link-exact-active {
    border-left: none;
    border-bottom: 3px solid var(--sidebar-link-active);
    background: transparent;
    color: var(--sidebar-link-active);
  }
  .main-header {
    padding: 1rem 1.2rem 0.5rem 1.2rem;
    min-height: 60px;
  }
  .main-content {
    padding: 1rem;
  }
}

@media (max-width: 600px) {
  .main-header h1 {
    font-size: 1.2rem;
  }
  .logo {
    width: 36px;
    height: 36px;
  }
  .main-content {
    padding: 0.5rem;
  }
}
</style>


