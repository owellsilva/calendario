new Vue({
  el: '#app',
  data: () => ({ 
    larguraTela: 0,
    idInterno: 0,
    modalNovoCompromiso: false,
    modalDiaSemana: false,
    tipoCalendario: 'month',
    modalMes: false,
    modalHora: false,
    modalData: false,
    botaoAdicionarVisivel: true,
    mes: new Date().toISOString().substr(0, 7),
    ano: parseInt(new Date().toISOString().substr(0, 4)),
    dataAtualCalendario: moment().format('YYYY-MM-DD'),
    diaSemana: new Date().toISOString().substr(0, 10),
    cores: [
    { value: 'blue', text: 'Azul' },
    { value: 'green', text: 'Verde' },
    { value: 'yellow', text: 'Amarillo' },
    { value: 'orange', text: 'Naranja' },
    { value: 'purple', text: 'Purpura' },
    { value: 'red', text: 'Rojo' },
    { value: 'black', text: 'Negro' }],

    novoCompromiso: {
      id: 0,
      titulo: '',
      detalles: '',
      date: '',
      aberto: false,
      cor: 'blue',
      hour: 0,
      minute: 0,
      time: '' },

    hoje: moment().format('YYYY-MM-DD'),
    events: [],
    regrasTitulo: [
    v => !!v || 'Por favor ingrese el título del Compromiso',
    v => v.length <= 30 || 'El título debe contener un máximo de 30 caracteres.'],

    regrasData: [
    v => !!v || 'Por favor informar la fecha del Compromiso'],

    regrasHora: [
    v => !!v || 'Por favor informar la hora de la cita'] }),


  computed: {
    dataDiaSemanaFormatada() {
      if (this.diaSemana == '') {
        return '';
      }
      return moment(this.diaSemana, 'YYYY-MM-DD').format('DD/MM/YYYY');
    },
    dataCompromisoFormatada() {
      if (this.novoCompromiso.date == '') {
        return '';
      }
      return moment(this.novoCompromiso.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
    },
    textoMesSelecionado() {
      let mesSelecionado = parseInt(this.mes.split('-')[1]);
      let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiempre", "Octubre", "Noviembre", "Diciembre"];

      return meses[mesSelecionado - 1] + ' de ' + this.ano;
    },
    textoBotaoSalvar() {
      return this.novoCompromiso.id ? 'Editar' : 'Adicionar';
    },
    // convertir la lista de eventos en un mapa de listas tecleadas por fecha
    eventsMap() {
      const map = {};
      this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e));
      return map;
    } },

  methods: {
    estilizarDiasSemana(tipoCalendario) {
      if (tipoCalendario == 'week' || tipoCalendario == 'day') {
        setTimeout(() => {
          var elementos = document.querySelectorAll('.v-calendar-daily_head-day-label');
          if (elementos.length > 1) {
            elementos.forEach(e => {
              e.classList.add('label-dia-semana');
            });
          } else if (elementos.length == 1) {
            elementos[0].classList.remove('label-dia-semana');
          }
        }, 50);
      }
    },
    retornarDataFormatada(data) {
      return moment(data, 'YYYY-MM-DD').format('DD/MM/YYYY');
    },
    formatarIntervalo(i) {return i.time;},
    retornarEventosPorHora(data, hora, minuto) {
      return this.events.filter(ev => {
        if (ev.date == data && ev.hour == hora) {
          if (minuto == 0 && ev.minute <= 29) {
            return true;
          } else if (minuto == 30 && ev.minute >= 30) {
            return true;
          }
        }
        return false;
      });
    },
    salvarDiaSemana(e) {
      this.modalDiaSemana = false;
      this.dataAtualCalendario = e;
      this.$refs.modalDiaSemana.save(e);
      var split = e.split('-');
      this.ano = parseInt(split[0]);
      this.mes = split[0] + '-' + split[1];
    },
    adiantar() {
      switch (this.tipoCalendario) {
        case 'month':
          this.$refs.calendario.next();
          let mesAtual = parseInt(this.mes.split('-')[1]);
          mesAtual++;
          if (mesAtual > 12) {
            mesAtual = 1;
            this.ano++;
          }
          this.mes = this.ano + '-' + mesAtual;
          this.dataAtualCalendario = this.mes + '-01';
          break;
        case 'day':
          this.$refs.calendario.next();
          this.diaSemana = moment(this.diaSemana, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD');
          this.dataAtualCalendario = this.diaSemana;
          this.ano = parseInt(this.dataAtualCalendario.split('-')[0]);
          this.mes = this.dataAtualCalendario.split('-')[0] + '-' + this.dataAtualCalendario.split('-')[1];
          break;
        case 'week':
          this.$refs.calendario.next();
          this.diaSemana = moment(this.diaSemana, 'YYYY-MM-DD').
          day(7) //próximo domingo
          .format('YYYY-MM-DD');
          this.dataAtualCalendario = this.diaSemana;
          this.ano = parseInt(this.dataAtualCalendario.split('-')[0]);
          this.mes = this.dataAtualCalendario.split('-')[0] + '-' + this.dataAtualCalendario.split('-')[1];
          break;}

      this.estilizarDiasSemana(this.tipoCalendario);
    },
    voltar() {
      switch (this.tipoCalendario) {
        case 'month':
          this.$refs.calendario.prev();
          let mesAtual = parseInt(this.mes.split('-')[1]);

          mesAtual--;
          if (mesAtual < 1) {
            mesAtual = 12;
            this.ano--;
          }
          this.mes = this.ano + '-' + mesAtual;
          this.dataAtualCalendario = this.mes + '-01';
          break;
        case 'day':
          this.$refs.calendario.prev();
          this.diaSemana = moment(this.diaSemana, 'YYYY-MM-DD').add(-1, 'days').format('YYYY-MM-DD');
          this.dataAtualCalendario = this.diaSemana;
          this.ano = parseInt(this.dataAtualCalendario.split('-')[0]);
          this.mes = this.dataAtualCalendario.split('-')[0] + '-' + this.dataAtualCalendario.split('-')[1];
          break;
        case 'week':
          this.$refs.calendario.prev();
          this.diaSemana = moment(this.diaSemana, 'YYYY-MM-DD').
          day(-7) //domingo anterior
          .format('YYYY-MM-DD');
          this.dataAtualCalendario = this.diaSemana;
          this.ano = parseInt(this.dataAtualCalendario.split('-')[0]);
          this.mes = this.dataAtualCalendario.split('-')[0] + '-' + this.dataAtualCalendario.split('-')[1];
          break;}

      this.estilizarDiasSemana(this.tipoCalendario);
    },
    selecionarData(e) {
      this.modalMes = false;
      this.$refs.modalMes.save(e);
      this.dataAtualCalendario = e + '-01';
      this.diaSemana = this.dataAtualCalendario;
      this.ano = parseInt(e.split('-')[0]);
    },
    cadastrarNovoCompromiso(e) {
      this.novoCompromiso = {
        titulo: '',
        detalhes: '',
        date: '',
        aberto: false,
        cor: 'blue',
        hour: 0,
        minute: 0,
        time: '' };

      this.$refs.formularioCompromiso.resetValidation();
      if (e) {
        this.novoCompromiso.date = e.date;
        this.novoCompromiso.hour = e.hour;
        this.novoCompromiso.minute = e.minute;
        this.novoCompromiso.time = e.time;
      }
      this.modalNovoCompromiso = true;
      setTimeout(() => {
        this.$refs.tituloNovoCompromiso.focus();
      }, 300);

    },
    retornarProximoId() {
      this.idInterno++;
      return this.idInterno;
    },
    selecionarParaEdicao(compr) {
      this.novoCompromiso = {
        id: compr.id,
        titulo: compr.titulo,
        detalhes: compr.detalhes,
        date: compr.date,
        aberto: compr.aberto,
        cor: compr.cor,
        hour: compr.hour,
        minute: compr.minute,
        time: compr.time };

      this.modalNovoCompromiso = true;
    },
    salvarCompromiso() {
      if (!this.$refs.formularioCompromiso.validate()) {
        return;
      }

      if (!this.novoCompromiso.id) {//registro
        this.novoCompromiso.id = this.retornarProximoId();
        this.events.push(this.novoCompromiso);

      } else {//edición
        let Compromiso = this.events.find(e => {
          return e.id == this.novoCompromiso.id;
        });
        Compromiso.titulo = this.novoCompromiso.titulo;
        Compromiso.detalhes = this.novoCompromiso.detalhes;
        Compromiso.cor = this.novoCompromiso.cor;
        Compromiso.hour = this.novoCompromiso.hour;
        Compromiso.minute = this.novoCompromiso.minute;
        Compromiso.time = this.novoCompromiso.time;
        Compromiso.date = this.novoCompromiso.date;
      }
      this.novoCompromiso = {
        titulo: '',
        detalhes: '',
        date: '',
        aberto: false,
        cor: 'blue',
        hour: 0,
        minute: 0,
        time: '' };

      this.modalNovoCompromiso = false;
      this.$refs.formularioCompromiso.resetValidation();
    },
    excluirCompromiso(id) {
      if (confirm('¿Está seguro de que desea eliminar esta cita?')) {
        var index = this.events.findIndex(e => {
          return e.id == id;
        });
        this.events.splice(index, 1);
      }
    },
    salvarHoraNovoCompromiso() {
      this.$refs.modalHora.save(this.novoCompromiso.time);
      let horaMinuto = this.novoCompromiso.time.split(':');
      this.novoCompromiso.hour = horaMinuto[0];
      this.novoCompromiso.minute = horaMinuto[1];
    } },

  created() {
    this.larguraTela = window.innerWidth;
  },
  watch: {
    modalNovoCompromiso(v) {
      if (!v) {
        this.$refs.formularioCompromiso.resetValidation();
        this.botaoAdicionarVisivel = true;
      } else {
        this.botaoAdicionarVisivel = false;
      }
    },
    tipoCalendario(tipo) {
      this.estilizarDiasSemana(tipo);
    } } });