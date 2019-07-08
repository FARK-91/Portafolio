//RENIER: Declaramos constantes necesarias
// Con la funcion getElementById() puedo asignar toda una etiqueta a una variable.
const celeste = document.getElementById('celeste')
const violeta = document.getElementById('violeta')
const naranja = document.getElementById('naranja')
const verde = document.getElementById('verde')
const btnEmpezar = document.getElementById('btnEmpezar')
const ULTIMO_NIVEL = 5

// Definimos una clase que controlara el comportamiento del juego
class Juego {
  constructor() {
    this.inicializar = this.inicializar.bind(this)
    // Retrasamos el empezar juego medio segundo, luego de que el usuario hace
    // click en boton empezar.
    // Definimos atributos necesarios
    this.inicializar()

    // Generamos la secuencia del juego
    this.generarSecuencia()

    // Generamos logica para el siguiente nivel del Juego
    setTimeout(this.siguienteNivel() , 1000)
    // Llamado a funcion agregarEventosClick para controlar los clicks que hara
    // el usuario en el juego
    this.agregarEventosClick()
  }

  // Creamos la funcion inicializar para ocultar el boton de Empezar
  inicializar() {
    // Activamos o desactivamos el boton empezar.
    this.toggleBtnEmpezar()

    // Para evitar usar el bind tantas veces, lo podemos capturar desde donde
    // necesitamos el this con la siguiente sentencia.
    // this.elegirColor = this.elegirColor.bind(this)
    this.nivel = 1
    this.colores = {
      // Defino el objetpo colores con sus respectivos valores
      // estos me seriviran mas adelante para manipular los colores en HTML.
      'celeste' : celeste,
      'violeta' : violeta,
      'naranja' : naranja,
      'verde' : verde,
    }
  }

  toggleBtnEmpezar(){
    if(btnEmpezar.classList.contains('hide')){
      btnEmpezar.classList.remove('hide')
    }else {
      btnEmpezar.classList.add('hide')
    }
  }

    generarSecuencia(){
      // Definimos un Ramdom Array para la secuencia de seleccion de colores
      // Esta sentencia Array me define la cantidad de posiciones que tendra el
      // array, mientras que fill me permite inicializar el array en cero
      // ya que la funcion map() no permite arrays vacios.
      this.secuencia = new Array(ULTIMO_NIVEL).fill(0).map(n => Math.floor(Math.random() * 4))
      console.log(this.secuencia)
    }

    siguienteNivel(){
      this.subNivel = 0
      this.iluminarSecuencia()
    }

    // Creamos funcion para generar color y poder iluminarlo
    transformarNumeroAColor(numero) {
      switch (numero) {
        case 0:
          return 'celeste'
        case 1:
          return 'violeta'
        case 2:
          return 'naranja'
        case 3:
          return 'verde'
      }
    }

    // Con esta funcion hacermos el proceso inverso de transformar un
    // color a numero, para comparar si el usuario presiono el boton correcto.
    transformarColorANumero(color) {
      switch (color) {
        case 'celeste':
          return 0
        case 'violeta':
          return 1
        case 'naranja':
          return 2
        case 'verde':
          return 3
      }
    }

    // Funcion que ilumina los colores
    // REVISAR a partir de aqui......***********************************
    // *****************************************************************
    // *****************************************************************
    iluminarSecuencia(){
      for (let i = 0; i < this.nivel; i++){
        // declarar let, permite que la variable se mantenga en cada iteracion
        // y no se sobre-escriba tal como pasa en Python.
        const color = this.transformarNumeroAColor(this.secuencia[i])
        console.log(color)
        setTimeout(() => this.iluminarColor(color), 1000 * i)
        // console.log(color)
      }
    }

  // Funcion para agregar iluminacion a un color
  iluminarColor(color){
    // Se agrega una clase ya pre-declarada en el documento CSS style.css
    this.colores[color].classList.add('light')
    setTimeout(() => this.apagarColor(color), 350)
  }

