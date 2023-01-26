## Filosofia

Esta plantilla esta pensada para trabajar en equipo. Se ha estructurado como un proyecto en el que nunca se van a desarrolar directamente funcionalidades específicas sino genéricas, eso quiere decir que si hay que añadir una funcionalidad en la pantalla de login que puede beneficiar a los demás proyectos, se deberá crear una merge request en el proyecto genérico (web/materialism-v2). En cambio si se tiene que añadir en la pantalla de login un checkbox para aceptar los términos y condiciones y es especifico del proyecto mutuabalear, se deberá crear una merge request en el proyecto de mutuabalear. Esta estrategia es posible gracias a la creación de forks del proyecto genérico.

## Creación de un proyecto

Vamos al proyecto genérico y pulsamos en el botón fork. Seguidamente nos pedirán en que workspace queremos el nuevo proyecto, lo creamos y nos creará una copia del proyecto genérico con el mismo nombre, podemos ir a las opciones y cambiarlo en cualquier momento.

## Instalación

Todas las dependencias se gestionan a través del fichero package.json

`$ npm install`

`$ npm start`

## [Webpack](https://webpack.js.org/)

Se recomienda hacer un pequeño proyecto de web estática con un fichero js y un fichero css y un index.html y empaquetarlo con webpack para aprender el funcionamiento básico de [webpack](https://webpack.js.org/concepts/).

## Desarollo

Para poder mantener el proyecto específico al dia con la plantilla se va a tener que fusionar el proyecto genérico con el proyecto específico en el directorio de nuestra máquina local.

`$ git clone git@gitlab.apploading.com:grupo/proyecto-específico.git`

Con este paso tenemos el fork específico basado en la plantilla, si hacemos algún cambio en este proyecto:

### Cambio genérico

Los cambios genéricos se pueden realizar desde el proyecto genérico directamente o desde el proyecto específico. Ahora se supondrá que estamos trabajando en local desde un proyecto específico.

```bash
$ git checkout -b cambio-generico
// realizamos cambios
$ git add .
$ git commit -m "Añadido cambio generico"
$ git push origin cambio-generico
```

Ahora desde gitlab podremos crear una merge request. Gracias a la relación de fork que tenemos establecida por gitlab veremos que cuando asignamos la rama de destino para la merge request podemos elegir el proyecto genérico o el proyecto específico. En este caso elegiremos el proyecto genérico ya que el cambio puede servir a otros proyectos. Una vez hecho el merge nos daremos cuenta de que aunque los cambios estan disponibles en el proyecto genérico no lo están en nuestro proyecto específico. Para obtener esos cambios debemos hacer:

```bash
$ git remote add template git@gitlab.apploading.com:web/materialism-v2.git
$ git pull template master
```

De esta manera obtendremos los últimos cambios y aprovechando la relación de fork

