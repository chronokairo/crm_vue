<template>
  <div class="modal-bg" @click.self="$emit('close')">
    <div class="modal" tabindex="-1" style="top: 50%; left: 50%; transform: translate(-50%, -50%); position: fixed;">
      <div class="modal-header">
        <h2>{{ isEdit ? 'Editar Contato' : 'Novo Contato' }}</h2>
        <button class="close" @click="$emit('close')">×</button>
      </div>
      <div class="wizard-steps">
        <button v-for="(step, i) in steps" :key="i" :class="{ ativo: stepIndex === i }" @click="goToStep(i)">{{ step }}</button>
      </div>
      <form v-if="stepIndex === 0" class="modal-form">
        <div class="col">
          <input v-model="contato.nome" placeholder="Nome*" required />
          <input v-model="contato.email" placeholder="Email*" required @input="validarEmail" :class="{ invalido: !emailValido && contato.email }" />
          <input v-model="contato.telefone" placeholder="Telefone*" required @input="mascararTelefone" maxlength="15" :class="{ invalido: !telefoneValido && contato.telefone }" />
          <input v-model="contato.dataNascimento" placeholder="Data de Nascimento" type="date" />
        </div>
        <div class="col">
          <input v-model="contato.endereco" placeholder="Endereço" />
          <input v-model="contato.website" placeholder="Website" />
          <input v-model="contato.linkedin" placeholder="LinkedIn" />
        </div>
      </form>
      <form v-else-if="stepIndex === 1" class="modal-form">
        <div class="col">
          <input v-model="contato.empresa" placeholder="Empresa*" required />
          <input v-model="contato.cargo" placeholder="Cargo*" required />
          <input v-model="contato.segmento" placeholder="Segmento de Mercado" />
          <input v-model="contato.comoConheceu" placeholder="Como conheceu a empresa" />
        </div>
        <div class="col">
          <input v-model="contato.status" placeholder="Status" />
          <input v-model="contato.tags" placeholder="Tags (separadas por vírgula)" />
          <input v-model="contato.prioridade" placeholder="Prioridade (Alta, Média, Baixa)" />
        </div>
      </form>
      <form v-else-if="stepIndex === 2" class="modal-form">
        <div class="col">
          <textarea v-model="contato.observacoes" placeholder="Observações/Notas"></textarea>
        </div>
        <div class="col preview">
          <h3>Preview</h3>
          <div class="preview-card">
            <div class="avatar-preview">{{ avatarPreview }}</div>
            <div><b>{{ contato.nome }}</b> <span v-if="contato.vip" class="badge-vip">VIP</span></div>
            <div>{{ contato.email }}</div>
            <div>{{ contato.telefone }}</div>
            <div>{{ contato.empresa }} - {{ contato.cargo }}</div>
            <div v-if="contato.status">Status: <span :class="'badge-status ' + contato.status.toLowerCase()">{{ contato.status }}</span></div>
            <div v-if="contato.tags">Tags: <span class="badge-tag" v-for="tag in contato.tags.split(',')" :key="tag">{{ tag.trim() }}</span></div>
            <div v-if="contato.prioridade">Prioridade: {{ contato.prioridade }}</div>
          </div>
        </div>
      </form>
      <div class="modal-footer">
        <button @click="prevStep" :disabled="stepIndex === 0">Voltar</button>
        <button v-if="stepIndex < steps.length - 1" @click="nextStep" :disabled="!stepValido">Próximo</button>
        <button v-else @click="salvar" :disabled="!formValido">Salvar</button>
        <button v-if="stepIndex === steps.length - 1" @click="$emit('saveAndNew', contato)">Salvar e Criar Novo</button>
        <button @click="$emit('close')">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
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
  props: {
    value: Object,
    isEdit: Boolean
  },
  emits: ['close', 'save', 'saveAndNew'],
  data() {
    return {
      contato: this.value ? { ...this.value } : {
        nome: '', email: '', telefone: '', empresa: '', cargo: '', endereco: '', website: '', linkedin: '', observacoes: '', dataNascimento: '', segmento: '', comoConheceu: '', status: '', tags: '', prioridade: '', vip: false
      },
      stepIndex: 0,
      steps: ['Pessoais', 'Profissionais', 'Notas/Preview'],
      emailValido: true,
      telefoneValido: true
    };
  },
  computed: {
    formValido() {
      return this.contato.nome && this.contato.email && this.contato.telefone && this.contato.empresa && this.contato.cargo && this.emailValido && this.telefoneValido;
    },
    stepValido() {
      if (this.stepIndex === 0) return this.contato.nome && this.contato.email && this.contato.telefone && this.emailValido && this.telefoneValido;
      if (this.stepIndex === 1) return this.contato.empresa && this.contato.cargo;
      return true;
    },
    avatarPreview() {
      if (!this.contato.nome) return '';
      return this.contato.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
    }
  },
  methods: {
    nextStep() { if (this.stepIndex < this.steps.length - 1) this.stepIndex++; },
    prevStep() { if (this.stepIndex > 0) this.stepIndex--; },
    goToStep(i) { this.stepIndex = i; },
    validarEmail() { this.emailValido = validarEmailFormat(this.contato.email); },
    mascararTelefone() { this.contato.telefone = mascararTelefoneBR(this.contato.telefone); this.telefoneValido = this.contato.telefone.length >= 14; },
    salvar() { this.$emit('save', { ...this.contato }); }
  },
  watch: {
    value(val) { this.contato = { ...val }; }
  }
};
</script>