  apagarColor(color){
    this.colores[color].classList.remove('light')
  }

  // Agregamos un evento escucha click en cada colo o boton del jurgo
  // Con esto capturamos en que boton exacto hizo click el usuario.
  agregarEventosClick(){
    // capturamos el this en este momento y se lo pasamos a cada evento
    // con la funcion nativa .bind()
    self = this
    this.colores['celeste'].addEventListener('click', this.elegirColor.bind(self))
    // this.colores['celeste'].addEventListener('click', this.elegirColor.bind(this))
    this.colores['violeta'].addEventListener('click', this.elegirColor.bind(self))
    this.colores['naranja'].addEventListener('click', this.elegirColor.bind(self))
    this.colores['verde'].addEventListener('click', this.elegirColor.bind(self))
  }

  // Eliminamos el evento escucha anterior
  eliminarEventosClick(){
    self = this
    this.colores['celeste'].removeEventListener('click', this.elegirColor.bind(self))
    // this.colores['celeste'].addEventListener('click', this.elegirColor.bind(this))
    this.colores['violeta'].removeEventListener('click', this.elegirColor.bind(self))
    this.colores['naranja'].removeEventListener('click', this.elegirColor.bind(self))
    this.colores['verde'].removeEventListener('click', this.elegirColor.bind(self))
  }

  elegirColor(ev){
    // El parametro ev me permite tener todos los elementos del click generado por el usuario
    // console.log(ev)
    // Con el bind() anterior nos aseguramos de tener el this general del juego
    // disponible en esta funcion, si no aplicabamos el this, no podriamos
    // tener acceso a los valores del juego.
    // console.log(this)
    const nombreColor = ev.target.dataset.color
    // LLamamos la siguiente funcion para verificar si el usuario selecciono el
    // color de forma correcta segun su numero.
    const numeroColor = this.transformarColorANumero(nombreColor)
    this.iluminarColor(nombreColor)
    // Si el usuario selecciono el color correcto, se aplica la siguiente logica.
    if (numeroColor === this.secuencia[this.subNivel]){
      // Aumentamos subNivel
      this.subNivel++
      // Si llega al la secuencia del nivel actual, aumentamos el nivel en uno +1
      if (this.subNivel === this.nivel) {
        this.nivel++
        this.eliminarEventosClick()
        // Si es el ultimo nivel le avisamos al usuario que gano.
        if (this.nivel === (ULTIMO_NIVEL + 1)) {
          // Gano
          this.ganoElJuego()
        }
        // Si no es el ultimo, avanza al siguiente nivel
        else {
          // Considerar que la funcion setTimeout cambia el valor de this,
          // coloca por defecto el valor de donde se encuentre actualmente.
          // En este caso como la funcion siguienteNivel es ejecutada por
          // la clase principal juego() entonces cambiamos el valor de this.
          // el valor de this es cambiado por el asincronismo, en el momento
          // que una funcion la ejecuta el navegador en lugar de la clase principal.
          setTimeout(this.siguienteNivel.bind(this), 1500)

        }
      }
    }
    // Si no corresponde el color seleccionado con el numero correspondiente,
    // el usuario habra perdido el juego.
    else {
      this.eliminarEventosClick()
      this.perdioElJuego()
    }
  }

  ganoElJuego() {
    // swal es una libreria cdn para deplegar alerts mas elegantes.
    // dicha funcion devuelve una promesa
    swal('Muy bien  ', 'Felicitaciones, Ganaste!', 'success')
    .then(() => {
      this.inicializar()
    })
  }

  perdioElJuego() {
    // swal es una libreria cdn para deplegar alerts mas elegantes.
    // dicha funcion devuelve una promesa
    swal('Upss', 'Lo siento, haz perdido 	:(', 'error')
    .then(() => {
      this.inicializar()
    })
  }

}

function empezarJuego() {
  // window.juego = new Juego()
  // Inicia el juego invocando la clase Juego(), la cual pasara primero por
  // el constructor.
  var juego = new Juego()
}
