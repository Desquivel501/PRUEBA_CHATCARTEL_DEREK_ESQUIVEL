# Despliegue Local

Para desplegar la aplicación localmente, se siguen los siguientes pasos:

1. Clonar el repositorio desde GitHub:

```bash
$ git clone https://github.com/Desquivel501/PRUEBA_CHATCARTEL_DEREK_ESQUIVEL.git
```

2. Navegar al directorio del proyecto:

```bash
$ cd PRUEBA_CHATCARTEL_DEREK_ESQUIVEL
```

3. Instalar las dependencias:

```bash
$ npm install
```

4. Iniciar la aplicación:

```bash
$ npm start
```

5. Abre tu navegador y visita `http://localhost:8000` para interactuar con la aplicación.


# Despliegue en Heroku

Para desplegar la aplicación en Heroku, se siguen los siguientes pasos:

1. Clonar el repositorio desde GitHub:

```bash
$ git clone https://github.com/Desquivel501/PRUEBA_CHATCARTEL_DEREK_ESQUIVEL.git
```

2. Navegar al directorio del proyecto:

```bash
$ cd PRUEBA_CHATCARTEL_DEREK_ESQUIVEL
```

3. Instalar las dependencias:

```bash
$ npm install
```

4. Iniciamos sesión en Heroku

```bash
$ heroku login
```

5. Crear app en Heroku
```bash
$ heroku create prueba-chatcartel
```

6. Antes de que la aplicación pueda ser desplegada, deberemos de crear todas las variables de entorno que estan en .env en las variables de entorno (Vars) de heroku.

![vars](https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fdrive.google.com/uc?id=15wSkZyW3rrM73IP6OScdgLnEhBUDW-dJ)

En este caso, estas variables son:
- Token secreto de JWT
- URI de conexión con MongoDB Atlas
- Puerto de la aplicación (8000)


7. Ahora le damos push al repositorio a la app
```bash
$ git push heroku main
```


8. Una vez desplegada la app, abrimos la app en el navegador con:
```bash
$ heroku open
```

# Interacción con API
Los enpoints de la API pueden ser probados utilizando [colección de Postman.](https://www.postman.com/material-cosmonaut-3836233/workspace/prueba-chatcartel/collection/15323453-1a759164-3630-4832-ba05-c862c56dd1d9)

Está tiene una lista con los endpoints que estan creados en la API.

![api_list](https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fdrive.google.com/uc?id=1wySs0v7PBWttFLc8_XrD95kmd7ikhb1K)

## Configuración

Todos los endpoints menos ```Register``` y ```Login``` requieren autorización con JWT. 

Al iniciar sesión con el endpoint ```Login``` la API regresará un token de JWT, por lo que se deberá de modificar la variable global de Postman ```JWT_TOKEN``` con el texto "Bearer \<token>". 

Asi mismo, con la variable ```URL_HOST``` se puede modificar el URL de la app.

## Envío de solicitudes
Al dar click en un endpoint en la lista se abrirá una ventana permitiendo realizar la petición.

![api_usage](https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fdrive.google.com/uc?id=1FgfTveBJbeo-s9302rsmxVvc0-U_DuRh)

El endpoint tendra distintos tipos de metodo (GET, POST, PATCH, etc.), dependiendo de este tendrá diferentes parametros. Se enviará la petición a la API al dar click al boton "Send"

Los endpoints como POST, PATCH y DELETE necesitarán un Body, este será un archivo JSON con los datos a enviar a la API. En la colección ya estan creados los JSON necesarios para cada endpoint, por lo que solo se deberá modificar los datos necesarios.

Algunos endpoints tendran parametros (Params), estos son opcionales y podrán ser seleccinonados para filtrar los datos recibidos.

Información especifica sobre cada endpint podrá ser vista en la sección de ```Overview``` de cada endpoint.