<style scoped>
.modal-bg {
  position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; background: rgba(34,48,74,0.18); z-index: 1000; display: flex; align-items: center; justify-content: center;
}
.modal {
  background: #fff; border-radius: 14px; box-shadow: 0 8px 32px rgba(34,48,74,0.18); padding: 32px 28px; min-width: 420px; max-width: 700px; width: 100%; position: relative;
}
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.close { background: none; border: none; font-size: 2rem; cursor: pointer; color: #22304a; }
.wizard-steps { display: flex; gap: 10px; margin-bottom: 18px; }
.wizard-steps button { background: #e5e7eb; color: #22304a; border: none; padding: 6px 18px; border-radius: 4px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.wizard-steps button.ativo, .wizard-steps button:hover { background: #2563eb; color: #fff; }
.modal-form { display: flex; gap: 32px; margin-bottom: 18px; }
.col { display: flex; flex-direction: column; gap: 12px; flex: 1 1 240px; }
input, textarea { padding: 10px 12px; border: 1px solid #d1e0ee; border-radius: 5px; background: #fff; font-size: 1.08rem; color: #22304a; transition: border 0.2s; }
input:focus, textarea:focus { border: 1.5px solid #2563eb; outline: none; background: #f7fbff; }
input.invalido, textarea.invalido { border: 1.5px solid #e53e3e; background: #fff5f5; }
.modal-footer { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
.preview-card { background: #f0f4f8; border-radius: 8px; padding: 16px; margin-top: 8px; }
.avatar-preview { width: 48px; height: 48px; border-radius: 50%; background: #2563eb; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; }
.badge-vip { background: #eab308; color: #fff; border-radius: 4px; padding: 2px 8px; font-size: 0.95rem; margin-left: 6px; }
.badge-status { background: #2563eb; color: #fff; border-radius: 4px; padding: 2px 8px; font-size: 0.95rem; margin-left: 6px; }
.badge-tag { background: #e5e7eb; color: #22304a; border-radius: 4px; padding: 2px 8px; font-size: 0.95rem; margin-right: 4px; }
@media (max-width: 700px) {
  .modal { min-width: unset; padding: 12px 2vw; }
  .modal-form { flex-direction: column; gap: 14px; }
  .col { flex: 1 1 100%; }
}
</style>
